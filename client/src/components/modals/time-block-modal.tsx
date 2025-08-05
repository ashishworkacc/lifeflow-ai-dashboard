import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface TimeBlock {
  id: string;
  title: string;
  startTime: string;
  duration: number;
  color: string;
}

interface TimeBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeBlock?: TimeBlock;
}

const colorOptions = [
  { value: "indigo", label: "Indigo", class: "bg-indigo-500" },
  { value: "emerald", label: "Emerald", class: "bg-emerald-500" },
  { value: "orange", label: "Orange", class: "bg-orange-500" },
  { value: "blue", label: "Blue", class: "bg-blue-500" },
  { value: "purple", label: "Purple", class: "bg-purple-500" },
  { value: "red", label: "Red", class: "bg-red-500" },
];

const durationOptions = [
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hours" },
  { value: 120, label: "2 hours" },
  { value: 180, label: "3 hours" },
  { value: 240, label: "4 hours" },
];

export default function TimeBlockModal({ isOpen, onClose, timeBlock }: TimeBlockModalProps) {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(60);
  const [color, setColor] = useState("indigo");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (timeBlock) {
      setTitle(timeBlock.title);
      setStartTime(timeBlock.startTime);
      setDuration(timeBlock.duration);
      setColor(timeBlock.color);
    } else {
      setTitle("");
      setStartTime("");
      setDuration(60);
      setColor("indigo");
    }
  }, [timeBlock, isOpen]);

  const createTimeBlockMutation = useMutation({
    mutationFn: async (blockData: any) => {
      await apiRequest("POST", "/api/time-blocks", blockData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/time-blocks"] });
      toast({
        title: "Success",
        description: "Time block created successfully",
      });
      handleClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create time block",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !startTime) return;

    createTimeBlockMutation.mutate({
      title: title.trim(),
      startTime,
      duration,
      color,
    });
  };

  const handleClose = () => {
    setTitle("");
    setStartTime("");
    setDuration(60);
    setColor("indigo");
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
              <h3 className="text-lg font-semibold text-white">
                {timeBlock ? "Edit Time Block" : "Add Time Block"}
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
                  Activity Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-2 bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter activity title"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime" className="text-sm font-medium text-slate-300">
                    Start Time
                  </Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="mt-2 bg-slate-800/50 border-slate-600/50 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="duration" className="text-sm font-medium text-slate-300">
                    Duration
                  </Label>
                  <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
                    <SelectTrigger className="mt-2 bg-slate-800/50 border-slate-600/50 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {durationOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value.toString()} className="text-white hover:bg-slate-700">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
                  disabled={createTimeBlockMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                >
                  {createTimeBlockMutation.isPending ? "Adding..." : "Add Block"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}