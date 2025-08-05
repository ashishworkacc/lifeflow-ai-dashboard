import { motion } from "framer-motion";
import { 
  Calendar, 
  CheckSquare, 
  Zap, 
  Heart, 
  Target, 
  BarChart3, 
  BookOpen, 
  Settings,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user?: any;
}

const navigation = [
  { name: 'Dashboard', icon: Calendar, active: true },
  { name: 'Tasks', icon: CheckSquare, active: false },
  { name: 'Habits', icon: Zap, active: false },
  { name: 'Health', icon: Heart, active: false },
  { name: 'Goals', icon: Target, active: false },
  { name: 'Analytics', icon: BarChart3, active: false },
];

const secondaryNavigation = [
  { name: 'Journal', icon: BookOpen },
  { name: 'Settings', icon: Settings },
];

export default function Sidebar({ isOpen, onClose, user }: SidebarProps) {
  return (
    <motion.div
      initial={{ x: -256 }}
      animate={{ x: isOpen ? 0 : -256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed inset-y-0 left-0 z-50 w-64 glass-sidebar lg:translate-x-0"
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 border-b border-slate-700/50 px-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">LF</span>
          </div>
          <h1 className="text-xl font-semibold text-white">LifeFlow AI</h1>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden text-slate-400 hover:text-white"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* User Profile */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center space-x-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="bg-indigo-600 text-white">
              {user?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-white">{user?.name}</p>
            <p className="text-sm text-slate-400">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {navigation.map((item) => (
            <motion.a
              key={item.name}
              href="#"
              className={`${
                item.active
                  ? 'bg-indigo-600/20 text-indigo-300'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              } group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </motion.a>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-700/50">
          <div className="space-y-1">
            {secondaryNavigation.map((item) => (
              <motion.a
                key={item.name}
                href="#"
                className="text-slate-300 hover:bg-slate-700/50 hover:text-white group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </motion.a>
            ))}
          </div>
        </div>
      </nav>
    </motion.div>
  );
}
