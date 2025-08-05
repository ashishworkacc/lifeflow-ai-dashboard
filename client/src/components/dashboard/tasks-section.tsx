import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
  dueTime?: string;
  completed: boolean;
}

interface TasksSectionProps {
  tasks: Task[];
  onAddTask: () => void;
}

const priorityColors = {
  high: "bg-red-500/20 text-red-300",
  medium: "bg-yellow-500/20 text-yellow-300",
  low: "bg-green-500/20 text-green-300",
};

const priorityLabels = {
  high: "High Priority",
  medium: "Medium",
  low: "Low",
};

export default function TasksSection({ tasks, onAddTask }: TasksSectionProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Task> }) => {
      await apiRequest("PATCH", `/api/tasks/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    },
  });

  const handleCompleteTask = (task: Task) => {
    updateTaskMutation.mutate({
      id: task.id,
      updates: { completed: !task.completed },
    });
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Today's Tasks</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onAddTask}
          className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      <div className="space-y-3">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700/30 transition-all duration-200 group ${
              task.completed ? 'opacity-60' : ''
            }`}
          >
            <div className="flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className={`w-5 h-5 rounded border-2 p-0 ${
                  task.completed
                    ? 'border-emerald-500 bg-emerald-500'
                    : 'border-slate-500 hover:border-emerald-500'
                } flex items-center justify-center transition-colors celebration-effect`}
                onClick={() => handleCompleteTask(task)}
              >
                {task.completed && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </Button>
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-medium ${task.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                {task.title}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={priorityColors[task.priority]}>
                  {priorityLabels[task.priority]}
                </Badge>
                {task.dueTime && (
                  <span className="text-slate-400 text-sm">Due {task.dueTime}</span>
                )}
              </div>
            </div>
            <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                className="p-1 text-slate-400 hover:text-white"
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700/50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Progress: {completedTasks} of {totalTasks} complete</span>
          <span className="text-emerald-400 font-medium">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="mt-2 bg-slate-700 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
}
