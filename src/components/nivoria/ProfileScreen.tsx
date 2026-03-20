import { useState } from "react";
import { motion } from "framer-motion";
import { User, Music, Headphones, Plus, LogOut, Settings, CheckCircle, ChevronRight } from "lucide-react";

interface ProfileScreenProps {
  userName: string;
  onLogout: () => void;
}

interface ConnectedService {
  name: string;
  icon: React.ReactNode;
  username: string;
  connected: boolean;
}

const ProfileScreen = ({ userName, onLogout }: ProfileScreenProps) => {
  const [services, setServices] = useState<ConnectedService[]>([
    { name: "Spotify", icon: <Music size={20} />, username: "nolly_music", connected: true },
    { name: "Apple Music", icon: <Headphones size={20} />, username: "Sincronización activa", connected: true },
  ]);

  const toggleService = (i: number) => {
    setServices(prev => prev.map((s, j) => j === i ? { ...s, connected: !s.connected } : s));
  };

  const stats = [
    { label: "Playlists", value: "124" },
    { label: "Escuchas", value: "2.5k" },
    { label: "Rutinas", value: "18" },
    { label: "Días activo", value: "42" },
  ];

  const initials = userName
    .split(" ")
    .map(w => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="px-6 pt-12 pb-24">
      {/* Header */}
      <motion.div
        className="flex flex-col items-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-24 h-24 rounded-full gradient-button flex items-center justify-center shadow-glow mb-4">
          <span className="text-2xl font-display font-bold text-primary-foreground">{initials}</span>
        </div>
        <h1 className="text-xl font-display font-bold text-foreground">{userName}</h1>
        <p className="text-sm text-muted-foreground">Miembro desde 2024</p>
      </motion.div>

      {/* Stats grid */}
      <motion.div
        className="grid grid-cols-2 gap-3 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`rounded-2xl p-4 text-center border border-border/50 ${
              i % 4 === 0 ? "bg-pastel-purple/25" :
              i % 4 === 1 ? "bg-pastel-pink/25" :
              i % 4 === 2 ? "bg-pastel-blue/25" :
              "bg-pastel-lavender/25"
            }`}
          >
            <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Connected services */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-display font-semibold text-foreground text-sm">Servicios Conectados</h2>
          <button className="text-xs text-primary font-body">Gestionar</button>
        </div>

        <div className="space-y-3">
          {services.map((service, i) => (
            <motion.button
              key={i}
              onClick={() => toggleService(i)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card border border-border text-left"
              whileTap={{ scale: 0.98 }}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                service.connected ? "gradient-button text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {service.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-sm text-foreground">{service.name}</p>
                <p className="text-xs text-muted-foreground">
                  {service.connected ? service.username : "No conectado"}
                </p>
              </div>
              {service.connected && <CheckCircle size={18} className="text-primary" />}
            </motion.button>
          ))}

          <motion.button
            className="w-full flex items-center gap-4 p-4 rounded-2xl border border-dashed border-border text-left hover:border-primary/50 transition-colors"
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
              <Plus size={20} />
            </div>
            <span className="font-display font-medium text-sm text-muted-foreground">AGREGAR OTRO SERVICIO</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Settings & Logout */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card border border-border text-left">
          <Settings size={18} className="text-muted-foreground" />
          <span className="flex-1 font-display text-sm text-foreground">Configuración</span>
          <ChevronRight size={16} className="text-muted-foreground" />
        </button>

        <motion.button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border border-secondary text-secondary-foreground font-display font-semibold text-sm hover:bg-secondary/20 transition-colors"
          whileTap={{ scale: 0.98 }}
        >
          <LogOut size={16} />
          Cerrar Sesión
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ProfileScreen;
