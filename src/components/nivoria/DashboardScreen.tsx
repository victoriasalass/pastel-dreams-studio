import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock, Download, TrendingUp, Stethoscope, Plus } from "lucide-react";

interface DashboardScreenProps {
  userName: string;
  onNavigateRoutine?: () => void;
}

type TaskStatus = "done" | "skipped" | "pending";

interface Task {
  time: string;
  title: string;
  subtitle: string;
  status: TaskStatus;
}

const initialTasks: Task[] = [
  { time: "07:00 AM", title: "MEDICAMENTOS", subtitle: "Dosis mañana", status: "done" },
  { time: "08:30 AM", title: "HIDRATACIÓN", subtitle: "Vaso 500ml", status: "done" },
  { time: "10:00 AM", title: "CAMINATA", subtitle: "15 minutos patio", status: "skipped" },
  { time: "01:00 PM", title: "ALMUERZO", subtitle: "Dieta blanda", status: "done" },
  { time: "04:00 PM", title: "EJERCICIOS", subtitle: "Estiramientos", status: "pending" },
];

const statusIcon = (s: TaskStatus) => {
  switch (s) {
    case "done": return <CheckCircle size={20} className="text-primary" />;
    case "skipped": return <XCircle size={20} className="text-secondary" />;
    case "pending": return <Clock size={20} className="text-accent" />;
  }
};

const DashboardScreen = ({ userName, onNavigateRoutine }: DashboardScreenProps) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const toggleTask = (index: number) => {
    setTasks(prev => prev.map((t, i) => {
      if (i !== index) return t;
      const next: TaskStatus = t.status === "done" ? "skipped" : t.status === "skipped" ? "pending" : "done";
      return { ...t, status: next };
    }));
  };

  const doneCount = tasks.filter(t => t.status === "done").length;
  const skippedCount = tasks.filter(t => t.status === "skipped").length;
  const percent = Math.round((doneCount / tasks.length) * 100);

  return (
    <div className="px-6 pt-12 pb-24">
      <motion.div className="mb-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-muted-foreground text-sm font-body">¡Hola, {userName}! 👋</p>
        <h1 className="text-2xl font-display font-bold text-foreground">Tu día de hoy</h1>
      </motion.div>

      {/* Main action cards */}
      <motion.div className="grid grid-cols-2 gap-3 mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
        <motion.button
          onClick={onNavigateRoutine}
          className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors text-center"
          whileTap={{ scale: 0.96 }}
        >
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <Stethoscope size={24} className="text-primary" />
          </div>
          <div>
            <p className="font-display font-bold text-sm text-foreground leading-tight">Seguimiento a un diagnóstico</p>
            <p className="text-[10px] text-muted-foreground mt-1">Gestiona tu tratamiento</p>
          </div>
        </motion.button>
        <motion.button
          onClick={onNavigateRoutine}
          className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-accent/10 border border-accent/20 hover:bg-accent/20 transition-colors text-center"
          whileTap={{ scale: 0.96 }}
        >
          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
            <Plus size={24} className="text-accent" />
          </div>
          <div>
            <p className="font-display font-bold text-sm text-foreground leading-tight">Agregar rutina</p>
            <p className="text-[10px] text-muted-foreground mt-1">Sin diagnóstico</p>
          </div>
        </motion.button>
      </motion.div>

      {/* Progress cards */}
      <motion.div className="flex gap-3 mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex-1 rounded-2xl bg-pastel-purple/30 p-4 text-center">
          <TrendingUp size={18} className="text-primary mx-auto mb-1" />
          <p className="text-2xl font-display font-bold text-foreground">{percent}%</p>
          <p className="text-xs text-muted-foreground">Completado</p>
        </div>
        <div className="flex-1 rounded-2xl bg-pastel-pink/30 p-4 text-center">
          <XCircle size={18} className="text-secondary mx-auto mb-1" />
          <p className="text-2xl font-display font-bold text-foreground">{skippedCount}/{tasks.length}</p>
          <p className="text-xs text-muted-foreground">Omitido</p>
        </div>
      </motion.div>

      {/* Task list */}
      <div className="space-y-3 mb-6">
        {tasks.map((task, i) => (
          <motion.button
            key={i}
            onClick={() => toggleTask(i)}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card border border-border hover:shadow-soft transition-shadow text-left"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-xs text-muted-foreground font-body w-16 shrink-0">{task.time}</span>
            <div className="flex-1 min-w-0">
              <p className="font-display font-semibold text-sm text-foreground">{task.title}</p>
              <p className="text-xs text-muted-foreground">{task.subtitle}</p>
            </div>
            {statusIcon(task.status)}
          </motion.button>
        ))}
      </div>

      {/* Export */}
      <motion.button
        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors font-display text-sm font-medium"
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Download size={16} />
        EXPORTAR PDF
      </motion.button>
    </div>
  );
};

export default DashboardScreen;
