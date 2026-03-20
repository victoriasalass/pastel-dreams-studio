import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Flame, CalendarDays, Music, Trophy, Sparkles, Zap } from "lucide-react";

type SavedRoutine = {
  id: string;
  number: number;
  slots?: Array<{ activity?: string }>;
  reminders?: Array<{ active?: boolean }>;
};

const ROUTINES_KEY = "nivoria.routines";
const ROUTINE_PLAYLISTS_KEY = "nivoria.routines.playlistsByNumber";
const RachaScreen = ({ onBack }: { onBack?: () => void }) => {
  const [routines, setRoutines] = useState<SavedRoutine[]>([]);
  const [playlistsByNumber, setPlaylistsByNumber] = useState<Record<string, string[]>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(ROUTINES_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as SavedRoutine[];
      if (Array.isArray(parsed)) {
        setRoutines(
          parsed
            .filter((r) => r && typeof r?.number === "number")
            .map((r) => ({
              ...r,
              slots: Array.isArray(r.slots) ? r.slots : [],
              reminders: Array.isArray(r.reminders) ? r.reminders : [],
            }))
        );
      }
    } catch {
      // ignore
    }

    try {
      const rawMap = localStorage.getItem(ROUTINE_PLAYLISTS_KEY);
      if (!rawMap) return;
      const parsedMap = JSON.parse(rawMap) as Record<string, string[]>;
      if (parsedMap && typeof parsedMap === "object") setPlaylistsByNumber(parsedMap);
    } catch {
      // ignore
    }

  }, []);

  const stats = useMemo(() => {
    const routineCount = routines.length;
    const totalSlots = routines.reduce((sum, r) => sum + (r.slots?.length ?? 0), 0);
    const completedSlots = routines.reduce(
      (sum, r) => sum + (r.slots ?? []).filter((s) => (s.activity ?? "").trim().length > 0).length,
      0
    );

    const completionPct = totalSlots > 0 ? (completedSlots / totalSlots) * 100 : 0;

    const routinesWithReminders = routines.filter((r) => (r.reminders ?? []).length > 0).length;
    const followPct = routineCount > 0 ? (routinesWithReminders / routineCount) * 100 : 0;

    const totalReminders = routines.reduce((sum, r) => sum + (r.reminders ?? []).length, 0);
    const syncedPlaylistsCount = routines.reduce(
      (sum, r) => sum + (playlistsByNumber[String(r.number)] ?? []).length,
      0
    );

    return {
      routineCount,
      totalSlots,
      completedSlots,
      completionPct,
      followPct,
      totalReminders,
      syncedPlaylistsCount,
    };
  }, [routines, playlistsByNumber]);

  const motivation = useMemo(() => {
    const completion = stats.completionPct;
    const follow = stats.followPct;

    if (stats.routineCount === 0) {
      return {
        headline: "Enciende tu racha",
        body: "Crea una rutina y confirma para empezar a ver tu progreso aquí.",
      };
    }

    if (completion >= 80 && follow >= 50) {
      return {
        headline: "Racha legendaria",
        body: "Tu constancia está haciendo magia. Sigue así.",
      };
    }

    if (completion >= 60) {
      return {
        headline: "Buen ritmo de fuego",
        body: "Ya estás construyendo hábito. Un empujón más y subes de nivel.",
      };
    }

    return {
      headline: "Dale chispa",
      body: "Una rutina al día es suficiente para encender la mejora.",
    };
  }, [stats]);

  const achievements = useMemo(() => {
    const completion = stats.completionPct;
    const follow = stats.followPct;
    const synced = stats.syncedPlaylistsCount;

    return [
      {
        key: "a1",
        Icon: Trophy,
        title: completion >= 80 ? "Maestro del Hábito" : completion >= 50 ? "Ruta en llamas" : "Primeros pasos",
        subtitle:
          completion >= 80
            ? "Tu cumplimiento ya brilla por encima del 80%"
            : completion >= 50
              ? "Superaste la mitad del camino"
              : "Empieza con constancia, no con perfección",
      },
      {
        key: "a2",
        Icon: Zap,
        title: follow >= 50 ? "Disciplina real" : "Buen seguimiento",
        subtitle:
          follow >= 50
            ? "Tienes recordatorios activos con buena frecuencia"
            : "Agrega un recordatorio y sube el seguimiento",
      },
      {
        key: "a3",
        Icon: Sparkles,
        title: synced > 0 ? "Música alineada" : "Sincronía pendiente",
        subtitle: synced > 0 ? `Sincronizaste ${synced} playlist(s)` : "Vincula playlists a tus rutinas para desbloquear",
      },
    ];
  }, [stats]);

  return (
    <div className="px-6 pt-12 pb-24 bg-pastel-pink/30 min-h-full relative overflow-hidden">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="absolute left-4 top-4 w-10 h-10 rounded-2xl bg-white/40 border border-pink-200/60 flex items-center justify-center z-10"
        >
          <ArrowLeft size={20} className="text-black" />
        </button>
      )}
      {/* Visual flare decorations */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[460px] h-[460px] rounded-full bg-gradient-to-br from-pink-500/15 via-pastel-purple/25 to-pink-500/10 blur-2xl" />
      <div className="pointer-events-none absolute top-10 left-6 w-16 h-16 rounded-2xl bg-pastel-purple/25 blur-xl" />
      <div className="pointer-events-none absolute top-20 right-8 w-10 h-10 rounded-2xl bg-pink-400/20 blur-xl" />

      <motion.div
        className="flex items-center gap-3 mb-6 relative z-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          className="w-12 h-12 rounded-2xl bg-pink-500/15 border border-pink-500/40 flex items-center justify-center shadow-soft"
          animate={{ rotate: [0, -7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, repeatType: "loop" }}
        >
          <Flame size={20} className="text-foreground" />
        </motion.div>

        <div className="flex-1">
          <h1 className="text-3xl font-display font-black text-black drop-shadow-[0_2px_0_rgba(0,0,0,0.15)]">
            racha
          </h1>
          <p className="text-xs text-muted-foreground font-body">
            Cumplimiento y seguimiento basados en tus rutinas guardadas
          </p>
        </div>
      </motion.div>

      <motion.div
        className="relative z-10 rounded-2xl bg-pink-500/8 border border-pink-500/35 p-4 mb-6 overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-pastel-purple/20 via-pink-500/10 to-transparent" />
        <div className="relative">
          <p className="text-[11px] font-body text-muted-foreground mb-1">Mensaje motivacional</p>
          <p className="text-lg font-display font-black text-foreground mb-1">{motivation.headline}</p>
          <p className="text-xs text-muted-foreground font-body">{motivation.body}</p>

          <div className="mt-3 flex items-center gap-3">
            {achievements.slice(0, 2).map(({ key, title, Icon, subtitle }) => (
              <div
                key={key}
                className="flex-1 rounded-xl bg-pink-500/8 border border-pink-500/30 p-3"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-lg bg-pink-500/15 border border-pink-500/35 flex items-center justify-center">
                    <Icon size={16} className="text-foreground" />
                  </div>
                  <p className="text-[11px] font-display font-bold text-foreground truncate">{title}</p>
                </div>
                <p className="text-[10px] text-muted-foreground font-body leading-tight">{subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
        <div className="rounded-2xl bg-pink-500/12 border border-pink-500/40 p-4">
          <p className="text-xs font-body text-muted-foreground mb-2">Cumplimiento</p>
          <p className="text-2xl font-display font-black text-foreground">
            {stats.completionPct.toFixed(0)}%
          </p>
          <div className="mt-3 w-full h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full bg-pastel-purple"
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(2, Math.min(100, stats.completionPct))}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
          <p className="text-[11px] text-muted-foreground font-body mt-2">
            {stats.completedSlots}/{stats.totalSlots} actividades
          </p>
        </div>

        <div className="rounded-2xl bg-pink-500/15 border border-pink-500/45 p-4">
          <p className="text-xs font-body text-muted-foreground mb-2">Buen seguimiento</p>
          <p className="text-2xl font-display font-black text-foreground">
            {stats.followPct.toFixed(0)}%
          </p>
          <div className="mt-3 w-full h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full bg-pink-500/70"
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(2, Math.min(100, stats.followPct))}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
          <p className="text-[11px] text-muted-foreground font-body mt-2">
            {stats.totalReminders} recordatorios
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-pink-500/8 border border-pink-500/30 p-4 mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-500/12 border border-pink-500/35 flex items-center justify-center">
            <Music size={18} className="text-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-body text-muted-foreground">Playlists sincronizadas</p>
            <p className="text-xl font-display font-bold text-foreground">{stats.syncedPlaylistsCount}</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 mb-6">
        <p className="text-[11px] font-body text-muted-foreground mb-3">Logros</p>
        <div className="grid grid-cols-3 gap-2.5">
          {achievements.map(({ key, title, subtitle, Icon }) => (
            <motion.div
              key={key}
              className="rounded-2xl bg-pink-500/8 border border-pink-500/30 p-3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-9 h-9 rounded-xl bg-pink-500/15 border border-pink-500/35 flex items-center justify-center">
                  <Icon size={18} className="text-foreground" />
                </div>
                <p className="text-[11px] font-display font-bold text-foreground leading-tight truncate">{title}</p>
              </div>
              <p className="text-[10px] text-muted-foreground font-body leading-tight">{subtitle}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {stats.routineCount === 0 ? (
          <div className="rounded-2xl bg-pink-500/10 border border-pink-500/30 p-4 text-center">
            <p className="text-sm font-display font-bold text-foreground mb-1">Aún no hay rutinas</p>
            <p className="text-xs text-muted-foreground font-body">
              Crea una rutina en “Rutina” y confirma para que aparezca aquí tu racha.
            </p>
          </div>
        ) : (
          routines
            .slice()
            .sort((a, b) => a.number - b.number)
            .map((r) => {
              const slotCount = (r.slots ?? []).length;
              const doneCount = (r.slots ?? []).filter((s) => (s.activity ?? "").trim().length > 0).length;
              const routineCompletion = slotCount > 0 ? (doneCount / slotCount) * 100 : 0;
              const syncedCount = (playlistsByNumber[String(r.number)] ?? []).length;

              return (
                <div key={r.id} className="rounded-2xl bg-pink-500/5 border border-pink-500/25 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-pink-500/12 border border-pink-500/30 flex items-center justify-center">
                      <CalendarDays size={18} className="text-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-display font-bold text-foreground">
                        rutina {r.number}
                      </p>
                      <p className="text-[11px] text-muted-foreground font-body">
                        {routineCompletion.toFixed(0)}% · {syncedCount} playlist(s) sincronizadas
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
        )}
      </div>

    </div>
  );
};

export default RachaScreen;

