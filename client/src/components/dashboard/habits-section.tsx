import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Habit {
  id: string;
  name: string;
  emoji: string;
  streak: number;
  completedToday: boolean;
  color: string;
  type: "boolean" | "counter";
  targetValue: number;
  currentValue: number;
}

interface HabitsSectionProps {
  habits: Habit[];
  onAddHabit: () => void;
}

const colorClasses = {
  orange: "bg-orange-500/20 text-orange-300 hover:bg-orange-500/30",
  red: "bg-red-500/20 text-red-300 hover:bg-red-500/30",
  purple: "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30",
  blue: "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30",
  emerald: "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30",
};

export default function HabitsSection({ habits, onAddHabit }: HabitsSectionProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateHabitMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Habit> }) => {
      await apiRequest("PATCH", `/api/habits/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/habits"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update habit",
        variant: "destructive",
      });
    },
  });

  const handleLogHabit = (habit: Habit) => {
    if (habit.completedToday) return;

    const updates = habit.type === "counter" 
      ? { currentValue: habit.currentValue + 1 }
      : { 
          completedToday: true, 
          streak: habit.streak + 1,
          currentValue: habit.targetValue
        };

    updateHabitMutation.mutate({
      id: habit.id,
      updates,
    });

    // Trigger celebration animation
    const habitElement = document.querySelector(`[data-habit-id="${habit.id}"]`);
    if (habitElement) {
      habitElement.classList.add('celebration-effect', 'celebrating');
      setTimeout(() => {
        habitElement.classList.remove('celebrating');
      }, 600);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Habits & Streaks</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onAddHabit}
          className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {habits.map((habit, index) => (
          <motion.div
            key={habit.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            data-habit-id={habit.id}
            className="text-center p-4 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-200 celebration-effect"
          >
            <div className={`w-12 h-12 mx-auto mb-3 ${colorClasses[habit.color as keyof typeof colorClasses]?.split(' ')[0]}/20 rounded-full flex items-center justify-center`}>
              <span className="text-2xl">{habit.emoji}</span>
            </div>
            <h3 className="font-medium text-white text-sm mb-1">{habit.name}</h3>
            <p className={`font-bold text-lg ${colorClasses[habit.color as keyof typeof colorClasses]?.split(' ')[1]}`}>
              {habit.type === "counter" ? `${habit.currentValue}/${habit.targetValue}` : habit.streak}
            </p>
            <p className="text-slate-400 text-xs">
              {habit.type === "counter" ? 
                (habit.name === "Hydration" ? "glasses today" : "completed today") : 
                "day streak"
              }
            </p>
            <Button
              size="sm"
              className={`mt-2 w-full py-1 text-xs transition-colors ${
                habit.completedToday || (habit.type === "counter" && habit.currentValue >= habit.targetValue)
                  ? "bg-emerald-500/20 text-emerald-300 opacity-50 cursor-not-allowed"
                  : colorClasses[habit.color as keyof typeof colorClasses] || "bg-slate-500/20 text-slate-300 hover:bg-slate-500/30"
              }`}
              onClick={() => handleLogHabit(habit)}
              disabled={habit.completedToday || (habit.type === "counter" && habit.currentValue >= habit.targetValue)}
            >
              {habit.completedToday || (habit.type === "counter" && habit.currentValue >= habit.targetValue)
                ? "✓ Done Today"
                : habit.type === "counter" && habit.name === "Hydration"
                ? "Add Glass"
                : "Mark Complete"
              }
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
