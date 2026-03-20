import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Music, Plus } from "lucide-react";

declare global {
  interface Window {
    google?: {
      accounts?: {
        oauth2?: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (resp: { access_token?: string; error?: string }) => void;
            prompt?: string;
          }) => { requestAccessToken: (opts?: { prompt?: string }) => void };
        };
      };
    };
  }
}

type YouTubePlaylist = {
  id: string;
  title: string;
  thumbnailUrl?: string;
  itemCount?: number;
};

const YTM_SELECTED_PLAYLIST_KEY = "nivoria.ytm.selectedPlaylist";

const PlaylistsScreen = () => {
  const [showSpotifyConnect, setShowSpotifyConnect] = useState(false);
  const [showYouTubeConnect, setShowYouTubeConnect] = useState(false);
  const [ytAccessToken, setYtAccessToken] = useState<string | null>(null);
  const [ytmPlaylists, setYtmPlaylists] = useState<YouTubePlaylist[]>([]);
  const [ytmLoading, setYtmLoading] = useState(false);
  const [ytmError, setYtmError] = useState<string | null>(null);
  const [selectedYtmPlaylist, setSelectedYtmPlaylist] = useState<YouTubePlaylist | null>(null);

  const googleClientId = useMemo(() => import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined, []);

  useEffect(() => {
    const raw = localStorage.getItem(YTM_SELECTED_PLAYLIST_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as YouTubePlaylist;
      if (parsed?.id && parsed?.title) setSelectedYtmPlaylist(parsed);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!selectedYtmPlaylist) return;
    localStorage.setItem(YTM_SELECTED_PLAYLIST_KEY, JSON.stringify(selectedYtmPlaylist));
  }, [selectedYtmPlaylist]);

  useEffect(() => {
    if (!showYouTubeConnect) return;
    if (document.getElementById("google-identity-services")) return;
    const script = document.createElement("script");
    script.id = "google-identity-services";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, [showYouTubeConnect]);

  const connectYouTubeMusic = () => {
    if (!googleClientId) {
      setYtmError("Falta configurar VITE_GOOGLE_CLIENT_ID para conectar YouTube Music.");
      return;
    }
    if (!window.google?.accounts?.oauth2?.initTokenClient) {
      setYtmError("No se pudo cargar Google Identity Services. Intenta de nuevo en unos segundos.");
      return;
    }
    setYtmError(null);
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: googleClientId,
      scope: "https://www.googleapis.com/auth/youtube.readonly",
      callback: (resp) => {
        if (resp.error || !resp.access_token) {
          setYtmError("No se pudo obtener permiso de YouTube. Revisa que aceptaste los permisos.");
          return;
        }
        setYtAccessToken(resp.access_token);
      },
    });
    tokenClient.requestAccessToken({ prompt: "consent" });
  };

  const loadYouTubePlaylists = async (token: string) => {
    setYtmLoading(true);
    setYtmError(null);
    try {
      // Fetch up to ~50 playlists. If you have more, we can paginate later.
      const res = await fetch(
        "https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&mine=true&maxResults=50",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) {
        throw new Error(`YouTube API error (${res.status})`);
      }
      const data = (await res.json()) as {
        items?: Array<{
          id: string;
          snippet?: { title?: string; thumbnails?: { medium?: { url?: string }; default?: { url?: string } } };
          contentDetails?: { itemCount?: number };
        }>;
      };
      const mapped: YouTubePlaylist[] = (data.items ?? [])
        .map((p) => ({
          id: p.id,
          title: p.snippet?.title ?? "Playlist sin título",
          thumbnailUrl: p.snippet?.thumbnails?.medium?.url ?? p.snippet?.thumbnails?.default?.url,
          itemCount: p.contentDetails?.itemCount,
        }))
        .filter((p) => !!p.id);
      setYtmPlaylists(mapped);
      if (mapped.length === 0) setYtmError("No se encontraron playlists en tu cuenta de YouTube.");
    } catch {
      setYtmError("No se pudieron cargar tus playlists. Intenta de nuevo.");
    } finally {
      setYtmLoading(false);
    }
  };

  useEffect(() => {
    if (!ytAccessToken) return;
    void loadYouTubePlaylists(ytAccessToken);
  }, [ytAccessToken]);

  if (!showSpotifyConnect && !showYouTubeConnect) {
    return (
      <div className="px-6 pt-12 pb-24 bg-pastel-pink/30 min-h-full">
        {/* Header */}
        <motion.div 
          className="mb-8" 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-display font-bold text-foreground">PLAYLISTS</h1>
          <p className="text-sm text-muted-foreground">Conecta tu música favorita</p>
        </motion.div>

        {/* Vincular Music Tabs */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <button
              type="button"
              onClick={() => setShowSpotifyConnect(true)}
              className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-display font-bold text-sm shadow-soft transition-colors"
            >
              <Music size={20} />
              VINCULAR SPOTIFY
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <button
              type="button"
              onClick={() => setShowYouTubeConnect(true)}
              className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-display font-bold text-sm shadow-soft transition-colors"
            >
              <Music size={20} />
              VINCULAR YOUTUBE MUSIC
            </button>
          </motion.div>
        </div>

        {/* Info message */}
        <motion.div
          className="mt-8 p-4 rounded-2xl bg-pastel-lavender/20 border border-primary/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-xs text-muted-foreground text-center font-body">
            Conecta Spotify o YouTube Music para sincronizar tus playlists y descubrir nueva música.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="px-6 pt-12 pb-24 bg-pastel-pink/30 min-h-full">
      {/* Header */}
      <motion.div 
        className="mb-8" 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-display font-bold text-foreground">PLAYLISTS</h1>
        <p className="text-sm text-muted-foreground">Gestiona tu música</p>
      </motion.div>

      {/* Connected Status */}
      <div className="space-y-3 mb-6">
        {showSpotifyConnect && (
          <motion.div
            className="flex items-center gap-3 p-4 rounded-2xl bg-green-50 border border-green-200"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
              <Music size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-display font-semibold text-sm text-green-800">Spotify Conectado</p>
              <p className="text-xs text-green-600">Cuenta sincronizada correctamente</p>
            </div>
          </motion.div>
        )}

        {showYouTubeConnect && (
          <motion.div
            className="p-4 rounded-2xl bg-red-50 border border-red-200"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center">
                <Music size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="font-display font-semibold text-sm text-red-800">YouTube Music</p>
                <p className="text-xs text-red-600">Conecta tu cuenta para ver tus playlists</p>
              </div>
            </div>

            {!ytAccessToken ? (
              <button
                type="button"
                onClick={connectYouTubeMusic}
                className="w-full rounded-xl bg-red-500 hover:bg-red-600 text-white px-4 py-3 text-xs font-display font-bold shadow-soft transition-colors"
              >
                CONECTAR CON GOOGLE
              </button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-display font-bold text-red-800">Tus playlists</p>
                  <button
                    type="button"
                    onClick={() => ytAccessToken && loadYouTubePlaylists(ytAccessToken)}
                    className="text-[11px] font-body text-red-700 hover:underline"
                  >
                    Actualizar
                  </button>
                </div>

                {ytmLoading && (
                  <p className="text-xs text-muted-foreground font-body">Cargando playlists…</p>
                )}

                {ytmError && (
                  <p className="text-xs text-red-700 font-body">{ytmError}</p>
                )}

                {!ytmLoading && !ytmError && ytmPlaylists.length > 0 && (
                  <div className="space-y-2">
                    {ytmPlaylists.map((p) => {
                      const active = selectedYtmPlaylist?.id === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setSelectedYtmPlaylist(p)}
                          className={`w-full flex items-center gap-3 p-3 rounded-2xl border text-left transition-colors ${
                            active ? "border-red-400 bg-white/70" : "border-red-200 bg-white/50 hover:bg-white/70"
                          }`}
                        >
                          <div className="w-10 h-10 rounded-xl bg-red-500/10 overflow-hidden flex items-center justify-center shrink-0">
                            {p.thumbnailUrl ? (
                              <img src={p.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Music size={18} className="text-red-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-display font-semibold text-foreground truncate">{p.title}</p>
                            <p className="text-[11px] text-muted-foreground font-body">
                              {typeof p.itemCount === "number" ? `${p.itemCount} canciones` : "Playlist"}
                              {active ? " · Seleccionada" : ""}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Agregar Playlist Tab */}
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <button
          type="button"
          onClick={() => setShowYouTubeConnect(true)}
          className="flex items-center gap-3 px-8 py-4 rounded-2xl gradient-button text-primary-foreground font-display font-bold text-sm shadow-soft"
        >
          <Plus size={20} />
          AGREGAR PLAYLIST
        </button>
      </motion.div>

      {selectedYtmPlaylist && (
        <motion.div
          className="mt-6 p-4 rounded-2xl bg-card border border-border"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs text-muted-foreground font-body mb-2">Playlist seleccionada (YouTube Music)</p>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 overflow-hidden flex items-center justify-center shrink-0">
              {selectedYtmPlaylist.thumbnailUrl ? (
                <img src={selectedYtmPlaylist.thumbnailUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <Music size={18} className="text-red-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-display font-semibold text-foreground truncate">{selectedYtmPlaylist.title}</p>
              <p className="text-[11px] text-muted-foreground font-body">
                {typeof selectedYtmPlaylist.itemCount === "number" ? `${selectedYtmPlaylist.itemCount} canciones` : "Playlist"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedYtmPlaylist(null)}
              className="text-[11px] font-body text-muted-foreground hover:underline"
            >
              Quitar
            </button>
          </div>
        </motion.div>
      )}

      {/* Empty state message */}
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="w-16 h-16 rounded-full bg-pastel-purple/50 flex items-center justify-center mx-auto mb-4">
          <Music size={24} className="text-primary" />
        </div>
        <p className="text-sm text-muted-foreground font-body">
          Aún no tienes playlists.<br />
          ¡Crea tu primera playlist para comenzar!
        </p>
      </motion.div>
    </div>
  );
};

export default PlaylistsScreen;