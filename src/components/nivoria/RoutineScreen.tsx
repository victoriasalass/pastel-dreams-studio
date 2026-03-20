import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, CreditCard as Edit3, CircleCheck as CheckCircle, ChevronDown, Sparkles, Bell, X, Clock } from "lucide-react";

interface TimeSlot {
  time: string;
  activity: string;
}

export interface CustomReminder {
  id: string;
  hour: string;
  minute: string;
  period: "AM" | "PM";
  message: string;
  active: boolean;
}

const defaultSlots: TimeSlot[] = [
  { time: "07:00 AM", activity: "" },
  { time: "08:00 AM", activity: "" },
  { time: "09:00 AM", activity: "" },
  { time: "10:00 AM", activity: "" },
  { time: "12:00 PM", activity: "" },
];

const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const minutes = ["00", "15", "30", "45"];

const RoutineScreen = () => {
  const [hasRoutine, setHasRoutine] = useState(false);
  const [slots, setSlots] = useState<TimeSlot[]>(defaultSlots);
  const [editing, setEditing] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [expanded, setExpanded] = useState(true);

  // Reminders
  const [reminders, setReminders] = useState<CustomReminder[]>([]);
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [newHour, setNewHour] = useState("08");
  const [newMinute, setNewMinute] = useState("00");
  const [newPeriod, setNewPeriod] = useState<"AM" | "PM">("AM");
  const [newMessage, setNewMessage] = useState("");

  const updateSlot = (i: number, activity: string) => {
    setSlots(prev => prev.map((s, j) => j === i ? { ...s, activity } : s));
  };

  const addReminder = () => {
    if (!newMessage.trim()) return;
    const reminder: CustomReminder = {
      id: crypto.randomUUID(),
      hour: newHour,
      minute: newMinute,
      period: newPeriod,
      message: newMessage.trim(),
      active: true,
    };
    setReminders(prev => [...prev, reminder]);
    setShowReminderForm(false);
    setNewMessage("");
  };

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  if (!hasRoutine) {
    return (
      <div className="px-6 pt-8 pb-24 flex flex-col items-center justify-center min-h-[700px]">
        <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-16 h-16 rounded-full bg-pastel-lavender/50 flex items-center justify-center mx-auto mb-4">
            <Sparkles size={28} className="text-primary" />
          </div>
          <h1 className="text-xl font-display font-bold text-foreground mb-2">¿NO TIENES RUTINA AUN?</h1>
          <p className="text-sm text-muted-foreground mb-8 max-w-[250px]">
            Empieza a organizar tus actividades diarias para alcanzar tus metas.
          </p>
          <motion.button
            onClick={() => setHasRoutine(true)}
            className="flex items-center gap-2 mx-auto px-6 py-3 rounded-2xl gradient-button text-primary-foreground font-display font-semibold text-sm shadow-soft"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus size={18} /> AGREGAR RUTINA
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="px-6 pt-8 pb-24">
      <motion.div className="mb-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-foreground">AÑADIR RUTINA+</h1>
      </motion.div>

      {/* Time slots */}
      <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1 text-muted-foreground text-xs mb-4 font-body">
        <ChevronDown size={16} className={`transition-transform ${expanded ? "" : "-rotate-90"}`} />
        {expanded ? "Ocultar horarios" : "Mostrar horarios"}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div className="space-y-3 mb-6" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            {slots.map((slot, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <span className="text-xs text-muted-foreground font-body w-16 shrink-0">{slot.time}</span>
                {editing === i ? (
                  <input
                    autoFocus
                    value={slot.activity}
                    onChange={(e) => updateSlot(i, e.target.value)}
                    onBlur={() => setEditing(null)}
                    onKeyDown={(e) => e.key === "Enter" && setEditing(null)}
                    placeholder="Escribe actividad..."
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none font-body"
                  />
                ) : (
                  <span className="flex-1 text-sm text-foreground font-body truncate">
                    {slot.activity || <span className="text-muted-foreground italic">Sin actividad</span>}
                  </span>
                )}
                <motion.button onClick={() => setEditing(editing === i ? null : i)} whileTap={{ scale: 0.9 }}>
                  <Edit3 size={16} className="text-muted-foreground hover:text-primary transition-colors" />
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reminders Section */}
      <motion.div className="mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-display font-semibold text-foreground text-sm flex items-center gap-2">
            <Bell size={16} className="text-primary" />
            Recordatorios
          </h2>
          <button
            onClick={() => setShowReminderForm(!showReminderForm)}
            className="text-xs text-primary font-body font-medium"
          >
            {showReminderForm ? "Cancelar" : "+ Nuevo"}
          </button>
        </div>

        {/* Reminder Form */}
        <AnimatePresence>
          {showReminderForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 rounded-2xl bg-pastel-lavender/20 border border-primary/20 mb-3 space-y-3">
                {/* Time picker */}
                <div>
                  <label className="text-[11px] text-muted-foreground font-body mb-1.5 block">Hora del recordatorio</label>
                  <div className="flex gap-2 items-center">
                    <select
                      value={newHour}
                      onChange={(e) => setNewHour(e.target.value)}
                      className="flex-1 px-3 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground font-body focus:outline-none focus:ring-2 focus:ring-primary/40 appearance-none cursor-pointer"
                    >
                      {hours.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                    <span className="text-foreground font-bold">:</span>
                    <select
                      value={newMinute}
                      onChange={(e) => setNewMinute(e.target.value)}
                      className="flex-1 px-3 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground font-body focus:outline-none focus:ring-2 focus:ring-primary/40 appearance-none cursor-pointer"
                    >
                      {minutes.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <div className="flex rounded-xl overflow-hidden border border-border">
                      <button
                        onClick={() => setNewPeriod("AM")}
                        className={`px-3 py-2 text-xs font-display font-medium transition-colors ${
                          newPeriod === "AM" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"
                        }`}
                      >
                        AM
                      </button>
                      <button
                        onClick={() => setNewPeriod("PM")}
                        className={`px-3 py-2 text-xs font-display font-medium transition-colors ${
                          newPeriod === "PM" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"
                        }`}
                      >
                        PM
                      </button>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="text-[11px] text-muted-foreground font-body mb-1.5 block">Mensaje</label>
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value.slice(0, 100))}
                    onKeyDown={(e) => e.key === "Enter" && addReminder()}
                    placeholder="Ej: Tomar medicamento, hacer ejercicio..."
                    className="w-full px-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-body"
                    maxLength={100}
                  />
                  <p className="text-[10px] text-muted-foreground mt-1 text-right">{newMessage.length}/100</p>
                </div>

                {/* Add button */}
                <motion.button
                  onClick={addReminder}
                  disabled={!newMessage.trim()}
                  className="w-full py-3 rounded-xl gradient-button text-primary-foreground font-display font-semibold text-xs shadow-soft disabled:opacity-40 disabled:cursor-not-allowed"
                  whileTap={{ scale: 0.98 }}
                >
                  AGREGAR RECORDATORIO
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reminder list */}
        <div className="space-y-2">
          <AnimatePresence>
            {reminders.map((r) => (
              <motion.div
                key={r.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-colors ${
                  r.active
                    ? "bg-pastel-pink/20 border-secondary/30"
                    : "bg-muted/50 border-border opacity-60"
                }`}
              >
                <motion.button
                  onClick={() => toggleReminder(r.id)}
                  whileTap={{ scale: 0.9 }}
                  className="shrink-0"
                >
                  <Clock size={16} className={r.active ? "text-primary" : "text-muted-foreground"} />
                </motion.button>
                <div className="flex-1 min-w-0">
                  <p className={`font-display font-semibold text-xs ${r.active ? "text-foreground" : "text-muted-foreground line-through"}`}>
                    {r.hour}:{r.minute} {r.period}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">{r.message}</p>
                </div>
                <motion.button
                  onClick={() => deleteReminder(r.id)}
                  whileTap={{ scale: 0.9 }}
                  className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                >
                  <X size={14} />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>

          {reminders.length === 0 && !showReminderForm && (
            <p className="text-xs text-muted-foreground text-center py-3 font-body">
              Sin recordatorios configurados
            </p>
          )}
        </div>
      </motion.div>

      {/* Tip */}
      <motion.div className="flex items-start gap-3 p-4 rounded-2xl bg-pastel-blue/20 border border-accent/30 mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <Sparkles size={18} className="text-accent shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground font-body">
          Configura tus bloques de tiempo y recordatorios para maximizar tu enfoque diario.
        </p>
      </motion.div>

      {/* Confirm */}
      <motion.button
        onClick={() => setConfirmed(!confirmed)}
        className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-display font-semibold text-sm transition-all ${
          confirmed ? "bg-primary text-primary-foreground shadow-glow" : "gradient-button text-primary-foreground shadow-soft"
        }`}
        whileTap={{ scale: 0.98 }}
      >
        {confirmed ? "✓ RUTINA CONFIRMADA" : "CONFIRMAR RUTINA"}
        {!confirmed && <CheckCircle size={16} />}
      </motion.button>
    </div>
  );
};

export default RoutineScreen;
