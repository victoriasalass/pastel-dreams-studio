interface ProfileScreenProps {
  userName: string;
  onLogout: () => void;
  /** Abre la pantalla Playlists (misma que el ítem de la barra inferior) */
  onNavigatePlaylists?: () => void;
  /** Abre la pantalla de racha (cumplimiento) */
  onNavigateRacha?: () => void;
  onBack?: () => void;
  /** Abre una pantalla distinta con información de la racha */
  onNavigateInformacion?: () => void;
}

const ProfileScreen = ({ userName, onNavigateRacha, onNavigateInformacion, onBack }: ProfileScreenProps) => {
  return (
    <div className="relative px-6 pt-12 pb-24 bg-pastel-pink/30 min-h-full">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="absolute left-4 top-4 w-10 h-10 rounded-2xl bg-white/40 border border-pink-200/60 flex items-center justify-center"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="black"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
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

          {/* Flama (racha) */}
          <div className="absolute -top-3 -right-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 via-pastel-purple to-pink-500 border border-border/40 flex items-center justify-center shadow-glow">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M12 2C12 8 6.5 9 6.5 14.5C6.5 18.09 9.4 21 13 21C16.6 21 19.5 18.09 19.5 14.5C19.5 9 12 8 12 2Z"
                  stroke="black"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.2 14.2C10.2 16.0 11.6 17.4 13.4 17.4C15.2 17.4 16.6 16.0 16.6 14.2C16.6 12.3 14.9 11.7 14.9 10.1C14.9 11.8 10.2 12.0 10.2 14.2Z"
                  fill="rgba(0,0,0,0.12)"
                />
              </svg>
            </div>
          </div>
        </div>

        <p className="text-sm font-body font-semibold text-foreground text-center break-words">
          @cutz333
        </p>

        <button
          type="button"
          onClick={onNavigateRacha}
          disabled={!onNavigateRacha}
          className="mt-3 w-full rounded-2xl bg-pastel-purple/20 border border-pastel-purple/40 px-4 py-3 text-sm font-display font-bold text-foreground shadow-soft transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="flex items-center justify-center gap-2">
            <span aria-hidden="true">🔥</span>
            racha
          </span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateInformacion?.()}
          disabled={!onNavigateInformacion}
          className="mt-2 w-full rounded-2xl bg-pastel-purple/12 border border-pastel-purple/25 px-4 py-3 text-sm font-display font-bold text-foreground shadow-soft transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          informacion
        </button>
      </div>
    </div>
  );
};

export default ProfileScreen;
