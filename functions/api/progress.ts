import { Hono } from 'hono';
import { handle } from 'hono/cloudflare-pages';

type Bindings = {
  DB: D1Database;
  CACHE: KVNamespace;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get('/api/progress/:userId', async (c) => {
  const { userId } = c.req.param();
  
  // Try cache first
  const cacheKey = `progress:${userId}`;
  const cached = await c.env.CACHE.get(cacheKey);
  if (cached) return c.json(JSON.parse(cached));

  // Get latest assessment for each skill
  const progress = await c.env.DB.prepare(`
    WITH RankedAssessments AS (
      SELECT 
        type as skill,
        cefr_level as level,
        created_at as date,
        ROW_NUMBER() OVER (PARTITION BY type ORDER BY created_at DESC) as rn
      FROM assessments
      WHERE user_id = ?
    )
    SELECT skill, level, date
    FROM RankedAssessments
    WHERE rn = 1
    ORDER BY date DESC
  `).bind(userId).all();

  // Calculate improvements
  const results = await Promise.all(
    progress.results.map(async (current: any) => {
      const previous = await c.env.DB.prepare(`
        SELECT cefr_level
        FROM assessments
        WHERE user_id = ?
          AND type = ?
          AND created_at < ?
        ORDER BY created_at DESC
        LIMIT 1
      `).bind(userId, current.skill, current.date).get();

      const improvement = previous
        ? calculateImprovement(previous.cefr_level, current.level)
        : 0;

      return {
        ...current,
        improvement,
      };
    })
  );

  // Cache for 1 hour
  await c.env.CACHE.put(cacheKey, JSON.stringify(results), { expirationTtl: 3600 });

  return c.json(results);
});

function calculateImprovement(previous: string, current: string): number {
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const prevIndex = levels.indexOf(previous);
  const currIndex = levels.indexOf(current);
  return Math.max(0, currIndex - prevIndex);
}

export const onRequest = handle(app);