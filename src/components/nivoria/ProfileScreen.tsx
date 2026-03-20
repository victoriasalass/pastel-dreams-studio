interface ProfileScreenProps {
  userName: string;
  onLogout: () => void;
  /** Abre la pantalla Playlists (misma que el ítem de la barra inferior) */
  onNavigatePlaylists?: () => void;
}

const ProfileScreen = ({ userName }: ProfileScreenProps) => {
  return (
    <div className="px-6 pt-12 pb-24 bg-pastel-pink/30 min-h-full">
      <div className="flex flex-col items-center">
        <h1
          className="text-5xl font-display font-black text-black drop-shadow-[0_3px_0_rgba(0,0,0,0.35)] mb-6 tracking-tight"
        >
          perfil
        </h1>

        <div className="w-28 h-28 rounded-full bg-pastel-purple/25 border border-pastel-purple/40 flex items-center justify-center mb-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-70 bg-gradient-to-br from-pink-500/30 via-pastel-purple/30 to-pastel-blue/25" />
          <div className="relative w-16 h-16 rounded-full bg-background/30 flex items-center justify-center border border-border/40">
            {/* Simulación de foto (icono genérico) */}
            <svg
              width="34"
              height="34"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
                stroke="black"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path
                d="M6 20C6 17.7909 8.68629 16 12 16C15.3137 16 18 17.7909 18 20"
                stroke="black"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <p className="text-sm font-body font-semibold text-foreground text-center break-words">
          @cutz333
        </p>
      </div>
    </div>
  );
};

export default ProfileScreen;
