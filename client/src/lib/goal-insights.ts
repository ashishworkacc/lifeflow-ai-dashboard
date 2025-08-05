import { format, differenceInDays, addDays, subDays } from "date-fns";

export interface Goal {
  id: string;
  title: string;
  description?: string;
  goalType: "percentage" | "number";
  targetValue: number;
  currentValue: number;
  unit: string;
  targetDate?: Date;
  color: string;
  createdAt: Date;
  isArchived: boolean;
}

export interface GoalEntry {
  id: string;
  goalId: string;
  value: number;
  note?: string;
  date: Date;
}

export interface GoalAnalytics {
  progress: number;
  progressPercentage: number;
  isOnTrack: boolean;
  daysRemaining: number;
  dailyTargetRemaining: number;
  projectedCompletionDate: Date;
  velocity: number; // average daily progress
  streak: number;
  milestones: Milestone[];
  colorCode: "red" | "amber" | "green";
  insights: string[];
  suggestions: string[];
}

export interface Milestone {
  percentage: number;
  reached: boolean;
  date?: Date;
  celebration?: string;
}

export function calculateGoalAnalytics(goal: Goal, entries: GoalEntry[]): GoalAnalytics {
  const now = new Date();
  const createdDate = new Date(goal.createdAt);
  const targetDate = goal.targetDate ? new Date(goal.targetDate) : null;
  
  // Basic progress calculation
  const progress = goal.currentValue;
  const progressPercentage = goal.goalType === "percentage" 
    ? progress 
    : Math.min((progress / goal.targetValue) * 100, 100);

  // Time calculations
  const daysRemaining = targetDate ? Math.max(0, differenceInDays(targetDate, now)) : 365;
  const totalDays = targetDate ? differenceInDays(targetDate, createdDate) : 365;
  const daysPassed = totalDays - daysRemaining;

  // Velocity calculation (recent 7 days)
  const recentEntries = (entries || [])
    .filter(entry => entry && entry.date && differenceInDays(now, new Date(entry.date)) <= 7)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const recentProgress = recentEntries.reduce((sum, entry) => sum + entry.value, 0);
  const velocity = recentProgress / Math.min(7, daysPassed || 1);

  // Daily target remaining
  const remainingValue = goal.targetValue - progress;
  const dailyTargetRemaining = daysRemaining > 0 ? remainingValue / daysRemaining : 0;

  // Projected completion
  const projectedDays = velocity > 0 ? Math.ceil(remainingValue / velocity) : daysRemaining * 2;
  const projectedCompletionDate = addDays(now, projectedDays);

  // On track calculation
  const expectedProgress = daysPassed > 0 ? (daysPassed / totalDays) * goal.targetValue : 0;
  const isOnTrack = progress >= expectedProgress * 0.9; // 10% tolerance

  // Color coding
  let colorCode: "red" | "amber" | "green" = "green";
  if (progressPercentage < 50 && daysRemaining < totalDays * 0.5) {
    colorCode = "red";
  } else if (!isOnTrack) {
    colorCode = "amber";
  }

  // Calculate streak
  const streak = calculateStreak(entries);

  // Milestones
  const milestones = calculateMilestones(goal, entries, progressPercentage);

  // Generate insights and suggestions
  const insights = generateInsights(goal, entries, velocity, isOnTrack, streak);
  const suggestions = generateSuggestions(goal, velocity, dailyTargetRemaining, isOnTrack, daysRemaining);

  return {
    progress,
    progressPercentage,
    isOnTrack,
    daysRemaining,
    dailyTargetRemaining,
    projectedCompletionDate,
    velocity,
    streak,
    milestones,
    colorCode,
    insights,
    suggestions
  };
}

function calculateStreak(entries: GoalEntry[]): number {
  if (!entries || entries.length === 0) return 0;

  const sortedEntries = entries
    .filter(entry => entry && entry.date) // Add safety check
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (let i = 0; i < 30; i++) { // Check last 30 days
    const checkDate = subDays(currentDate, i);
    const hasEntry = sortedEntries.some(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === checkDate.getTime();
    });

    if (hasEntry) {
      streak++;
    } else if (i > 0) { // Allow for today to not have an entry yet
      break;
    }
  }

  return streak;
}

