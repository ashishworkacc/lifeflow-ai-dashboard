import { motion } from "framer-motion";
import { CheckCircle, Zap, Heart, Lightbulb } from "lucide-react";

interface StatsOverviewProps {
  stats: {
    focus: string;
    focusPercentage: number;
    streak: string;
    health: string;
    insights: string;
  };
}

const statItems = [
  {
    title: "Today's Focus",
    icon: CheckCircle,
    color: "emerald",
    bgColor: "bg-emerald-500/20",
    textColor: "text-emerald-400",
    iconColor: "text-emerald-400",
  },
  {
    title: "Longest Streak",
    icon: Zap,
    color: "orange",
    bgColor: "bg-orange-500/20",
    textColor: "text-orange-400",
    iconColor: "text-orange-400",
  },
  {
    title: "Health Score",
    icon: Heart,
    color: "cyan",
    bgColor: "bg-cyan-500/20",
    textColor: "text-cyan-400",
    iconColor: "text-cyan-400",
  },
  {
    title: "AI Insights",
    icon: Lightbulb,
    color: "purple",
    bgColor: "bg-purple-500/20",
    textColor: "text-purple-400",
    iconColor: "text-purple-400",
  },
];

export default function StatsOverview({ stats }: StatsOverviewProps) {
  const statValues = [
    { value: stats.focus, subtext: `${stats.focusPercentage}% complete` },
    { value: stats.streak, subtext: "🔥 Reading daily" },
    { value: stats.health, subtext: "+0.3 from yesterday" },
    { value: stats.insights, subtext: "Productivity tips" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass-card rounded-xl p-6 hover:bg-slate-700/30 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">{item.title}</p>
              <p className="text-2xl font-bold text-white mt-1">
                {statValues[index].value}
              </p>
              <p className={`${item.textColor} text-sm mt-1`}>
                {statValues[index].subtext}
              </p>
            </div>
            <div className={`w-12 h-12 ${item.bgColor} rounded-lg flex items-center justify-center`}>
              <item.icon className={`w-6 h-6 ${item.iconColor}`} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
