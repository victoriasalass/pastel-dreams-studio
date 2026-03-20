import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Play, Music, Sparkles, Palette } from "lucide-react";

interface PlaylistItem {
  name: string;
  genre: string;
  icon: React.ReactNode;
  liked: boolean;
}

const initialPlaylists: PlaylistItem[][] = [
  [
    { name: "MY COLORS", genre: "Vibrant Echoes", icon: <Palette size={18} />, liked: false },
    { name: "DULANTC", genre: "Urban Soul", icon: <Music size={18} />, liked: false },
    { name: "NEON PEAK", genre: "Synth Wave", icon: <Sparkles size={18} />, liked: true },
  ],
  [
    { name: "VELVET SKY", genre: "Lo-Fi Dream", icon: <Play size={18} />, liked: true },
    { name: "ETHEREAL", genre: "Ambient Flow", icon: <Music size={18} />, liked: false },
    { name: "LATE NIGHT", genre: "Jazz Soul", icon: <Sparkles size={18} />, liked: true },
  ],
];

const bgColors = [
  "bg-pastel-purple/40",
  "bg-pastel-pink/40",
  "bg-pastel-blue/40",
  "bg-pastel-lavender/40",
  "bg-pastel-purple/30",
  "bg-pastel-pink/30",
];

const PlaylistsScreen = () => {
  const [playlists, setPlaylists] = useState(initialPlaylists);

  const toggleLike = (pi: number, si: number) => {
    setPlaylists(prev => prev.map((pl, i) =>
      i !== pi ? pl : pl.map((s, j) => j !== si ? s : { ...s, liked: !s.liked })
    ));
  };

  return (
    <div className="px-6 pt-12 pb-24">
      <motion.div className="mb-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-foreground">TUS PLAYLIST+</h1>
        <p className="text-sm text-muted-foreground">Tu curación personal de ritmos y texturas.</p>
      </motion.div>

      {playlists.map((playlist, pi) => (
        <div key={pi} className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-display font-semibold text-foreground text-sm">Playlist {pi + 1}</h2>
            <button className="text-xs text-primary font-body">Ver todo</button>
          </div>
          <div className="space-y-3">
            {playlist.map((song, si) => (
              <motion.div
                key={si}
                className={`flex items-center gap-4 p-4 rounded-2xl ${bgColors[(pi * 3 + si) % bgColors.length]} border border-border/50`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + si * 0.05 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="w-10 h-10 rounded-xl gradient-button flex items-center justify-center text-primary-foreground">
                  {song.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-sm text-foreground">{song.name}</p>
                  <p className="text-xs text-muted-foreground">{song.genre}</p>
                </div>
                <motion.button
                  onClick={() => toggleLike(pi, si)}
                  whileTap={{ scale: 1.3 }}
                >
                  <Heart size={18} className={song.liked ? "fill-secondary text-secondary" : "text-muted-foreground"} />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      ))}

      {/* Stats */}
      <motion.div
        className="flex gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex-1 rounded-2xl bg-pastel-lavender/30 p-4 text-center">
          <p className="text-2xl font-display font-bold text-foreground">124</p>
          <p className="text-xs text-muted-foreground">Playlists</p>
        </div>
        <div className="flex-1 rounded-2xl bg-pastel-blue/30 p-4 text-center">
          <p className="text-2xl font-display font-bold text-foreground">2.5k</p>
          <p className="text-xs text-muted-foreground">Escuchas</p>
        </div>
      </motion.div>
    </div>
  );
};

export default PlaylistsScreen;
