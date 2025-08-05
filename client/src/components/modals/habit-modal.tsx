import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const emojiOptions = [
  { emoji: "📚", label: "Reading" },
  { emoji: "💪", label: "Exercise" },
  { emoji: "🧘", label: "Meditation" },
  { emoji: "💧", label: "Water" },
  { emoji: "🏃", label: "Running" },
  { emoji: "🥗", label: "Healthy Eating" },
  { emoji: "💤", label: "Sleep" },
  { emoji: "📝", label: "Writing" },
];

const colorOptions = [
  { value: "orange", label: "Orange", class: "bg-orange-500" },
  { value: "red", label: "Red", class: "bg-red-500" },
  { value: "purple", label: "Purple", class: "bg-purple-500" },
  { value: "blue", label: "Blue", class: "bg-blue-500" },
  { value: "emerald", label: "Emerald", class: "bg-emerald-500" },
];

export default function HabitModal({ isOpen, onClose }: HabitModalProps) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("📚");
  const [color, setColor] = useState("orange");
  const [type, setType] = useState("boolean");
  const [targetValue, setTargetValue] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createHabitMutation = useMutation({
    mutationFn: async (habitData: any) => {
      await apiRequest("POST", "/api/habits", habitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/habits"] });
      toast({
        title: "Success",
        description: "Habit created successfully",
      });
      handleClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create habit",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createHabitMutation.mutate({
      name: name.trim(),
      emoji,
      color,
      type,
      targetValue,
      streak: 0,
      completedToday: false,
      currentValue: 0,
    });
  };

  const handleClose = () => {
    setName("");
    setEmoji("📚");
    setColor("orange");
    setType("boolean");
    setTargetValue(1);
    onClose();
  };

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
              <h3 className="text-lg font-semibold text-white">Add New Habit</h3>
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
                <Label htmlFor="name" className="text-sm font-medium text-slate-300">
                  Habit Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter habit name"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emoji" className="text-sm font-medium text-slate-300">
                    Emoji
                  </Label>
                  <Select value={emoji} onValueChange={setEmoji}>
                    <SelectTrigger className="mt-2 bg-slate-800/50 border-slate-600/50 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {emojiOptions.map((option) => (
                        <SelectItem key={option.emoji} value={option.emoji} className="text-white hover:bg-slate-700">
                          {option.emoji} {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type" className="text-sm font-medium text-slate-300">
                    Type
                  </Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger className="mt-2 bg-slate-800/50 border-slate-600/50 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="boolean" className="text-white hover:bg-slate-700">Yes/No</SelectItem>
                      <SelectItem value="counter" className="text-white hover:bg-slate-700">Counter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {type === "counter" && (
                  <div>
                    <Label htmlFor="targetValue" className="text-sm font-medium text-slate-300">
                      Target
                    </Label>
                    <Input
                      id="targetValue"
                      type="number"
                      min="1"
                      value={targetValue}
                      onChange={(e) => setTargetValue(parseInt(e.target.value) || 1)}
                      className="mt-2 bg-slate-800/50 border-slate-600/50 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                )}
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
                  disabled={createHabitMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                >
                  {createHabitMutation.isPending ? "Adding..." : "Add Habit"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
