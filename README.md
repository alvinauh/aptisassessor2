# APTIS Practice Test App - Cloudflare Edition

This application helps users practice for the APTIS English language test using Cloudflare's suite of services.

## Architecture

- **Frontend**: React + Vite, deployed on Cloudflare Pages
- **Backend**: Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite)
- **Storage**: Cloudflare R2 for audio files
- **Caching**: Cloudflare KV Store
- **AI Processing**: Cloudflare AI Gateway
- **Async Tasks**: Cloudflare Queues
- **Analytics**: Cloudflare Analytics

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Cloudflare:
   ```bash
   npx wrangler login
   npx wrangler d1 create aptis_db
   npx wrangler r2 bucket create aptis-audio
   npx wrangler kv:namespace create CACHE
   ```

3. Update `wrangler.toml` with your Cloudflare resource IDs

4. Initialize D1 database:
   ```bash
   npx wrangler d1 execute aptis_db --file=./schema.sql
   ```

5. Start development server:
   ```bash
   npm run dev
   ```

## Deployment

```bash
npm run deploy
```

## Features

- User authentication with JWT
- Real-time audio recording and processing
- CEFR level assessment using AI
- Progress tracking
- Admin dashboard
- Serverless architecture
- Global CDN delivery

## License

MIT License - see LICENSE.md