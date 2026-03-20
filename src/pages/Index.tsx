import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginScreen from "@/components/nivoria/LoginScreen";
import RegisterScreen from "@/components/nivoria/RegisterScreen";
import DashboardScreen from "@/components/nivoria/DashboardScreen";
import PlaylistsScreen from "@/components/nivoria/PlaylistsScreen";
import RoutineScreen from "@/components/nivoria/RoutineScreen";
import ProfileScreen from "@/components/nivoria/ProfileScreen";
import RachaScreen from "@/components/nivoria/RachaScreen";
import RachaInformacionScreen from "@/components/nivoria/RachaInformacionScreen";
import BottomNav from "@/components/nivoria/BottomNav";

export type Screen =
  | "login"
  | "register"
  | "dashboard"
  | "playlists"
  | "routine"
  | "profile"
  | "racha"
  | "rachaInfo";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("login");
  const [userName, setUserName] = useState("");
  const [history, setHistory] = useState<Screen[]>(["login"]);
  const historyRef = useRef(history);

  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  const isLoggedIn = screen !== "login" && screen !== "register";

  const navigate = (next: Screen) => {
    setHistory((h) => [...h, next]);
    setScreen(next);
  };

  const goBack = () => {
    const h = historyRef.current;
    if (h.length <= 1) return;
    const prev = h[h.length - 2];
    setHistory(h.slice(0, -1));
    setScreen(prev);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="relative w-full max-w-[390px] h-[844px] rounded-[2.5rem] overflow-hidden shadow-soft border border-border bg-pastel-pink/20 flex flex-col">

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <AnimatePresence mode="wait">
            {screen === "login" && (
              <motion.div key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                <LoginScreen onLogin={(name) => { setUserName(name); navigate("dashboard"); }} onRegister={() => navigate("register")} />
              </motion.div>
            )}
            {screen === "register" && (
              <motion.div key="register" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <RegisterScreen onBack={() => navigate("login")} onRegister={(name) => { setUserName(name); navigate("dashboard"); }} />
              </motion.div>
            )}
            {screen === "dashboard" && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <DashboardScreen userName={userName} onNavigate={navigate} onBack={goBack} />
              </motion.div>
            )}
            {screen === "playlists" && (
              <motion.div key="playlists" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <PlaylistsScreen onBack={goBack} />
              </motion.div>
            )}
            {screen === "routine" && (
              <motion.div key="routine" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <RoutineScreen onBack={goBack} />
              </motion.div>
            )}
            {screen === "profile" && (
              <motion.div key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <ProfileScreen
                  userName={userName}
                  onLogout={() => { setUserName(""); navigate("login"); }}
                  onNavigatePlaylists={() => navigate("playlists")}
                  onNavigateRacha={() => navigate("racha")}
                  onNavigateInformacion={() => navigate("rachaInfo")}
                  onBack={goBack}
                />
              </motion.div>
            )}
            {screen === "racha" && (
              <motion.div key="racha" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <RachaScreen onBack={goBack} />
              </motion.div>
            )}

            {screen === "rachaInfo" && (
              <motion.div key="rachaInfo" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <RachaInformacionScreen onBack={goBack} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {isLoggedIn && <BottomNav current={screen} onNavigate={navigate} />}
      </div>
    </div>
  );
};

export default Index;
