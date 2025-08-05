import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertTaskSchema, insertHabitSchema, insertHealthMetricSchema,
  insertGoalSchema, insertGoalEntrySchema, insertNoteSchema, insertTimeBlockSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const DEMO_USER_ID = "demo-user";

  // Dashboard data endpoint
  app.get("/api/dashboard", async (req, res) => {
    try {
      const [tasks, habits, goals, timeBlocks, healthMetrics, notes] = await Promise.all([
        storage.getTasks(DEMO_USER_ID),
        storage.getHabits(DEMO_USER_ID),
        storage.getGoals(DEMO_USER_ID),
        storage.getTimeBlocks(DEMO_USER_ID),
        storage.getHealthMetrics(DEMO_USER_ID),
        storage.getNotes(DEMO_USER_ID)
      ]);

      const user = await storage.getUser(DEMO_USER_ID);
      
      res.json({
        user,
        tasks,
        habits,
        goals,
        timeBlocks,
        healthMetrics,
        notes: notes.slice(0, 5) // Latest 5 notes
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  // Tasks endpoints
  app.get("/api/tasks", async (req, res) => {
    try {
      const tasks = await storage.getTasks(DEMO_USER_ID);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse({ ...req.body, userId: DEMO_USER_ID });
      const task = await storage.createTask(taskData);
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ message: "Invalid task data" });
    }
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const task = await storage.updateTask(id, updates);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteTask(id);
      if (!success) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // Habits endpoints
  app.get("/api/habits", async (req, res) => {
    try {
      const habits = await storage.getHabits(DEMO_USER_ID);
      res.json(habits);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch habits" });
    }
  });

  app.post("/api/habits", async (req, res) => {
    try {
      const habitData = insertHabitSchema.parse({ ...req.body, userId: DEMO_USER_ID });
      const habit = await storage.createHabit(habitData);
      res.status(201).json(habit);
    } catch (error) {
      res.status(400).json({ message: "Invalid habit data" });
    }
  });

  app.patch("/api/habits/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const habit = await storage.updateHabit(id, updates);
      if (!habit) {
        return res.status(404).json({ message: "Habit not found" });
      }
      res.json(habit);
    } catch (error) {
      res.status(400).json({ message: "Failed to update habit" });
    }
  });

  // Health metrics endpoints
  app.get("/api/health-metrics", async (req, res) => {
    try {
      const metrics = await storage.getHealthMetrics(DEMO_USER_ID);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch health metrics" });
    }
  });

  app.post("/api/health-metrics", async (req, res) => {
    try {
      const metricData = insertHealthMetricSchema.parse({ ...req.body, userId: DEMO_USER_ID });
      const metric = await storage.createHealthMetric(metricData);
      res.status(201).json(metric);
    } catch (error) {
      res.status(400).json({ message: "Invalid health metric data" });
    }
  });

  // Goals endpoints
  app.get("/api/goals", async (req, res) => {
    try {
      const goals = await storage.getGoals(DEMO_USER_ID);
      res.json(goals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch goals" });
    }
  });

  app.post("/api/goals", async (req, res) => {
    try {
      const goalData = insertGoalSchema.parse({ ...req.body, userId: DEMO_USER_ID });
      const goal = await storage.createGoal(goalData);
      res.status(201).json(goal);
    } catch (error) {
      res.status(400).json({ message: "Invalid goal data" });
    }
  });

  app.patch("/api/goals/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const goal = await storage.updateGoal(id, updates);
      if (!goal) {
        return res.status(404).json({ message: "Goal not found" });
      }
      res.json(goal);
    } catch (error) {
      res.status(400).json({ message: "Failed to update goal" });
    }
  });

  app.delete("/api/goals/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteGoal(id);
      if (!success) {
        return res.status(404).json({ message: "Goal not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: "Failed to delete goal" });
    }
  });

  // Goal entries endpoints
  app.get("/api/goals/:goalId/entries", async (req, res) => {
    try {
      const { goalId } = req.params;
      const entries = await storage.getGoalEntries(goalId);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch goal entries" });
    }
  });

  app.post("/api/goals/:goalId/entries", async (req, res) => {
    try {
      const { goalId } = req.params;
      const entryData = insertGoalEntrySchema.parse({ ...req.body, goalId });
      const entry = await storage.createGoalEntry(entryData);
      
      // Return updated goal and entry
      const updatedGoal = await storage.getGoals(DEMO_USER_ID);
      const goal = updatedGoal.find(g => g.id === goalId);
      
      res.status(201).json({ entry, goal });
    } catch (error) {
      res.status(400).json({ message: "Failed to create goal entry" });
    }
  });

  app.delete("/api/goal-entries/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteGoalEntry(id);
      if (!success) {
        return res.status(404).json({ message: "Goal entry not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: "Failed to delete goal entry" });
    }
  });

  // Notes endpoints
  app.get("/api/notes", async (req, res) => {
    try {
      const notes = await storage.getNotes(DEMO_USER_ID);
      res.json(notes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notes" });
    }
  });

  app.post("/api/notes", async (req, res) => {
    try {
      const noteData = insertNoteSchema.parse({ ...req.body, userId: DEMO_USER_ID });
      const note = await storage.createNote(noteData);
      res.status(201).json(note);
    } catch (error) {
      res.status(400).json({ message: "Invalid note data" });
    }
  });

  app.patch("/api/notes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const note = await storage.updateNote(id, updates);
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.json(note);
    } catch (error) {
      res.status(400).json({ message: "Failed to update note" });
    }
  });

  // Time blocks endpoints
  app.get("/api/time-blocks", async (req, res) => {
    try {
      const { date } = req.query;
      const timeBlocks = await storage.getTimeBlocks(DEMO_USER_ID, date as string);
      res.json(timeBlocks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch time blocks" });
    }
  });

  app.post("/api/time-blocks", async (req, res) => {
    try {
      const blockData = insertTimeBlockSchema.parse({ ...req.body, userId: DEMO_USER_ID });
      const block = await storage.createTimeBlock(blockData);
      res.status(201).json(block);
    } catch (error) {
      res.status(400).json({ message: "Invalid time block data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
