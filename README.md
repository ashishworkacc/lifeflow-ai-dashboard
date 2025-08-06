# lifeflow-ai-dashboard
✨ LifeFlow AI Dashboard — Open-source AI-powered productivity HQ! 🚀 Combining habits, health, tasks & goals with analytics, streaks & AI insights. 🔮 Perfect for portfolio building with React, TypeScript, Node. Join us! ⭐ #opensource #AI #productivity

## Features
- **Stats Overview** – visualize key metrics at a glance.
- **Tasks** – manage to-do items and track progress.
- **Habits** – monitor habit streaks and consistency.
- **Health Metrics** – log and review wellness data.
- **AI Insights** – get smart recommendations driven by AI.
- **Quick Notes** – jot down ideas or reminders.
- **Goals Progress** – track long-term objectives with entries.
- **Time Blocks** – plan your day with scheduled blocks.

## API
- **`/api/dashboard`** – aggregated dashboard data.
- **`/api/tasks`** – create and manage tasks.
- **`/api/habits`** – CRUD operations for habit tracking.
- **`/api/health-metrics`** – manage health metric entries.
- **`/api/goals`** – create and list goals.
- **`/api/goals/:goalId/entries`** – manage entries for a specific goal.
- **`/api/goal-entries/:id`** – update or delete a goal entry.
- **`/api/notes`** – create and manage notes.
- **`/api/time-blocks`** – plan and retrieve time blocks.

## Run Locally
```bash
npm install
npm run dev
npm run build
npm start
```
The app runs on `http://localhost:5000` by default.

## Storage
The demo uses an in-memory `MemStorage`, so all data resets when the server restarts.
