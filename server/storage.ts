import { 
  type User, type InsertUser, type Task, type InsertTask,
  type Habit, type InsertHabit, type HealthMetric, type InsertHealthMetric,
  type Goal, type InsertGoal, type GoalEntry, type InsertGoalEntry,
  type Note, type InsertNote, type TimeBlock, type InsertTimeBlock
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Tasks
  getTasks(userId: string): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;
  
  // Habits
  getHabits(userId: string): Promise<Habit[]>;
  createHabit(habit: InsertHabit): Promise<Habit>;
  updateHabit(id: string, updates: Partial<Habit>): Promise<Habit | undefined>;
  deleteHabit(id: string): Promise<boolean>;
  
  // Health Metrics
  getHealthMetrics(userId: string): Promise<HealthMetric[]>;
  createHealthMetric(metric: InsertHealthMetric): Promise<HealthMetric>;
  
  // Goals
  getGoals(userId: string): Promise<Goal[]>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  updateGoal(id: string, updates: Partial<Goal>): Promise<Goal | undefined>;
  deleteGoal(id: string): Promise<boolean>;
  
  // Goal Entries
  getGoalEntries(goalId: string): Promise<GoalEntry[]>;
  createGoalEntry(entry: InsertGoalEntry): Promise<GoalEntry>;
  deleteGoalEntry(id: string): Promise<boolean>;
  
  // Notes
  getNotes(userId: string): Promise<Note[]>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: string, updates: Partial<Note>): Promise<Note | undefined>;
  
  // Time Blocks
  getTimeBlocks(userId: string, date?: string): Promise<TimeBlock[]>;
  createTimeBlock(timeBlock: InsertTimeBlock): Promise<TimeBlock>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private tasks: Map<string, Task>;
  private habits: Map<string, Habit>;
  private healthMetrics: Map<string, HealthMetric>;
  private goals: Map<string, Goal>;
  private goalEntries: Map<string, GoalEntry>;
  private notes: Map<string, Note>;
  private timeBlocks: Map<string, TimeBlock>;

  constructor() {
    this.users = new Map();
    this.tasks = new Map();
    this.habits = new Map();
    this.healthMetrics = new Map();
    this.goals = new Map();
    this.goalEntries = new Map();
    this.notes = new Map();
    this.timeBlocks = new Map();
    
    // Initialize with demo user and data
    this.initializeDemoData();
  }

  private initializeDemoData() {
    const demoUser: User = {
      id: "demo-user",
      username: "alexchen",
      password: "password",
      name: "Alex Chen",
      role: "Product Designer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
    };
    this.users.set(demoUser.id, demoUser);

    // Demo tasks
    const demoTasks: Task[] = [
      {
        id: "task-1",
        userId: "demo-user",
        title: "Finish Q1 product roadmap presentation",
        priority: "high",
        dueTime: "14:00",
        completed: false,
        createdAt: new Date()
      },
      {
        id: "task-2",
        userId: "demo-user",
        title: "Review user feedback from last sprint",
        priority: "medium",
        dueTime: "16:00",
        completed: false,
        createdAt: new Date()
      },
      {
        id: "task-3",
        userId: "demo-user",
        title: "Morning workout - 30 minutes",
        priority: "low",
        dueTime: "07:30",
        completed: true,
        createdAt: new Date()
      }
    ];
    demoTasks.forEach(task => this.tasks.set(task.id, task));

    // Demo habits
    const demoHabits: Habit[] = [
      {
        id: "habit-1",
        userId: "demo-user",
        name: "Reading",
        emoji: "📚",
        streak: 23,
        completedToday: false,
        color: "orange",
        type: "boolean",
        targetValue: 1,
        currentValue: 0
      },
      {
        id: "habit-2",
        userId: "demo-user",
        name: "Exercise",
        emoji: "💪",
        streak: 7,
        completedToday: true,
        color: "red",
        type: "boolean",
        targetValue: 1,
        currentValue: 1
      },
      {
        id: "habit-3",
        userId: "demo-user",
        name: "Meditation",
        emoji: "🧘",
        streak: 12,
        completedToday: false,
        color: "purple",
        type: "boolean",
        targetValue: 1,
        currentValue: 0
      },
      {
        id: "habit-4",
        userId: "demo-user",
        name: "Hydration",
        emoji: "💧",
        streak: 5,
        completedToday: false,
        color: "blue",
        type: "counter",
        targetValue: 8,
        currentValue: 5
      }
    ];
    demoHabits.forEach(habit => this.habits.set(habit.id, habit));

    // Demo goals
    const demoGoals: Goal[] = [
      {
        id: "goal-1",
        userId: "demo-user",
        title: "Launch Product V2.0",
        description: "Complete development and launch of the new product version",
        goalType: "percentage",
        targetValue: 100,
        currentValue: 75,
        unit: "%",
        targetDate: new Date("2025-03-15"),
        color: "emerald",
        createdAt: new Date(),
        isArchived: false
      },
      {
        id: "goal-2",
        userId: "demo-user",
        title: "Read 24 Books",
        description: "Complete 24 books this year to expand knowledge",
        goalType: "number",
        targetValue: 24,
        currentValue: 6,
        unit: "books",
        targetDate: new Date("2025-12-31"),
        color: "purple",
        createdAt: new Date(),
        isArchived: false
      },
      {
        id: "goal-3",
        userId: "demo-user",
        title: "Save ₹1 Lakh",
        description: "Build emergency fund for financial security",
        goalType: "number",
        targetValue: 100000,
        currentValue: 45000,
        unit: "₹",
        targetDate: new Date("2025-12-31"),
        color: "orange",
        createdAt: new Date(),
        isArchived: false
      },
      {
        id: "goal-4",
        userId: "demo-user",
        title: "Write 500 Pages",
        description: "Complete first draft of novel",
        goalType: "number",
        targetValue: 500,
        currentValue: 127,
        unit: "pages",
        targetDate: new Date("2025-08-15"),
        color: "blue",
        createdAt: new Date(),
        isArchived: false
      }
    ];
    demoGoals.forEach(goal => this.goals.set(goal.id, goal));

    // Demo goal entries to show progress tracking
    const demoGoalEntries: GoalEntry[] = [
      // Reading book entries
      { id: "entry-1", goalId: "goal-2", value: 1, note: "Finished 'Atomic Habits'", date: new Date("2025-01-10") },
      { id: "entry-2", goalId: "goal-2", value: 1, note: "Completed 'The Lean Startup'", date: new Date("2025-01-20") },
      { id: "entry-3", goalId: "goal-2", value: 2, note: "Read two novels this week", date: new Date("2025-02-01") },
      { id: "entry-4", goalId: "goal-2", value: 1, note: "Finished design thinking book", date: new Date("2025-02-03") },
      { id: "entry-5", goalId: "goal-2", value: 1, note: "Psychology of design", date: new Date("2025-02-04") },
      
      // Savings entries
      { id: "entry-6", goalId: "goal-3", value: 15000, note: "January salary savings", date: new Date("2025-01-31") },
      { id: "entry-7", goalId: "goal-3", value: 12000, note: "Freelance project payment", date: new Date("2025-02-05") },
      { id: "entry-8", goalId: "goal-3", value: 8000, note: "Side hustle income", date: new Date("2025-02-03") },
      { id: "entry-9", goalId: "goal-3", value: 10000, note: "February savings", date: new Date("2025-02-04") },
      
      // Writing entries
      { id: "entry-10", goalId: "goal-4", value: 15, note: "Morning writing session", date: new Date("2025-02-01") },
      { id: "entry-11", goalId: "goal-4", value: 22, note: "Character development chapter", date: new Date("2025-02-02") },
      { id: "entry-12", goalId: "goal-4", value: 18, note: "Dialog heavy scene", date: new Date("2025-02-03") },
      { id: "entry-13", goalId: "goal-4", value: 25, note: "Plot twist chapter", date: new Date("2025-02-04") },
      { id: "entry-14", goalId: "goal-4", value: 12, note: "Edit and revisions", date: new Date("2025-02-05") },
      { id: "entry-15", goalId: "goal-4", value: 35, note: "Productive weekend writing", date: new Date("2025-02-05") }
    ];
    demoGoalEntries.forEach(entry => this.goalEntries.set(entry.id, entry));

    // Demo time blocks
    const demoTimeBlocks: TimeBlock[] = [
      {
        id: "block-1",
        userId: "demo-user",
        title: "Team Standup",
        startTime: "09:00",
        duration: 30,
        color: "indigo",
        date: new Date()
      },
      {
        id: "block-2",
        userId: "demo-user",
        title: "Deep Work - Product Strategy",
        startTime: "10:00",
        duration: 120,
        color: "emerald",
        date: new Date()
      },
      {
        id: "block-3",
        userId: "demo-user",
        title: "Client Presentation",
        startTime: "14:00",
        duration: 60,
        color: "orange",
        date: new Date()
      }
    ];
    demoTimeBlocks.forEach(block => this.timeBlocks.set(block.id, block));
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      role: insertUser.role || "User",
      avatar: insertUser.avatar || null
    };
    this.users.set(id, user);
    return user;
  }

  // Tasks
  async getTasks(userId: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.userId === userId);
  }

  async createTask(task: InsertTask): Promise<Task> {
    const id = randomUUID();
    const newTask: Task = { 
      ...task, 
      id, 
      createdAt: new Date(),
      priority: task.priority || "medium",
      dueTime: task.dueTime || null,
      completed: task.completed ?? false
    };
    this.tasks.set(id, newTask);
    return newTask;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...updates };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }

  // Habits
  async getHabits(userId: string): Promise<Habit[]> {
    return Array.from(this.habits.values()).filter(habit => habit.userId === userId);
  }

  async createHabit(habit: InsertHabit): Promise<Habit> {
    const id = randomUUID();
    const newHabit: Habit = { 
      ...habit, 
      id,
      type: habit.type || "boolean",
      streak: habit.streak ?? 0,
      completedToday: habit.completedToday ?? false,
      targetValue: habit.targetValue ?? 1,
      currentValue: habit.currentValue ?? 0
    };
    this.habits.set(id, newHabit);
    return newHabit;
  }

  async updateHabit(id: string, updates: Partial<Habit>): Promise<Habit | undefined> {
    const habit = this.habits.get(id);
    if (!habit) return undefined;
    
    const updatedHabit = { ...habit, ...updates };
    this.habits.set(id, updatedHabit);
    return updatedHabit;
  }

  async deleteHabit(id: string): Promise<boolean> {
    return this.habits.delete(id);
  }

  // Health Metrics
  async getHealthMetrics(userId: string): Promise<HealthMetric[]> {
    return Array.from(this.healthMetrics.values()).filter(metric => metric.userId === userId);
  }

  async createHealthMetric(metric: InsertHealthMetric): Promise<HealthMetric> {
    const id = randomUUID();
    const newMetric: HealthMetric = { ...metric, id, date: new Date() };
    this.healthMetrics.set(id, newMetric);
    return newMetric;
  }

  // Goals
  async getGoals(userId: string): Promise<Goal[]> {
    return Array.from(this.goals.values()).filter(goal => goal.userId === userId);
  }

  async createGoal(goal: InsertGoal): Promise<Goal> {
    const id = randomUUID();
    const newGoal: Goal = { 
      ...goal, 
      id,
      goalType: goal.goalType || "percentage",
      targetValue: goal.targetValue ?? 100,
      currentValue: goal.currentValue ?? 0,
      unit: goal.unit || "",
      description: goal.description || null,
      targetDate: goal.targetDate || null,
      createdAt: new Date(),
      isArchived: goal.isArchived ?? false
    };
    this.goals.set(id, newGoal);
    return newGoal;
  }

  async updateGoal(id: string, updates: Partial<Goal>): Promise<Goal | undefined> {
    const goal = this.goals.get(id);
    if (!goal) return undefined;
    
    const updatedGoal = { ...goal, ...updates };
    this.goals.set(id, updatedGoal);
    return updatedGoal;
  }

  async deleteGoal(id: string): Promise<boolean> {
    // Also delete associated goal entries
    const entries = Array.from(this.goalEntries.values()).filter(entry => entry.goalId === id);
    entries.forEach(entry => this.goalEntries.delete(entry.id));
    
    return this.goals.delete(id);
  }

  // Goal Entries
  async getGoalEntries(goalId: string): Promise<GoalEntry[]> {
    return Array.from(this.goalEntries.values())
      .filter(entry => entry.goalId === goalId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createGoalEntry(entry: InsertGoalEntry): Promise<GoalEntry> {
    const id = randomUUID();
    const newEntry: GoalEntry = { 
      ...entry, 
      id, 
      date: new Date(),
      note: entry.note || null
    };
    this.goalEntries.set(id, newEntry);
    
    // Update the goal's current value
    const goal = this.goals.get(entry.goalId);
    if (goal) {
      const updatedGoal = { 
        ...goal, 
        currentValue: goal.currentValue + entry.value 
      };
      this.goals.set(goal.id, updatedGoal);
    }
    
    return newEntry;
  }

  async deleteGoalEntry(id: string): Promise<boolean> {
    const entry = this.goalEntries.get(id);
    if (!entry) return false;
    
    // Reverse the goal value update
    const goal = this.goals.get(entry.goalId);
    if (goal) {
      const updatedGoal = { 
        ...goal, 
        currentValue: Math.max(0, goal.currentValue - entry.value)
      };
      this.goals.set(goal.id, updatedGoal);
    }
    
    return this.goalEntries.delete(id);
  }

  // Notes
  async getNotes(userId: string): Promise<Note[]> {
    return Array.from(this.notes.values()).filter(note => note.userId === userId);
  }

  async createNote(note: InsertNote): Promise<Note> {
    const id = randomUUID();
    const newNote: Note = { 
      ...note, 
      id, 
      createdAt: new Date(),
      tags: note.tags || null
    };
    this.notes.set(id, newNote);
    return newNote;
  }

  async updateNote(id: string, updates: Partial<Note>): Promise<Note | undefined> {
    const note = this.notes.get(id);
    if (!note) return undefined;
    
    const updatedNote = { ...note, ...updates };
    this.notes.set(id, updatedNote);
    return updatedNote;
  }

  // Time Blocks
  async getTimeBlocks(userId: string, date?: string): Promise<TimeBlock[]> {
    const blocks = Array.from(this.timeBlocks.values()).filter(block => block.userId === userId);
    if (date) {
      return blocks.filter(block => block.date?.toDateString() === new Date(date).toDateString());
    }
    return blocks;
  }

  async createTimeBlock(timeBlock: InsertTimeBlock): Promise<TimeBlock> {
    const id = randomUUID();
    const newBlock: TimeBlock = { ...timeBlock, id, date: new Date() };
    this.timeBlocks.set(id, newBlock);
    return newBlock;
  }
}

export const storage = new MemStorage();
