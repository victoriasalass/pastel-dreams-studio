import { ArrowLeft } from "lucide-react";

const RachaInformacionScreen = ({ onBack }: { onBack?: () => void }) => {
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

      <div className="mt-16 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-display font-black text-black mb-1">informacion</h1>
          <p className="text-xs font-body text-muted-foreground">Tu progreso y datos</p>
        </div>
        <p className="text-xs font-body text-muted-foreground mt-1">motivaciones por dia :)</p>
      </div>

      <div className="rounded-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 border-2 border-pink-400 p-5 shadow-lg">
        <p className="text-sm font-body font-medium text-white text-center leading-relaxed">
          "No necesitas ser perfecto, solo necesitas empezar. Cada pequeño esfuerzo que haces hoy es un paso hacia la persona que quieres ser."
        </p>
      </div>

      <div className="mt-4 rounded-2xl bg-gradient-to-r from-pink-400 via-purple-400 to-pink-300 border-2 border-purple-300 p-5 shadow-lg">
        <p className="text-sm font-body font-medium text-white text-center leading-relaxed">
          "Los resultados no vienen de lo que haces una vez, sino de lo que haces constantemente."
        </p>
      </div>

      <div className="mt-4 rounded-2xl bg-gradient-to-r from-blue-300 via-pink-200 to-blue-200 border-2 border-blue-300 p-5 shadow-lg">
        <p className="text-sm font-body font-medium text-blue-900 text-center leading-relaxed">
          "Las grandes transformaciones nacen de rutinas simples repetidas con constancia."
        </p>
      </div>

      <div className="mt-6 rounded-2xl bg-white/60 border border-pink-200/50 p-4 shadow-soft">
        <p className="text-[11px] font-body text-muted-foreground mb-3">Mentalidad</p>
        <div className="space-y-2">
          <p className="text-xs font-body text-foreground">🧠 No te castigues por fallar un día</p>
          <p className="text-xs font-body text-foreground">🧠 Evita el "todo o nada"</p>
          <p className="text-xs font-body text-foreground">🧠 Celebra avances pequeños</p>
        </div>
      </div>
    </div>
  );
};

export default RachaInformacionScreen;
