import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

interface RegisterScreenProps {
  onBack: () => void;
  onRegister: (name: string) => void;
}

const RegisterScreen = ({ onBack, onRegister }: RegisterScreenProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  return (
    <div className="flex flex-col px-8 pt-12 pb-8 min-h-[844px]">
      <motion.button onClick={onBack} className="text-muted-foreground mb-8 self-start" whileTap={{ scale: 0.9 }}>
        <ArrowLeft size={24} />
      </motion.button>

      <motion.h1 className="text-3xl font-display font-bold text-foreground mb-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        Crear cuenta
      </motion.h1>
      <motion.p className="text-muted-foreground font-body text-sm mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        Únete a la nueva era de NIVORIA ✨
      </motion.p>

      <motion.div className="space-y-4 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <input type="text" placeholder="Nombre completo" value={name} onChange={(e) => setName(e.target.value)}
          className="w-full px-5 py-3.5 rounded-2xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-body text-sm" />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full px-5 py-3.5 rounded-2xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-body text-sm" />
        <div className="relative">
          <input type={showPw ? "text" : "password"} placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-3.5 rounded-2xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-body text-sm" />
          <button onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </motion.div>

      <motion.button
        onClick={() => onRegister(name || "Usuario")}
        className="w-full py-4 rounded-2xl gradient-button text-primary-foreground font-display font-semibold tracking-wider text-sm shadow-soft"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        CREAR CUENTA
      </motion.button>
    </div>
  );
};

export default RegisterScreen;
