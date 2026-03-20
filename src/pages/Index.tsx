import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginScreen from "@/components/nivoria/LoginScreen";
import RegisterScreen from "@/components/nivoria/RegisterScreen";
import DashboardScreen from "@/components/nivoria/DashboardScreen";
import PlaylistsScreen from "@/components/nivoria/PlaylistsScreen";
import RoutineScreen from "@/components/nivoria/RoutineScreen";
import ProfileScreen from "@/components/nivoria/ProfileScreen";
import BottomNav from "@/components/nivoria/BottomNav";
import NotificationCenter, { NotificationToast, useSimulatedNotifications } from "@/components/nivoria/NotificationCenter";

export type Screen = "login" | "register" | "dashboard" | "playlists" | "routine" | "profile";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("login");
  const [userName, setUserName] = useState("");
  const { notifications, toast, addNotification, dismiss, clearAll, dismissToast, soundEnabled, toggleSound } = useSimulatedNotifications();

  const isLoggedIn = screen !== "login" && screen !== "register";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="relative w-full max-w-[390px] h-[844px] rounded-[2.5rem] overflow-hidden shadow-soft border border-border gradient-card flex flex-col">
        {/* Notification bar for logged-in users */}
        {isLoggedIn && (
          <div className="flex items-center justify-between px-6 pt-4 pb-1 shrink-0">
            <p className="text-xs text-muted-foreground font-body">NIVORIA</p>
            <NotificationCenter notifications={notifications} onDismiss={dismiss} onClear={clearAll} soundEnabled={soundEnabled} onToggleSound={toggleSound} />
          </div>
        )}

        {/* Toast overlay */}
        <div className="absolute top-14 left-4 right-4 z-50">
          <AnimatePresence>
            {isLoggedIn && toast && (
              <NotificationToast key={toast.id} notification={toast} onDismiss={dismissToast} />
            )}
          </AnimatePresence>
        </div>

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
                <DashboardScreen userName={userName} onNavigateRoutine={() => setScreen("routine")} />
              </motion.div>
            )}
            {screen === "playlists" && (
              <motion.div key="playlists" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <PlaylistsScreen />
              </motion.div>
            )}
            {screen === "routine" && (
              <motion.div key="routine" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <RoutineScreen onAddReminder={(title, message) => {
                  addNotification({ title, message, type: "reminder", time: new Date().toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" }) });
                }} />
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
