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

interface HealthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const healthTypes = [
  { value: "sleep", label: "Sleep", unit: "hours" },
  { value: "steps", label: "Steps", unit: "steps" },
  { value: "water", label: "Water", unit: "glasses" },
  { value: "weight", label: "Weight", unit: "kg" },
  { value: "calories", label: "Calories", unit: "cal" },
  { value: "heart_rate", label: "Heart Rate", unit: "bpm" },
];

export default function HealthModal({ isOpen, onClose }: HealthModalProps) {
  const [type, setType] = useState("sleep");
  const [value, setValue] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createHealthMetricMutation = useMutation({
    mutationFn: async (metricData: any) => {
      await apiRequest("POST", "/api/health-metrics", metricData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/health-metrics"] });
      toast({
        title: "Success",
        description: "Health metric logged successfully",
      });
      handleClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to log health metric",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value || isNaN(Number(value))) return;

    const selectedType = healthTypes.find(t => t.value === type);
    
    createHealthMetricMutation.mutate({
      type,
      value: Number(value),
      unit: selectedType?.unit || "",
    });
  };

  const handleClose = () => {
    setType("sleep");
    setValue("");
    onClose();
  };

  const selectedType = healthTypes.find(t => t.value === type);

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
              <h3 className="text-lg font-semibold text-white">Log Health Data</h3>
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
                <Label htmlFor="type" className="text-sm font-medium text-slate-300">
                  Metric Type
                </Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="mt-2 bg-slate-800/50 border-slate-600/50 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {healthTypes.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="text-white hover:bg-slate-700">
                        {option.label} ({option.unit})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="value" className="text-sm font-medium text-slate-300">
                  Value ({selectedType?.unit})
                </Label>
                <Input
                  id="value"
                  type="number"
                  step="0.1"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="mt-2 bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder={`Enter ${selectedType?.label.toLowerCase()} value`}
                  required
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
                  disabled={createHealthMetricMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                >
                  {createHealthMetricMutation.isPending ? "Logging..." : "Log Metric"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
