import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, CheckCircle, Clock, AlertTriangle } from "lucide-react";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "reminder" | "success" | "warning";
  time: string;
  read: boolean;
}

interface NotificationCenterProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
  onClear: () => void;
}

const typeConfig = {
  reminder: { icon: <Clock size={16} />, bg: "bg-pastel-blue/30", border: "border-accent/30" },
  success: { icon: <CheckCircle size={16} />, bg: "bg-pastel-purple/30", border: "border-primary/30" },
  warning: { icon: <AlertTriangle size={16} />, bg: "bg-pastel-pink/30", border: "border-secondary/30" },
};

export const NotificationToast = ({ notification, onDismiss }: { notification: Notification; onDismiss: () => void }) => {
  const config = typeConfig[notification.type];

  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -60, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.95 }}
      className={`flex items-start gap-3 p-4 rounded-2xl ${config.bg} border ${config.border} shadow-soft backdrop-blur-sm`}
    >
      <div className="mt-0.5 shrink-0">{config.icon}</div>
      <div className="flex-1 min-w-0">
        <p className="font-display font-semibold text-xs text-foreground">{notification.title}</p>
        <p className="text-[11px] text-muted-foreground">{notification.message}</p>
      </div>
      <button onClick={onDismiss} className="text-muted-foreground shrink-0">
        <X size={14} />
      </button>
    </motion.div>
  );
};

const NotificationCenter = ({ notifications, onDismiss, onClear }: NotificationCenterProps) => {
  const [open, setOpen] = useState(false);
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <motion.button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl text-muted-foreground hover:text-primary transition-colors"
        whileTap={{ scale: 0.9 }}
      >
        <Bell size={20} />
        {unread > 0 && (
          <motion.span
            className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-secondary text-[9px] font-bold text-secondary-foreground flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            {unread}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 top-12 w-72 max-h-80 overflow-y-auto rounded-2xl bg-card border border-border shadow-soft z-50 p-3"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-display font-semibold text-sm text-foreground">Notificaciones</h3>
              {notifications.length > 0 && (
                <button onClick={onClear} className="text-[10px] text-primary font-body">Limpiar</button>
              )}
            </div>

            {notifications.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">Sin notificaciones</p>
            ) : (
              <div className="space-y-2">
                {notifications.map(n => {
                  const config = typeConfig[n.type];
                  return (
                    <motion.div
                      key={n.id}
                      layout
                      className={`flex items-start gap-2 p-3 rounded-xl ${config.bg} border ${config.border}`}
                    >
                      <div className="mt-0.5 shrink-0">{config.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-semibold text-[11px] text-foreground">{n.title}</p>
                        <p className="text-[10px] text-muted-foreground">{n.message}</p>
                        <p className="text-[9px] text-muted-foreground mt-1">{n.time}</p>
                      </div>
                      <button onClick={() => onDismiss(n.id)} className="text-muted-foreground shrink-0">
                        <X size={12} />
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;

// Hook to simulate notifications
export const useSimulatedNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toast, setToast] = useState<Notification | null>(null);

  const addNotification = useCallback((n: Omit<Notification, "id" | "read">) => {
    const notif: Notification = { ...n, id: crypto.randomUUID(), read: false };
    setNotifications(prev => [notif, ...prev]);
    setToast(notif);
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => setNotifications([]), []);
  const dismissToast = useCallback(() => setToast(null), []);

  // Simulate periodic reminders
  useEffect(() => {
    const reminders = [
      { title: "💊 Medicamentos", message: "Es hora de tu dosis de la mañana", type: "reminder" as const },
      { title: "💧 Hidratación", message: "Recuerda tomar tu vaso de agua", type: "reminder" as const },
      { title: "🚶 Caminata", message: "¡15 minutos de caminata te esperan!", type: "warning" as const },
      { title: "🍽️ Almuerzo", message: "Hora de tu dieta blanda", type: "reminder" as const },
      { title: "🏋️ Ejercicios", message: "Toca estiramientos, ¡vamos!", type: "warning" as const },
      { title: "✅ ¡Bien hecho!", message: "Completaste el 60% de tu rutina", type: "success" as const },
      { title: "🎵 Playlist sugerida", message: "VELVET SKY combina con tu rutina", type: "success" as const },
    ];

    let index = 0;

    // First notification after 5 seconds
    const firstTimer = setTimeout(() => {
      const r = reminders[index % reminders.length];
      const now = new Date();
      addNotification({ ...r, time: now.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" }) });
      index++;
    }, 5000);

    // Then every 15 seconds
    const interval = setInterval(() => {
      const r = reminders[index % reminders.length];
      const now = new Date();
      addNotification({ ...r, time: now.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" }) });
      index++;
    }, 15000);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
    };
  }, [addNotification]);

  return { notifications, toast, addNotification, dismiss, clearAll, dismissToast };
};
