import { motion } from "framer-motion";
import { Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TimeBlock {
  id: string;
  title: string;
  startTime: string;
  duration: number;
  color: string;
}

interface TimeBlocksProps {
  timeBlocks: TimeBlock[];
  onAddTimeBlock: () => void;
}

const colorClasses = {
  indigo: "from-indigo-600 to-purple-600",
  emerald: "from-emerald-600 to-cyan-600",
  orange: "from-orange-600 to-red-600",
  blue: "from-blue-600 to-cyan-600",
  purple: "from-purple-600 to-indigo-600",
};

const formatTime = (timeStr: string) => {
  const [hours, minutes] = timeStr.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return { hour: displayHour.toString(), period: ampm };
};

const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

export default function TimeBlocks({ timeBlocks, onAddTimeBlock }: TimeBlocksProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Today's Schedule</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onAddTimeBlock}
          className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      <div className="space-y-3">
        {timeBlocks.map((block, index) => {
          const timeFormat = formatTime(block.startTime);
          
          return (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-4 p-3 rounded-lg bg-slate-800/30"
            >
              <div className="text-center min-w-[60px]">
                <p className="text-sm font-medium text-white">{timeFormat.hour}:00</p>
                <p className="text-xs text-slate-400">{timeFormat.period}</p>
              </div>
              <div className="flex-1">
                <div className={`h-8 bg-gradient-to-r ${colorClasses[block.color as keyof typeof colorClasses]} rounded-md flex items-center px-3`}>
                  <span className="text-white text-sm font-medium">{block.title}</span>
                </div>
              </div>
              <div className="text-sm text-slate-400 min-w-[40px] text-right">
                {formatDuration(block.duration)}
              </div>
            </motion.div>
          );
        })}
        
        {timeBlocks.length === 0 && (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-400">No schedule blocks for today</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
