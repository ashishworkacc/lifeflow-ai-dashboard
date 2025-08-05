import { motion, AnimatePresence } from "framer-motion";
import { Edit, Plus, TrendingUp, Target, Calendar, Zap, BarChart3, PieChart, LineChart, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  calculateGoalAnalytics, 
  formatGoalProgress, 
  getGoalStatusColor, 
  getGoalStatusBg,
  type Goal,
  type GoalEntry,
  type GoalAnalytics 
} from "@/lib/goal-insights";
import { format, differenceInDays } from "date-fns";

interface GoalsProgressProps {
  goals: Goal[];
  onEditGoal: (goal: Goal) => void;
  onAddGoal: () => void;
}

const chartTypes = [
  { icon: BarChart3, label: "Progress Bar" },
  { icon: PieChart, label: "Donut Chart" },
  { icon: LineChart, label: "Trend Line" }
];

interface GoalCardProps {
  goal: Goal;
  analytics: GoalAnalytics;
  entries: GoalEntry[];
  onEditGoal: (goal: Goal) => void;
  onQuickAdd: (goalId: string, value: number) => void;
}

function GoalCard({ goal, analytics, entries, onEditGoal, onQuickAdd }: GoalCardProps) {
  const [quickValue, setQuickValue] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [chartType, setChartType] = useState(0);

  const handleQuickAdd = () => {
    const value = parseInt(quickValue);
    if (value && value > 0) {
      onQuickAdd(goal.id, value);
      setQuickValue("");
    }
  };

  const progressPercentage = goal.goalType === "percentage" 
    ? goal.currentValue 
    : Math.min((goal.currentValue / goal.targetValue) * 100, 100);

  const CurrentChart = chartTypes[chartType].icon;

  return (
    <motion.div
      layout
      className="group relative bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:border-slate-600/50 transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-semibold text-white text-sm">{goal.title}</h3>
            {analytics.milestones.some(m => m.reached && m.celebration) && (
              <Award className="w-4 h-4 text-yellow-400" />
            )}
          </div>
          <p className="text-xs text-slate-400 mb-2">{goal.description}</p>
          
          {/* Progress Display */}
          <div className="flex items-center space-x-3">
            <span className={`text-lg font-bold ${getGoalStatusColor(analytics)}`}>
              {formatGoalProgress(goal)}
            </span>
            <span className="text-xs text-slate-500">
              {goal.targetDate && `${analytics.daysRemaining} days left`}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setChartType((prev) => (prev + 1) % chartTypes.length)}
            className="p-1 text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <CurrentChart className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditGoal(goal)}
            className="p-1 text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Visual Progress */}
      <div className="mb-4">
        {chartType === 0 && (
          <div className="relative w-full bg-slate-700 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
              transition={{ duration: 0.8 }}
              className={`h-3 rounded-full ${getGoalStatusBg(analytics)}`}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-medium text-white mix-blend-difference">
                {progressPercentage.toFixed(0)}%
              </span>
            </div>
          </div>
        )}
        
        {chartType === 1 && (
          <div className="flex items-center justify-center">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32" cy="32" r="28"
                  stroke="rgb(51 65 85)" strokeWidth="8" fill="none"
                />
                <motion.circle
                  cx="32" cy="32" r="28"
                  stroke={analytics.colorCode === "green" ? "rgb(34 197 94)" : 
                         analytics.colorCode === "amber" ? "rgb(234 179 8)" : "rgb(239 68 68)"}
                  strokeWidth="8" fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${progressPercentage * 1.76} 176`}
                  initial={{ strokeDasharray: "0 176" }}
                  animate={{ strokeDasharray: `${progressPercentage * 1.76} 176` }}
                  transition={{ duration: 1 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {progressPercentage.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {chartType === 2 && entries.length > 0 && (
          <div className="h-12 flex items-end space-x-1">
            {entries.slice(-7).map((entry, i) => (
              <div
                key={i}
                className={`flex-1 ${getGoalStatusBg(analytics)} rounded-t opacity-70`}
                style={{ height: `${Math.max((entry.value / Math.max(...entries.map(e => e.value))) * 100, 10)}%` }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick Add */}
      <div className="flex items-center space-x-2 mb-3">
        <Input
          type="number"
          placeholder={`+${goal.unit}`}
          value={quickValue}
          onChange={(e) => setQuickValue(e.target.value)}
          className="flex-1 h-8 text-xs bg-slate-700/50 border-slate-600/50"
          onKeyPress={(e) => e.key === 'Enter' && handleQuickAdd()}
        />
        <Button
          size="sm"
          onClick={handleQuickAdd}
          disabled={!quickValue}
          className="h-8 px-3 text-xs bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>

      {/* Status Indicators */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-3">
          {analytics.streak > 0 && (
            <span className="flex items-center space-x-1 text-orange-400">
              <Zap className="w-3 h-3" />
              <span>{analytics.streak}d</span>
            </span>
          )}
          <span className={`flex items-center space-x-1 ${getGoalStatusColor(analytics)}`}>
            <TrendingUp className="w-3 h-3" />
            <span>{analytics.velocity.toFixed(1)}/day</span>
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDetails(!showDetails)}
          className="h-6 px-2 text-xs text-slate-400 hover:text-white"
        >
          {showDetails ? "Less" : "Details"}
        </Button>
      </div>

      {/* Detailed Analytics */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-slate-700/50 space-y-3"
          >
            {/* Milestones */}
            <div>
              <p className="text-xs font-medium text-slate-300 mb-2">Milestones</p>
              <div className="flex space-x-2">
                {analytics.milestones.map((milestone, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-2 rounded ${
                      milestone.reached ? getGoalStatusBg(analytics) : "bg-slate-700"
                    }`}
                    title={milestone.reached ? milestone.celebration : `${milestone.percentage}%`}
                  />
                ))}
              </div>
            </div>

            {/* Insights */}
            {analytics.insights.length > 0 && (
              <div>
                <p className="text-xs font-medium text-slate-300 mb-2">AI Insights</p>
                <div className="space-y-1">
                  {analytics.insights.slice(0, 2).map((insight, i) => (
                    <p key={i} className="text-xs text-slate-400">{insight}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {analytics.suggestions.length > 0 && (
              <div>
                <p className="text-xs font-medium text-slate-300 mb-2">Suggestions</p>
                <div className="space-y-1">
                  {analytics.suggestions.slice(0, 1).map((suggestion, i) => (
                    <p key={i} className="text-xs text-indigo-400">{suggestion}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Projected Completion */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Projected completion:</span>
              <span className="text-white">
                {format(analytics.projectedCompletionDate, "MMM dd, yyyy")}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function GoalsProgress({ goals, onEditGoal, onAddGoal }: GoalsProgressProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch goal entries for analytics
  const goalEntries = useQuery({
    queryKey: ["goal-entries"],
    queryFn: async () => {
      const entriesMap: Record<string, GoalEntry[]> = {};
      
      for (const goal of goals) {
        try {
          const entries = await apiRequest("GET", `/api/goals/${goal.id}/entries`);
          // Ensure entries is always an array
          entriesMap[goal.id] = Array.isArray(entries) ? entries : [];
        } catch (error) {
          console.warn(`Failed to fetch entries for goal ${goal.id}:`, error);
          entriesMap[goal.id] = [];
        }
      }
      
      return entriesMap;
    },
    enabled: goals.length > 0
  });

  // Quick add mutation
  const quickAddMutation = useMutation({
    mutationFn: async ({ goalId, value }: { goalId: string; value: number }) => {
      return await apiRequest("POST", `/api/goals/${goalId}/entries`, { 
        value,
        note: `Quick add: +${value}`
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["goal-entries"] });
      toast({
        title: "Progress Updated",
        description: "Your goal progress has been updated successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update goal progress",
        variant: "destructive",
      });
    },
  });

  const handleQuickAdd = (goalId: string, value: number) => {
    quickAddMutation.mutate({ goalId, value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="glass-card rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Goals Progress</h2>
          <p className="text-xs text-slate-400 mt-1">
            Track your progress with flexible goal types and AI insights
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onAddGoal}
          className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>
      
      <div className="space-y-4">
        {goals.map((goal) => {
          const entries = goalEntries.data?.[goal.id] || [];
          const analytics = calculateGoalAnalytics(goal, entries);
          
          return (
            <GoalCard
              key={goal.id}
              goal={goal}
              analytics={analytics}
              entries={entries}
              onEditGoal={onEditGoal}
              onQuickAdd={handleQuickAdd}
            />
          );
        })}
        
        {goals.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-sm font-medium text-white mb-2">No goals yet</h3>
            <p className="text-xs mb-4">Create your first goal to start tracking progress with AI insights</p>
            <Button onClick={onAddGoal} className="text-xs">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Goal
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}