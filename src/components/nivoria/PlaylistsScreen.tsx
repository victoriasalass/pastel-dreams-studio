import { useState } from "react";
import { motion } from "framer-motion";
import { Music, Plus } from "lucide-react";

const PlaylistsScreen = () => {
  const [showSpotifyConnect, setShowSpotifyConnect] = useState(false);

  if (!showSpotifyConnect) {
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

        {/* Vincular Spotify Tab */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <button
            onClick={() => setShowSpotifyConnect(true)}
            className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-display font-bold text-sm shadow-soft transition-colors"
          >
            <Music size={20} />
            VINCULAR SPOTIFY
          </button>
        </motion.div>

        {/* Info message */}
        <motion.div
          className="mt-8 p-4 rounded-2xl bg-pastel-lavender/20 border border-primary/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-xs text-muted-foreground text-center font-body">
            Conecta tu cuenta de Spotify para sincronizar tus playlists y descubrir nueva música.
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

      {/* Spotify Connected Status */}
      <motion.div
        className="flex items-center gap-3 p-4 rounded-2xl bg-green-50 border border-green-200 mb-6"
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

      {/* Agregar Playlist Tab */}
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <button className="flex items-center gap-3 px-8 py-4 rounded-2xl gradient-button text-primary-foreground font-display font-bold text-sm shadow-soft">
          <Plus size={20} />
          AGREGAR PLAYLIST
        </button>
      </motion.div>

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