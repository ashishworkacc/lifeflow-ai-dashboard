import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type Goal } from "@/lib/goal-insights";

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal?: Goal;
}

const colorOptions = [
  { value: "emerald", label: "Emerald", class: "bg-emerald-500" },
  { value: "purple", label: "Purple", class: "bg-purple-500" },
  { value: "orange", label: "Orange", class: "bg-orange-500" },
  { value: "blue", label: "Blue", class: "bg-blue-500" },
  { value: "red", label: "Red", class: "bg-red-500" },
];

export default function GoalModal({ isOpen, onClose, goal }: GoalModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [progress, setProgress] = useState(0);
  const [targetDate, setTargetDate] = useState("");
  const [color, setColor] = useState("emerald");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (goal) {
      setTitle(goal.title);
      setDescription(goal.description || "");
      setProgress(goal.currentValue);
      setTargetDate(goal.targetDate ? new Date(goal.targetDate).toISOString().split('T')[0] : "");
      setColor(goal.color);
    } else {
      setTitle("");
      setDescription("");
      setProgress(0);
      setTargetDate("");
      setColor("emerald");
    }
  }, [goal, isOpen]);

  const createGoalMutation = useMutation({
    mutationFn: async (goalData: any) => {
      await apiRequest("POST", "/api/goals", goalData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      toast({
        title: "Success",
        description: "Goal created successfully",
      });
      handleClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create goal",
        variant: "destructive",
      });
    },
  });

  const updateGoalMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      await apiRequest("PATCH", `/api/goals/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      toast({
        title: "Success",
        description: "Goal updated successfully",
      });
      handleClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update goal",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const goalData = {
      title: title.trim(),
      description: description.trim() || undefined,
      currentValue: progress,
      targetDate: targetDate ? new Date(targetDate) : undefined,
      color,
    };

    if (goal) {
      updateGoalMutation.mutate({ id: goal.id, updates: goalData });
    } else {
      createGoalMutation.mutate(goalData);
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setProgress(0);
    setTargetDate("");
    setColor("emerald");
    onClose();
  };

  const isLoading = createGoalMutation.isPending || updateGoalMutation.isPending;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="glass-card rounded-xl p-6 w-full max-w-md mx-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                {goal ? "Edit Goal" : "Add New Goal"}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-sm font-medium text-slate-300">
                  Goal Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-2 bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter goal title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium text-slate-300">
                  Description (Optional)
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-2 bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  placeholder="Enter goal description"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="progress" className="text-sm font-medium text-slate-300">
                    Progress (%)
                  </Label>
                  <Input
                    id="progress"
                    type="number"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={(e) => setProgress(parseInt(e.target.value) || 0)}
                    className="mt-2 bg-slate-800/50 border-slate-600/50 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <Label htmlFor="color" className="text-sm font-medium text-slate-300">
                    Color
                  </Label>
                  <Select value={color} onValueChange={setColor}>
                    <SelectTrigger className="mt-2 bg-slate-800/50 border-slate-600/50 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {colorOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="text-white hover:bg-slate-700">
                          <div className="flex items-center space-x-2">
                            <div className={`w-4 h-4 rounded ${option.class}`} />
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="targetDate" className="text-sm font-medium text-slate-300">
                  Target Date (Optional)
                </Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="mt-2 bg-slate-800/50 border-slate-600/50 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 border-slate-600 text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                >
                  {isLoading ? (goal ? "Updating..." : "Adding...") : (goal ? "Update Goal" : "Add Goal")}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}