function calculateMilestones(goal: Goal, entries: GoalEntry[], currentPercentage: number): Milestone[] {
  const milestonePercentages = [25, 50, 75, 90, 100];
  
  return milestonePercentages.map(percentage => {
    const reached = currentPercentage >= percentage;
    let date: Date | undefined;
    let celebration: string | undefined;

    if (reached && entries && entries.length > 0) {
      // Find when this milestone was reached
      const targetValue = (percentage / 100) * goal.targetValue;
      let cumulativeValue = 0;
      
      const sortedEntries = entries
        .filter(entry => entry && entry.date && entry.value)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      for (const entry of sortedEntries) {
        cumulativeValue += entry.value;
        if (cumulativeValue >= targetValue) {
          date = new Date(entry.date);
          break;
        }
      }

      // Celebration messages
      if (percentage === 25) celebration = "Great start! 🎯";
      else if (percentage === 50) celebration = "Halfway there! 🔥";
      else if (percentage === 75) celebration = "Almost there! 💪";
      else if (percentage === 90) celebration = "So close! 🚀";
      else if (percentage === 100) celebration = "Goal achieved! 🎉";
    }

    return { percentage, reached, date, celebration };
  });
}

function generateInsights(
  goal: Goal, 
  entries: GoalEntry[], 
  velocity: number, 
  isOnTrack: boolean, 
  streak: number
): string[] {
  const insights: string[] = [];

  // Streak insights
  if (streak >= 7) {
    insights.push(`🔥 Amazing ${streak}-day streak! You're building incredible momentum.`);
  } else if (streak >= 3) {
    insights.push(`💪 ${streak} days in a row! Keep the momentum going.`);
  }

  // Velocity insights
  if (velocity > 0) {
    const weeklyProgress = velocity * 7;
    insights.push(`📈 You're averaging ${weeklyProgress.toFixed(1)} ${goal.unit} per week.`);
  }

  // Performance insights
  if (isOnTrack) {
    insights.push(`✅ You're on track to reach your goal on time!`);
  } else {
    insights.push(`⚠️ You're falling behind schedule. Consider adjusting your daily target.`);
  }

  // Pattern detection
  const recentEntries = entries.slice(0, 7);
  if (recentEntries.length >= 3) {
    const weekends = recentEntries.filter(entry => {
      const day = new Date(entry.date).getDay();
      return day === 0 || day === 6; // Sunday or Saturday
    });
    
    if (weekends.length > recentEntries.length * 0.6) {
      insights.push(`📅 You're more productive on weekends! Consider planning more activities then.`);
    }
  }

  return insights;
}

function generateSuggestions(
  goal: Goal,
  velocity: number,
  dailyTargetRemaining: number,
  isOnTrack: boolean,
  daysRemaining: number
): string[] {
  const suggestions: string[] = [];

  if (!isOnTrack && daysRemaining > 0) {
    const increaseNeeded = Math.ceil(dailyTargetRemaining - velocity);
    if (increaseNeeded > 0) {
      suggestions.push(`⚡ Increase your daily average by ${increaseNeeded} ${goal.unit} to finish on time.`);
    }
  }

  if (velocity === 0 && daysRemaining > 0) {
    suggestions.push(`🎯 Start with small wins! Aim for just 1-2 ${goal.unit} today.`);
  }

  if (velocity > dailyTargetRemaining && isOnTrack) {
    suggestions.push(`🚀 You're ahead of schedule! Consider raising your target or setting a new goal.`);
  }

  if (daysRemaining < 30 && !isOnTrack) {
    suggestions.push(`⏰ Less than a month left! Focus on consistency over perfection.`);
  }

  // Burnout prevention
  if (velocity > dailyTargetRemaining * 3) {
    suggestions.push(`🛡️ You're working very hard! Consider taking a rest day to avoid burnout.`);
  }

  return suggestions;
}

export function formatGoalProgress(goal: Goal): string {
  if (goal.goalType === "percentage") {
    return `${goal.currentValue}%`;
  }
  
  return `${goal.currentValue.toLocaleString()}/${goal.targetValue.toLocaleString()} ${goal.unit}`;
}

export function getGoalStatusColor(analytics: GoalAnalytics): string {
  switch (analytics.colorCode) {
    case "green": return "text-emerald-400";
    case "amber": return "text-yellow-400";
    case "red": return "text-red-400";
    default: return "text-slate-400";
  }
}

export function getGoalStatusBg(analytics: GoalAnalytics): string {
  switch (analytics.colorCode) {
    case "green": return "bg-emerald-500";
    case "amber": return "bg-yellow-500";
    case "red": return "bg-red-500";
    default: return "bg-slate-500";
  }
}