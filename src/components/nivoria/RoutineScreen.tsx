import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit3, CheckCircle, ChevronDown, Sparkles } from "lucide-react";

interface TimeSlot {
  time: string;
  activity: string;
}

const defaultSlots: TimeSlot[] = [
  { time: "07:00 AM", activity: "" },
  { time: "08:00 AM", activity: "" },
  { time: "09:00 AM", activity: "" },
  { time: "10:00 AM", activity: "" },
  { time: "12:00 PM", activity: "" },
];

const RoutineScreen = () => {
  const [hasRoutine, setHasRoutine] = useState(false);
  const [slots, setSlots] = useState<TimeSlot[]>(defaultSlots);
  const [editing, setEditing] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const updateSlot = (i: number, activity: string) => {
    setSlots(prev => prev.map((s, j) => j === i ? { ...s, activity } : s));
  };

  if (!hasRoutine) {
    return (
      <div className="px-6 pt-12 pb-24 flex flex-col items-center justify-center min-h-[700px]">
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
    <div className="px-6 pt-12 pb-24">
      <motion.div className="mb-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-foreground">AÑADIR RUTINA+</h1>
      </motion.div>

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

      {/* Tip */}
      <motion.div className="flex items-start gap-3 p-4 rounded-2xl bg-pastel-blue/20 border border-accent/30 mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <Sparkles size={18} className="text-accent shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground font-body">
          Configura tus bloques de tiempo para maximizar tu enfoque diario.
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
