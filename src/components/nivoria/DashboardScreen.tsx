interface DashboardScreenProps {
  userName: string;
  onNavigateRoutine?: () => void;
}

const DashboardScreen = ({ userName, onNavigateRoutine }: DashboardScreenProps) => {
  return (
    <div className="px-6 pt-12 pb-24 bg-pastel-pink/30 min-h-full">
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
            onClick={onNavigateRoutine}
            className="p-4 rounded-2xl bg-white/50 border border-pink-200 hover:bg-white/70 transition-colors"
          >
            <div className="text-2xl mb-2">📅</div>
            <span className="text-sm font-display font-medium text-foreground">Mi Rutina</span>
          </button>
          
          <button className="p-4 rounded-2xl bg-white/50 border border-pink-200 hover:bg-white/70 transition-colors">
            <div className="text-2xl mb-2">🎵</div>
            <span className="text-sm font-display font-medium text-foreground">Playlists</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
