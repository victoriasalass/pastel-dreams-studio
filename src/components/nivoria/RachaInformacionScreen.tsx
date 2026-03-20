import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Flame, CalendarDays, Music } from "lucide-react";

type SavedRoutine = {
  id: string;
  number: number;
  slots?: Array<{ activity?: string }>;
  reminders?: Array<{ active?: boolean }>;
};

const ROUTINES_KEY = "nivoria.routines";
const ROUTINE_PLAYLISTS_KEY = "nivoria.routines.playlistsByNumber";

const RachaInformacionScreen = ({ onBack }: { onBack?: () => void }) => {
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

  return (
    <div className="relative px-6 pt-12 pb-24 bg-pastel-pink/30 min-h-full">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="absolute left-4 top-4 w-10 h-10 rounded-2xl bg-white/40 border border-pink-200/60 flex items-center justify-center"
        >
          <ArrowLeft size={20} className="text-black" />
        </button>
      )}

      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-pastel-purple/25 border border-pastel-purple/40 flex items-center justify-center shadow-soft">
          <Flame size={20} className="text-foreground" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-display font-black text-black drop-shadow-[0_2px_0_rgba(0,0,0,0.15)]">
            informacion
          </h1>
          <p className="text-xs text-muted-foreground font-body">
            Datos de cumplimiento y seguimiento de tus rutinas
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="rounded-2xl bg-pink-500/12 border border-pink-500/40 p-4">
          <p className="text-xs font-body text-muted-foreground mb-2">Cumplimiento</p>
          <p className="text-2xl font-display font-black text-foreground">{stats.completionPct.toFixed(0)}%</p>
          <p className="text-[11px] text-muted-foreground font-body mt-2">
            {stats.completedSlots}/{stats.totalSlots} actividades
          </p>
        </div>
        <div className="rounded-2xl bg-pink-500/10 border border-pink-500/35 p-4">
          <p className="text-xs font-body text-muted-foreground mb-2">Buen seguimiento</p>
          <p className="text-2xl font-display font-black text-foreground">{stats.followPct.toFixed(0)}%</p>
          <p className="text-[11px] text-muted-foreground font-body mt-2">
            {stats.totalReminders} recordatorios
          </p>
        </div>
      </div>

      <motion.div
        className="rounded-2xl bg-card border border-border p-4 mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pastel-lavender/25 border border-pastel-lavender/40 flex items-center justify-center">
            <Music size={18} className="text-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-body text-muted-foreground">Playlists sincronizadas</p>
            <p className="text-xl font-display font-bold text-foreground">{stats.syncedPlaylistsCount}</p>
          </div>
        </div>
      </motion.div>

      <div className="space-y-3">
        {stats.routineCount === 0 ? (
          <div className="rounded-2xl bg-pink-500/10 border border-pink-500/30 p-4 text-center">
            <p className="text-sm font-display font-bold text-foreground mb-1">Aún no hay rutinas</p>
            <p className="text-xs text-muted-foreground font-body">
              Ve a “Rutina” y confirma para empezar.
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
                <div key={r.id} className="rounded-2xl bg-card border border-border p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-pink-500/12 border border-pink-500/30 flex items-center justify-center">
                      <CalendarDays size={18} className="text-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-display font-bold text-foreground">rutina {r.number}</p>
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

export default RachaInformacionScreen;

