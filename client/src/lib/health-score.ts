interface HealthMetric {
  type: string;
  value: number;
  unit: string;
  date: Date;
}

interface Habit {
  name: string;
  completedToday: boolean;
  streak: number;
  type: "boolean" | "counter";
  targetValue: number;
  currentValue: number;
}

export function calculateHealthScore(healthMetrics: HealthMetric[], habits: Habit[]): {
  score: number;
  breakdown: { category: string; score: number; details: string }[];
} {
  const breakdown: { category: string; score: number; details: string }[] = [];
  let totalScore = 0;
  let totalWeight = 0;

  // Sleep score (weight: 30%)
  const sleepMetrics = healthMetrics.filter(m => m.type === 'sleep');
  if (sleepMetrics.length > 0) {
    const latestSleep = sleepMetrics[sleepMetrics.length - 1];
    const sleepHours = latestSleep.value;
    let sleepScore = 0;
    
    if (sleepHours >= 7 && sleepHours <= 9) {
      sleepScore = 100;
    } else if (sleepHours >= 6 && sleepHours < 7) {
      sleepScore = 80;
    } else if (sleepHours >= 5 && sleepHours < 6) {
      sleepScore = 60;
    } else {
      sleepScore = 40;
    }
    
    breakdown.push({
      category: "Sleep",
      score: sleepScore,
      details: `${sleepHours}h (optimal: 7-9h)`
    });
    
    totalScore += sleepScore * 0.3;
    totalWeight += 0.3;
  }

  // Activity score (weight: 25%)
  const stepsMetrics = healthMetrics.filter(m => m.type === 'steps');
  if (stepsMetrics.length > 0) {
    const latestSteps = stepsMetrics[stepsMetrics.length - 1];
    const steps = latestSteps.value;
    let activityScore = 0;
    
    if (steps >= 10000) {
      activityScore = 100;
    } else if (steps >= 8000) {
      activityScore = 80;
    } else if (steps >= 5000) {
      activityScore = 60;
    } else {
      activityScore = 40;
    }
    
    breakdown.push({
      category: "Activity",
      score: activityScore,
      details: `${steps.toLocaleString()} steps (target: 10,000)`
    });
    
    totalScore += activityScore * 0.25;
    totalWeight += 0.25;
  }

  // Hydration score (weight: 20%)
  const waterMetrics = healthMetrics.filter(m => m.type === 'water');
  const hydrationHabit = habits.find(h => h.name.toLowerCase().includes('hydration') || h.name.toLowerCase().includes('water'));
  
  if (waterMetrics.length > 0 || hydrationHabit) {
    let hydrationScore = 0;
    let details = "";
    
    if (hydrationHabit) {
      const percentage = (hydrationHabit.currentValue / hydrationHabit.targetValue) * 100;
      hydrationScore = Math.min(percentage, 100);
      details = `${hydrationHabit.currentValue}/${hydrationHabit.targetValue} glasses`;
    } else if (waterMetrics.length > 0) {
      const latestWater = waterMetrics[waterMetrics.length - 1];
      const glasses = latestWater.value;
      hydrationScore = Math.min((glasses / 8) * 100, 100);
      details = `${glasses}/8 glasses`;
    }
    
    breakdown.push({
      category: "Hydration",
      score: hydrationScore,
      details
    });
    
    totalScore += hydrationScore * 0.2;
    totalWeight += 0.2;
  }

  // Habit consistency score (weight: 25%)
  const completedHabits = habits.filter(h => h.completedToday || (h.type === "counter" && h.currentValue >= h.targetValue));
  const habitScore = habits.length > 0 ? (completedHabits.length / habits.length) * 100 : 80;
  
  breakdown.push({
    category: "Habits",
    score: habitScore,
    details: `${completedHabits.length}/${habits.length} completed today`
  });
  
  totalScore += habitScore * 0.25;
  totalWeight += 0.25;

  // Calculate final score
  const finalScore = totalWeight > 0 ? totalScore / totalWeight : 75;
  
  return {
    score: Math.round(finalScore * 10) / 10, // Round to 1 decimal place
    breakdown
  };
}

export function getHealthScoreColor(score: number): string {
  if (score >= 90) return "text-emerald-400";
  if (score >= 80) return "text-green-400";
  if (score >= 70) return "text-yellow-400";
  if (score >= 60) return "text-orange-400";
  return "text-red-400";
}

export function getHealthScoreLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Very Good";
  if (score >= 70) return "Good";
  if (score >= 60) return "Fair";
  return "Needs Improvement";
}