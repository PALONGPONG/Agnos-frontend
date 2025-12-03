## Overview
Structure : NextJS, TailwindCSS, Typescript
Real-Time Synchronization : Websocket
The system consists of a public submission form and a real-time admin dashboard, interconnected via WebSockets. When a user submits the form, a data summary modal instantly appears on the admin interface..

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Form : http://localhost:3000 ,https://agnos-inky.vercel.app
Staff : http://localhost:3000/admin ,https://agnos-inky.vercel.app/admin
## Websocket Server
```
cd websocket-server
docker compose up -d
```

ปรับ env ใน `docker-compose.yml` ได้ตามต้องการ (`SOCKET_PORT`, `SOCKET_CORS_ORIGIN`). Service จะฟังที่พอร์ต 3001 ตามค่าดีฟอลต์.

## Running locally Websocket

```
npm install
npm start
```

Environment variables:

- `SOCKET_PORT` (default `3001`)
- `SOCKET_CORS_ORIGIN` (default `*`)