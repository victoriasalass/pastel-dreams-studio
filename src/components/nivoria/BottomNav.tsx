import { motion } from "framer-motion";
import { LayoutDashboard, Music, CalendarDays, User } from "lucide-react";
import type { Screen } from "@/pages/Index";

interface BottomNavProps {
  current: Screen;
  onNavigate: (screen: Screen) => void;
}

const items: { screen: Screen; icon: React.ReactNode; label: string }[] = [
  { screen: "dashboard", icon: <LayoutDashboard size={20} />, label: "Inicio" },
  { screen: "playlists", icon: <Music size={20} />, label: "Playlists" },
  { screen: "routine", icon: <CalendarDays size={20} />, label: "Rutina" },
  { screen: "profile", icon: <User size={20} />, label: "Perfil" },
];

const BottomNav = ({ current, onNavigate }: BottomNavProps) => (
  <div className="bg-pink-600 border-t border-pink-700 px-6 py-3 flex justify-around shrink-0">
    {items.map((item) => {
      const active = current === item.screen;
      return (
        <motion.button
          key={item.screen}
          onClick={() => onNavigate(item.screen)}
          className={`flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-colors ${
            active ? "text-black" : "text-black/70"
          }`}
          whileTap={{ scale: 0.9 }}
        >
          {item.icon}
          <span className="text-[10px] font-display font-bold text-black">{item.label}</span>
          {active && (
            <motion.div className="w-1 h-1 rounded-full bg-black" layoutId="nav-dot" />
          )}
        </motion.button>
      );
    })}
  </div>
);

export default BottomNav;
