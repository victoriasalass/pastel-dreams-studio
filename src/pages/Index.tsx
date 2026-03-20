import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginScreen from "@/components/nivoria/LoginScreen";
import RegisterScreen from "@/components/nivoria/RegisterScreen";
import DashboardScreen from "@/components/nivoria/DashboardScreen";
import PlaylistsScreen from "@/components/nivoria/PlaylistsScreen";
import RoutineScreen from "@/components/nivoria/RoutineScreen";
import ProfileScreen from "@/components/nivoria/ProfileScreen";
import BottomNav from "@/components/nivoria/BottomNav";

export type Screen = "login" | "register" | "dashboard" | "playlists" | "routine" | "profile";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("login");
  const [userName, setUserName] = useState("");

  const isLoggedIn = screen !== "login" && screen !== "register";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="relative w-full max-w-[390px] h-[844px] rounded-[2.5rem] overflow-hidden shadow-soft border border-border gradient-card flex flex-col">
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <AnimatePresence mode="wait">
            {screen === "login" && (
              <motion.div key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                <LoginScreen onLogin={(name) => { setUserName(name); setScreen("dashboard"); }} onRegister={() => setScreen("register")} />
              </motion.div>
            )}
            {screen === "register" && (
              <motion.div key="register" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <RegisterScreen onBack={() => setScreen("login")} onRegister={(name) => { setUserName(name); setScreen("dashboard"); }} />
              </motion.div>
            )}
            {screen === "dashboard" && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <DashboardScreen userName={userName} />
              </motion.div>
            )}
            {screen === "playlists" && (
              <motion.div key="playlists" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <PlaylistsScreen />
              </motion.div>
            )}
            {screen === "routine" && (
              <motion.div key="routine" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <RoutineScreen />
              </motion.div>
            )}
            {screen === "profile" && (
              <motion.div key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <ProfileScreen userName={userName} onLogout={() => { setUserName(""); setScreen("login"); }} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {isLoggedIn && <BottomNav current={screen} onNavigate={setScreen} />}
      </div>
    </div>
  );
};

export default Index;
