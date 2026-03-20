import type { Screen } from "@/pages/Index";
import { ArrowLeft } from "lucide-react";

/** Mismas pantallas que el ítem «Playlists» / «Rutina» de la barra inferior */
type DashboardNavTarget = Extract<Screen, "playlists" | "routine">;

interface DashboardScreenProps {
  userName: string;
  /** Usa el mismo `setScreen` que `BottomNav` para que el ítem activo coincida */
  onNavigate?: (screen: DashboardNavTarget) => void;
  onBack?: () => void;
}

const DashboardScreen = ({ userName, onNavigate, onBack }: DashboardScreenProps) => {
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
      {/* Header with Inicio tab */}
      <div className="mb-6">
        <div className="inline-flex bg-pastel-pink/60 px-4 py-2 rounded-full">
          <span className="text-sm font-display font-semibold text-pink-700">Inicio</span>
        </div>
      </div>
      
      {/* Welcome content */}
      <div className="text-center py-8">
        <h1 className="text-2xl font-display font-bold text-foreground mb-2">
          ¡Bienvenido, {userName}!
        </h1>
        <p className="text-muted-foreground mb-6">
          Tu espacio personal para organizar tu día
        </p>
        
        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          <button
            type="button"
            onClick={() => onNavigate?.("routine")}
            className="p-4 rounded-2xl bg-white/50 border border-pink-200 hover:bg-white/70 transition-colors"
          >
            <div className="text-2xl mb-2">📅</div>
            <span className="text-sm font-display font-medium text-foreground">Mi Rutina</span>
          </button>
          
          <button
            type="button"
            onClick={() => onNavigate?.("playlists")}
            className="p-4 rounded-2xl bg-white/50 border border-pink-200 hover:bg-white/70 transition-colors"
          >
            <div className="text-2xl mb-2">🎵</div>
            <span className="text-sm font-display font-medium text-foreground">Playlists</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
