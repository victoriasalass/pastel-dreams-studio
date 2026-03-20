import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Music, Plus } from "lucide-react";

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
const YTM_SAVED_PLAYLIST_COUNT_KEY = "nivoria.ytm.savedPlaylistCount";
const ROUTINES_KEY = "nivoria.routines";
const ROUTINE_PLAYLISTS_KEY = "nivoria.routines.playlistsByNumber";
const ROUTINE_SELECTED_NUMBER_KEY = "nivoria.routines.selectedNumber";
const YTM_CREATED_PLAYLISTS_KEY = "nivoria.ytm.createdPlaylists";

type Song = {
  id: string;
  title: string;
  artist: string;
};

const PlaylistsScreen = ({ onBack }: { onBack?: () => void }) => {
  const [showSpotifyConnect, setShowSpotifyConnect] = useState(false);
  const [showYouTubeConnect, setShowYouTubeConnect] = useState(false);
  const [ytAccessToken, setYtAccessToken] = useState<string | null>(null);
  const [ytmPlaylists, setYtmPlaylists] = useState<YouTubePlaylist[]>([]);
  const [ytmLoading, setYtmLoading] = useState(false);
  const [ytmError, setYtmError] = useState<string | null>(null);
  const [selectedYtmPlaylist, setSelectedYtmPlaylist] = useState<YouTubePlaylist | null>(null);

  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [selectedSongIds, setSelectedSongIds] = useState<Record<string, boolean>>({});
  const [createdPlaylists, setCreatedPlaylists] = useState<Array<{ title: string; songs: Song[] }>>([]);
  const [savedPlaylistCount, setSavedPlaylistCount] = useState(0);
  const [routineNumbers, setRoutineNumbers] = useState<number[]>([]);
  const [selectedRoutineNumber, setSelectedRoutineNumber] = useState<number | null>(null);
  const [routinePlaylistAddMessage, setRoutinePlaylistAddMessage] = useState<string | null>(null);
  const [syncedPlaylistTitles, setSyncedPlaylistTitles] = useState<string[]>([]);

  const googleClientId = useMemo(() => import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined, []);
  const sampleSongs = useMemo<Song[]>(
    () => [
      { id: "s1", title: "Dreamscape", artist: "Pastel Waves" },
      { id: "s2", title: "Midnight Bloom", artist: "Luna Garden" },
      { id: "s3", title: "Soft Echoes", artist: "Velvet Frequency" },
      { id: "s4", title: "Pink Skyline", artist: "Nivoria Studio" },
      { id: "s5", title: "Aurora Steps", artist: "Cloud Runner" },
      { id: "s6", title: "Café Nebula", artist: "Star Latte" },
      { id: "s7", title: "Sunset Notes", artist: "Golden Delay" },
      { id: "s8", title: "Cotton Clouds", artist: "Daydream District" },
      { id: "s9", title: "Breeze Parade", artist: "Tangerine Transit" },
    ],
    []
  );

  const selectedSongs = useMemo(() => sampleSongs.filter((s) => selectedSongIds[s.id]), [sampleSongs, selectedSongIds]);
  const canSavePlaylist = selectedSongs.length > 0;

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
    const raw = localStorage.getItem(YTM_SAVED_PLAYLIST_COUNT_KEY);
    const n = raw ? Number(raw) : 0;
    if (Number.isFinite(n) && n > 0) setSavedPlaylistCount(n);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(ROUTINES_KEY);
      if (!raw) {
        setRoutineNumbers([]);
        setSelectedRoutineNumber(null);
        return;
      }

      const parsed = JSON.parse(raw) as Array<{ number?: unknown }>;
      const nums = Array.isArray(parsed)
        ? parsed
            .map((r) => (typeof r?.number === "number" ? r.number : null))
            .filter((n): n is number => n !== null)
        : [];

      const uniqueSorted = Array.from(new Set(nums)).sort((a, b) => a - b);
      setRoutineNumbers(uniqueSorted);

      const rawSelected = localStorage.getItem(ROUTINE_SELECTED_NUMBER_KEY);
      const selected = rawSelected ? Number(rawSelected) : NaN;
      const validSelected =
        Number.isFinite(selected) && uniqueSorted.includes(selected) ? selected : null;

      setSelectedRoutineNumber(validSelected ?? (uniqueSorted.length > 0 ? uniqueSorted[0] : null));
    } catch {
      setRoutineNumbers([]);
      setSelectedRoutineNumber(null);
    }
  }, []);

  useEffect(() => {
    if (selectedRoutineNumber == null) {
      localStorage.removeItem(ROUTINE_SELECTED_NUMBER_KEY);
      return;
    }
    localStorage.setItem(ROUTINE_SELECTED_NUMBER_KEY, String(selectedRoutineNumber));
  }, [selectedRoutineNumber]);

  useEffect(() => {
    setRoutinePlaylistAddMessage(null);
  }, [selectedRoutineNumber]);

  useEffect(() => {
    if (selectedRoutineNumber == null) {
      setSyncedPlaylistTitles([]);
      return;
    }
    try {
      const raw = localStorage.getItem(ROUTINE_PLAYLISTS_KEY);
      const map = raw ? (JSON.parse(raw) as Record<string, string[]>) : {};
      const list = Array.isArray(map[String(selectedRoutineNumber)]) ? map[String(selectedRoutineNumber)] : [];
      setSyncedPlaylistTitles(list);
    } catch {
      setSyncedPlaylistTitles([]);
    }
  }, [selectedRoutineNumber]);

  useEffect(() => {
    const raw = localStorage.getItem(YTM_CREATED_PLAYLISTS_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as Array<{ title: string; songs: Song[] }>;
      if (Array.isArray(parsed)) {
        setCreatedPlaylists(
          parsed.filter((p) => typeof p?.title === "string" && Array.isArray(p?.songs))
        );
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(YTM_CREATED_PLAYLISTS_KEY, JSON.stringify(createdPlaylists));
  }, [createdPlaylists]);

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
          onClick={() => setShowCreatePlaylist(true)}
          className="flex items-center gap-3 px-8 py-4 rounded-2xl gradient-button text-primary-foreground font-display font-bold text-sm shadow-soft"
        >
          <Plus size={20} />
          AGREGAR PLAYLIST
        </button>
      </motion.div>

      {showCreatePlaylist && (
        <motion.div
          className="mt-6 p-4 rounded-2xl bg-card border border-border"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm font-display font-semibold text-foreground mb-3">Crear playlist</p>

          <input
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            placeholder="Nombre de la playlist"
            className="w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm font-body outline-none focus:ring-2 focus:ring-primary/40 mb-4"
          />

          <div className="max-h-44 overflow-y-auto space-y-2 pr-1">
            {sampleSongs.map((song) => {
              const active = !!selectedSongIds[song.id];
              return (
                <button
                  key={song.id}
                  type="button"
                  onClick={() =>
                    setSelectedSongIds((prev) => ({
                      ...prev,
                      [song.id]: !prev[song.id],
                    }))
                  }
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl border text-left transition-colors ${
                    active ? "border-primary/50 bg-pastel-pink/25" : "border-border bg-background/40 hover:bg-background/60"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {active ? "✓" : "+"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-display font-semibold text-foreground truncate">{song.title}</p>
                    <p className="text-[11px] text-muted-foreground font-body truncate">{song.artist}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={() => {
                setShowCreatePlaylist(false);
                setNewPlaylistName("");
                setSelectedSongIds({});
              }}
              className="flex-1 rounded-xl border border-border bg-muted/40 px-4 py-3 text-xs font-display font-bold text-foreground hover:bg-muted/60 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={!canSavePlaylist}
              onClick={() => {
                const nextCount = savedPlaylistCount + 1;
                const title = newPlaylistName.trim() || `playlist ${nextCount}`;
                setSavedPlaylistCount(nextCount);
                localStorage.setItem(YTM_SAVED_PLAYLIST_COUNT_KEY, String(nextCount));
                setCreatedPlaylists((prev) => [...prev, { title, songs: selectedSongs }]);
                setShowCreatePlaylist(false);
                setNewPlaylistName("");
                setSelectedSongIds({});
              }}
              className="flex-1 rounded-xl bg-primary/90 px-4 py-3 text-xs font-display font-bold text-primary-foreground hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Guardar
            </button>
          </div>
        </motion.div>
      )}

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

          <div className="mt-4 p-4 rounded-2xl bg-pastel-lavender/20 border border-primary/20">
            <p className="text-xs font-display font-semibold text-foreground mb-2">
              Rutina para sincronizar
            </p>
            {routineNumbers.length === 0 ? (
              <p className="text-xs text-muted-foreground font-body">
                Crea una rutina para poder sincronizar playlists.
              </p>
            ) : (
              <select
                value={selectedRoutineNumber ?? ""}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setSelectedRoutineNumber(Number.isFinite(v) ? v : null);
                }}
                className="w-full rounded-xl bg-background/60 px-4 py-3 text-sm font-body outline-none border border-border focus:ring-2 focus:ring-primary/40"
              >
                {routineNumbers.map((n) => (
                  <option key={n} value={n}>
                    rutina {n}
                  </option>
                ))}
              </select>
            )}
          </div>

          <button
            type="button"
            disabled={selectedRoutineNumber == null}
            onClick={() => {
              if (selectedRoutineNumber == null) return;
              const playlistTitle = selectedYtmPlaylist.title;

              const raw = localStorage.getItem(ROUTINE_PLAYLISTS_KEY);
              let map: Record<string, string[]> = {};
              try {
                map = raw ? (JSON.parse(raw) as Record<string, string[]>) : {};
              } catch {
                map = {};
              }

              const key = String(selectedRoutineNumber);
              const current = Array.isArray(map[key]) ? map[key] : [];
              if (!current.includes(playlistTitle)) current.push(playlistTitle);
              map[key] = current;

              localStorage.setItem(ROUTINE_PLAYLISTS_KEY, JSON.stringify(map));
              setRoutinePlaylistAddMessage(
                `agregado ${playlistTitle} a rutina ${selectedRoutineNumber}`
              );
            }}
            className="mt-4 w-full rounded-xl gradient-button text-primary-foreground font-display font-bold text-sm shadow-soft py-3 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            agregar playlist a rutina {selectedRoutineNumber ?? ""}
          </button>
        </motion.div>
      )}

      {createdPlaylists.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-2xl bg-pastel-lavender/20 border border-primary/20">
            <p className="text-xs font-display font-semibold text-foreground mb-2">
              Rutina seleccionada
            </p>
            {routineNumbers.length === 0 ? (
              <p className="text-xs text-muted-foreground font-body">
                Crea una rutina para poder sincronizar playlists.
              </p>
            ) : (
              <select
                value={selectedRoutineNumber ?? ""}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setSelectedRoutineNumber(Number.isFinite(v) ? v : null);
                }}
                className="w-full rounded-xl bg-background/60 px-4 py-3 text-sm font-body outline-none border border-border focus:ring-2 focus:ring-primary/40"
              >
                {routineNumbers.map((n) => (
                  <option key={n} value={n}>
                    rutina {n}
                  </option>
                ))}
              </select>
            )}
          </div>

          {createdPlaylists.map((pl, idx) => (
            <motion.div
              key={`${pl.title}-${idx}`}
              className="p-4 rounded-2xl bg-card border border-border"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-sm font-display font-semibold text-foreground mb-3">
                {pl.title} guardada
              </p>
              <div className="space-y-2">
                {pl.songs.map((s) => (
                  <div key={s.id} className="flex items-center justify-between gap-3">
                    <p className="text-sm font-display font-semibold text-foreground truncate">{s.title}</p>
                    <p className="text-[11px] text-muted-foreground font-body truncate">{s.artist}</p>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  if (selectedRoutineNumber == null) return;
                  const playlistTitle = pl.title;

                  const raw = localStorage.getItem(ROUTINE_PLAYLISTS_KEY);
                  let map: Record<string, string[]> = {};
                  try {
                    map = raw ? (JSON.parse(raw) as Record<string, string[]>) : {};
                  } catch {
                    map = {};
                  }

                  const key = String(selectedRoutineNumber);
                  const current = Array.isArray(map[key]) ? map[key] : [];
                  if (!current.includes(playlistTitle)) current.push(playlistTitle);
                  map[key] = current;

                  localStorage.setItem(ROUTINE_PLAYLISTS_KEY, JSON.stringify(map));
                  setRoutinePlaylistAddMessage(
                    `agregado ${playlistTitle} a rutina ${selectedRoutineNumber}`
                  );
                }}
                disabled={selectedRoutineNumber == null}
                className="mt-4 w-full rounded-xl gradient-button text-primary-foreground font-display font-bold text-sm shadow-soft py-3 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                agregar playlist a rutina {selectedRoutineNumber ?? ""}
              </button>
            </motion.div>
          ))}

          {routinePlaylistAddMessage && (
            <p className="text-[11px] text-muted-foreground font-body text-center">
              {routinePlaylistAddMessage}
            </p>
          )}
        </div>
      )}

      {/* Playlist completas */}
      <div className="mt-6 p-4 rounded-2xl bg-pastel-purple/45 border border-pastel-purple/70">
        <p className="text-sm font-display font-semibold text-foreground mb-3">
          playlist completas
        </p>

        <div className="mb-3">
          <p className="text-[11px] text-muted-foreground font-body mb-2">Rutina</p>
          {routineNumbers.length === 0 ? (
            <p className="text-xs text-muted-foreground font-body">
              Crea una rutina para poder ver playlists sincronizadas.
            </p>
          ) : (
            <select
              value={selectedRoutineNumber ?? ""}
              onChange={(e) => {
                const v = Number(e.target.value);
                setSelectedRoutineNumber(Number.isFinite(v) ? v : null);
              }}
              className="w-full rounded-xl bg-background/60 px-4 py-3 text-sm font-body outline-none border border-border focus:ring-2 focus:ring-primary/40"
            >
              {routineNumbers.map((n) => (
                <option key={n} value={n}>
                  rutina {n}
                </option>
              ))}
            </select>
          )}
        </div>

        {selectedRoutineNumber == null ? (
          <p className="text-xs text-muted-foreground font-body">Selecciona una rutina.</p>
        ) : syncedPlaylistTitles.length === 0 ? (
          <p className="text-xs text-muted-foreground font-body">
            Aún no hay playlists sincronizadas para esta rutina.
          </p>
        ) : (
          <div className="space-y-3">
            {syncedPlaylistTitles.map((title, idx) => {
              const created = createdPlaylists.find((pl) => pl.title === title);
              const ytm = selectedYtmPlaylist?.title === title ? selectedYtmPlaylist : null;

              return (
                <div key={`${title}-synced-${idx}`} className="rounded-2xl bg-card border border-border p-3">
                  <p className="text-xs font-display font-bold text-foreground mb-2">{title}</p>
                  {created ? (
                    <div className="space-y-1">
                      {created.songs.map((s) => (
                        <div key={s.id} className="flex items-center justify-between gap-3">
                          <p className="text-[11px] text-foreground truncate">{s.title}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{s.artist}</p>
                        </div>
                      ))}
                    </div>
                  ) : ytm ? (
                    <p className="text-[11px] text-muted-foreground font-body">
                      {typeof ytm.itemCount === "number" ? `${ytm.itemCount} canciones` : "Playlist"}.
                      <span className="block">Detalle no disponible aquí.</span>
                    </p>
                  ) : (
                    <p className="text-[11px] text-muted-foreground font-body">
                      Detalle de canciones no disponible aquí aún.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Empty state message */}
      {!showCreatePlaylist && createdPlaylists.length === 0 && syncedPlaylistTitles.length === 0 && (
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
      )}
    </div>
  );
};

export default PlaylistsScreen;