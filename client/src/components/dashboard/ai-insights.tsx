import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

const insights = [
  {
    type: "Productivity Tip",
    emoji: "🎯",
    content: "Your focus peaks between 10-11 AM. Schedule your most important work during this time.",
    gradient: "from-purple-500/10 to-indigo-500/10",
    border: "border-purple-500/20"
  },
  {
    type: "Achievement",
    emoji: "🌟",
    content: "Congratulations! You've maintained your reading habit for 23 days straight.",
    gradient: "from-emerald-500/10 to-cyan-500/10",
    border: "border-emerald-500/20"
  },
  {
    type: "Energy Optimization",
    emoji: "⚡",
    content: "Consider taking a 15-minute break. You've been focused for 90 minutes.",
    gradient: "from-orange-500/10 to-red-500/10",
    border: "border-orange-500/20"
  }
];

export default function AIInsights() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card rounded-xl p-6"
    >
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
          <Lightbulb className="w-3 h-3 text-white" />
        </div>
        <h2 className="text-lg font-semibold text-white">AI Insights</h2>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 bg-gradient-to-r ${insight.gradient} rounded-lg border ${insight.border}`}
          >
            <p className="text-sm text-white mb-2">
              {insight.emoji} <strong>{insight.type}</strong>
            </p>
            <p className="text-slate-300 text-sm">{insight.content}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
