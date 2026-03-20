import { motion } from "framer-motion";
import { LayoutDashboard, Music, CalendarDays } from "lucide-react";
import type { Screen } from "@/pages/Index";

interface BottomNavProps {
  current: Screen;
  onNavigate: (screen: Screen) => void;
}

const items: { screen: Screen; icon: React.ReactNode; label: string }[] = [
  { screen: "dashboard", icon: <LayoutDashboard size={20} />, label: "Inicio" },
  { screen: "playlists", icon: <Music size={20} />, label: "Playlists" },
  { screen: "routine", icon: <CalendarDays size={20} />, label: "Rutina" },
];

const BottomNav = ({ current, onNavigate }: BottomNavProps) => (
  <div className="glass border-t border-border px-6 py-3 flex justify-around shrink-0">
    {items.map((item) => {
      const active = current === item.screen;
      return (
        <motion.button
          key={item.screen}
          onClick={() => onNavigate(item.screen)}
          className={`flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-colors ${
            active ? "text-primary" : "text-muted-foreground"
          }`}
          whileTap={{ scale: 0.9 }}
        >
          {item.icon}
          <span className="text-[10px] font-display font-medium">{item.label}</span>
          {active && (
            <motion.div className="w-1 h-1 rounded-full bg-primary" layoutId="nav-dot" />
          )}
        </motion.button>
      );
    })}
  </div>
);

export default BottomNav;
