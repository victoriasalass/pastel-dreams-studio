import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

interface LoginScreenProps {
  onLogin: (name: string) => void;
  onRegister: () => void;
}

const LoginScreen = ({ onLogin, onRegister }: LoginScreenProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col items-center px-8 pt-16 pb-8 min-h-[844px]">
      {/* Logo */}
      <motion.div
        className="relative mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <div className="w-28 h-28 rounded-full bg-primary shadow-glow" />
        <motion.div
          className="absolute -top-2 -right-2 bg-pastel-blue text-accent-foreground text-[10px] font-display font-bold px-2 py-1 rounded-full"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          NEW ERA
        </motion.div>
      </motion.div>

      <motion.h1
        className="text-4xl font-display font-bold tracking-wider text-foreground mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        NIVORIA
      </motion.h1>

      {/* Form */}
      <motion.div
        className="w-full space-y-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-3.5 rounded-2xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-body text-sm"
          />
        </div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-3.5 rounded-2xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-body text-sm"
          />
          <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </motion.div>

      {/* Buttons */}
      <motion.button
        onClick={onRegister}
        className="w-full py-4 rounded-2xl gradient-button text-primary-foreground font-display font-semibold tracking-wider text-sm shadow-soft mb-3"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        REGISTRATE.
      </motion.button>

      <motion.button
        onClick={() => onLogin(email.split("@")[0] || "Usuario")}
        className="w-full py-4 rounded-2xl gradient-button-secondary text-secondary-foreground font-display font-semibold tracking-wider text-sm mb-6"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        INICIAR SESION.
      </motion.button>

      <motion.button
        className="text-muted-foreground text-xs font-body hover:text-primary transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        ¿Olvidaste tu contraseña?
      </motion.button>
    </div>
  );
};

export default LoginScreen;
