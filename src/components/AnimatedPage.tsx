import { motion } from "framer-motion";
import { ReactNode } from "react";

const AnimatedPage = ({ children }: { children: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{
      enter: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] },
      exit: { duration: 0.15, ease: [0.4, 0, 1, 1] },
      duration: 0.28,
      ease: [0.25, 0.46, 0.45, 0.94],
    }}
  >
    {children}
  </motion.div>
);

export default AnimatedPage;
