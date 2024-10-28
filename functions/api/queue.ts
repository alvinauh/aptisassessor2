import { Queue } from '@cloudflare/workers-types';

export interface Env {
  TASKS: Queue;
  AUDIO_BUCKET: R2Bucket;
  AI: any;
  DB: D1Database;
}

export default {
  async queue(batch: MessageBatch<any>, env: Env): Promise<void> {
    for (const message of batch.messages) {
      const { audioKey, userId } = message.body;

      try {
        // Get audio from R2
        const audio = await env.AUDIO_BUCKET.get(audioKey);
        if (!audio) continue;

        // Process with Cloudflare AI
        const transcript = await env.AI.run('@cf/openai/whisper', {
          audio: await audio.arrayBuffer()
        });

        // Get CEFR assessment
        const assessment = await env.AI.run('@cf/openai/gpt-4', {
          messages: [{
            role: 'system',
            content: 'Assess the following English speech transcript and determine CEFR level (A1-C2).'
          }, {
            role: 'user',
            content: transcript
          }]
        });

        // Save results
        await env.DB.prepare(`
          INSERT INTO assessments (user_id, type, content, cefr_level)
          VALUES (?, 'speaking', ?, ?)
        `).bind(userId, transcript, assessment.level).run();

        // Update audio submission
        await env.DB.prepare(`
          UPDATE audio_submissions 
          SET transcript = ? 
          WHERE r2_key = ?
        `).bind(transcript, audioKey).run();

        message.ack();
      } catch (error) {
        console.error('Queue processing error:', error);
        message.retry();
      }
    }
  }
};