import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useState } from "react";
import { calculateHealthScore, getHealthScoreColor, getHealthScoreLabel } from "@/lib/health-score";

interface HealthMetric {
  id: string;
  type: string;
  value: number;
  unit: string;
  date: Date;
}

interface HealthMetricsProps {
  metrics: HealthMetric[];
  onAddMetric: () => void;
  habits?: any[];
}

const healthMetricData = [
  {
    type: "sleep",
    emoji: "😴",
    label: "Sleep",
    value: "7h 45m",
    status: "Good",
    color: "indigo",
    progress: 85,
    bgColor: "bg-indigo-500/20",
    progressColor: "bg-indigo-500",
    textColor: "text-indigo-400"
  },
  {
    type: "steps",
    emoji: "👟",
    label: "Steps",
    value: "8,247 / 10,000",
    status: "82%",
    color: "emerald",
    progress: 82,
    bgColor: "bg-emerald-500/20",
    progressColor: "bg-emerald-500",
    textColor: "text-emerald-400"
  },
  {
    type: "water",
    emoji: "💧",
    label: "Water",
    value: "5 / 8 glasses",
    status: "63%",
    color: "blue",
    progress: 63,
    bgColor: "bg-blue-500/20",
    progressColor: "bg-blue-500",
    textColor: "text-blue-400"
  }
];

export default function HealthMetrics({ metrics, onAddMetric, habits = [] }: HealthMetricsProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  
  const { score: healthScore, breakdown } = calculateHealthScore(metrics, habits);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Health Metrics</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="text-slate-400 hover:text-white p-1"
        >
          <Info className="w-4 h-4" />
        </Button>
      </div>

      {/* Overall Health Score */}
      <div className="mb-4 p-4 bg-slate-800/30 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">Overall Health Score</p>
            <p className={`text-2xl font-bold ${getHealthScoreColor(healthScore)}`}>
              {healthScore}/100
            </p>
            <p className={`text-sm ${getHealthScoreColor(healthScore)}`}>
              {getHealthScoreLabel(healthScore)}
            </p>
          </div>
          <div className="w-16 bg-slate-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${healthScore}%` }}
              transition={{ duration: 0.5 }}
              className={`h-2 rounded-full ${
                healthScore >= 90 ? 'bg-emerald-500' :
                healthScore >= 80 ? 'bg-green-500' :
                healthScore >= 70 ? 'bg-yellow-500' :
                healthScore >= 60 ? 'bg-orange-500' : 'bg-red-500'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Breakdown */}
      {showBreakdown && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 space-y-2"
        >
          <p className="text-sm font-medium text-slate-300 mb-2">Score Breakdown:</p>
          {breakdown.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-slate-400">{item.category}</span>
              <div className="flex items-center space-x-2">
                <span className="text-slate-300">{item.details}</span>
                <span className={getHealthScoreColor(item.score)}>
                  {Math.round(item.score)}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      )}
      
      <div className="space-y-4">
        {healthMetricData.map((metric, index) => (
          <motion.div
            key={metric.type}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
                <span className="text-lg">{metric.emoji}</span>
              </div>
              <div>
                <p className="text-white font-medium">{metric.label}</p>
                <p className="text-slate-400 text-sm">{metric.value}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`${metric.textColor} text-sm`}>{metric.status}</p>
              <div className="w-16 bg-slate-700 rounded-full h-2 mt-1">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.progress}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`${metric.progressColor} h-2 rounded-full`}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Button
        variant="outline"
        className="w-full mt-4 bg-slate-700/50 hover:bg-slate-600/50 border-slate-600/50 text-slate-300"
        onClick={onAddMetric}
      >
        Log Health Data
      </Button>
    </motion.div>
  );
}
