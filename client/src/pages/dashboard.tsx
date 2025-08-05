import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Sidebar from "@/components/dashboard/sidebar";
import StatsOverview from "@/components/dashboard/stats-overview";
import TasksSection from "@/components/dashboard/tasks-section";
import HabitsSection from "@/components/dashboard/habits-section";
import HealthMetrics from "@/components/dashboard/health-metrics";
import AIInsights from "@/components/dashboard/ai-insights";
import QuickNotes from "@/components/dashboard/quick-notes";
import GoalsProgress from "@/components/dashboard/goals-progress";
import TimeBlocks from "@/components/dashboard/time-blocks";
import TaskModal from "@/components/modals/task-modal";
import HabitModal from "@/components/modals/habit-modal";
import HealthModal from "@/components/modals/health-modal";
import GoalModal from "@/components/modals/goal-modal";
import TimeBlockModal from "@/components/modals/time-block-modal";
import { useDashboard } from "@/hooks/use-dashboard";
import { calculateHealthScore } from "@/lib/health-score";
import { Plus, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardData {
  user: any;
  tasks: any[];
  habits: any[];
  goals: any[];
  timeBlocks: any[];
  healthMetrics: any[];
  notes: any[];
}

const defaultDashboardData: DashboardData = {
  user: null,
  tasks: [],
  habits: [],
  goals: [],
  timeBlocks: [],
  healthMetrics: [],
  notes: [],
};

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [habitModalOpen, setHabitModalOpen] = useState(false);
  const [healthModalOpen, setHealthModalOpen] = useState(false);
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [timeBlockModalOpen, setTimeBlockModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);

  const { data: dashboardData = defaultDashboardData, isLoading } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
  });

  const { user, tasks, habits, goals, timeBlocks, healthMetrics, notes } = dashboardData;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const completedTasks = tasks?.filter((task: any) => task.completed).length || 0;
  const totalTasks = tasks?.length || 0;
  const focusPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const longestStreak = habits?.reduce((max: number, habit: any) => 
    habit.streak > max ? habit.streak : max, 0) || 0;

  const { score: healthScore, breakdown: healthBreakdown } = calculateHealthScore(
    healthMetrics || [], 
    habits || []
  );
  const aiInsightsCount = 3; // Number of new insights

  const stats = {
    focus: `${completedTasks}/${totalTasks}`,
    focusPercentage,
    streak: `${longestStreak} days`,
    health: `${healthScore}/100`,
    insights: `${aiInsightsCount} new`
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        user={user}
      />

      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/50 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-700"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </Button>
              <div className="ml-4 lg:ml-0">
                <h1 className="text-2xl font-semibold text-white">
                  Good morning, {user?.name?.split(' ')[0]}! ✨
                </h1>
                <p className="text-slate-400">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                onClick={() => setTaskModalOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Quick Add
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="px-4 sm:px-6 lg:px-8 py-8">
          <StatsOverview stats={stats} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              <TasksSection 
                tasks={tasks || []} 
                onAddTask={() => setTaskModalOpen(true)}
              />
              <HabitsSection 
                habits={habits || []} 
                onAddHabit={() => setHabitModalOpen(true)}
              />
              <TimeBlocks 
                timeBlocks={timeBlocks || []} 
                onAddTimeBlock={() => setTimeBlockModalOpen(true)}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <AIInsights />
              <HealthMetrics 
                metrics={healthMetrics || []} 
                habits={habits || []}
                onAddMetric={() => setHealthModalOpen(true)}
              />
              <QuickNotes notes={notes || []} />
              <GoalsProgress 
                goals={goals || []} 
                onEditGoal={(goal) => {
                  setEditingGoal(goal);
                  setGoalModalOpen(true);
                }}
                onAddGoal={() => {
                  setEditingGoal(null);
                  setGoalModalOpen(true);
                }}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <TaskModal 
        isOpen={taskModalOpen} 
        onClose={() => setTaskModalOpen(false)} 
      />
      <HabitModal 
        isOpen={habitModalOpen} 
        onClose={() => setHabitModalOpen(false)} 
      />
      <HealthModal 
        isOpen={healthModalOpen} 
        onClose={() => setHealthModalOpen(false)} 
      />
      <GoalModal
        isOpen={goalModalOpen}
        onClose={() => {
          setGoalModalOpen(false);
          setEditingGoal(null);
        }}
        goal={editingGoal}
      />
      <TimeBlockModal
        isOpen={timeBlockModalOpen}
        onClose={() => setTimeBlockModalOpen(false)}
      />
    </div>
  );
}
