import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

export default function OverlayMenu({ isOpen, onClose }) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
  const origin = isMobile ? "95% 8%" : "50% 4%";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed h-full w-full flex items-center justify-center z-50 backdrop-blur-xl"
          initial={{ clipPath: `circle(0% at ${origin})` }}
          animate={{ clipPath: `circle(150% at ${origin})` }}
          exit={{ clipPath: `circle(0% at ${origin})` }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          style={{ backgroundColor: "rgba(15, 23, 42, 0.8)" }}
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white text-3xl"
            aria-label="close Menu"
          >
            <FiX />
          </button>
          <ul className="space-y-6 text-center">
            {["Home", "About", "Skills", "Projects", "Contact"].map(
              (item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                >
                  <a
                    href={`#${item.toLocaleLowerCase()}`}
                    onClick={onClose}
                    className="text-4xl text-white font-semibold hover:text-pink-400 transition-colors duration-300"
                  >
                    {item}
                  </a>
                </motion.li>
              ),
            )}
          </ul>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: [0, -5, 0] }}
            transition={{ delay: 0.6, duration: 2, repeat: Infinity }}
            className="absolute bottom-6 left-6"
          >
            <h2
              className="text-sm md:text-base font-semibold tracking-widest 
  bg-linear-to-r from-pink-400 via-cyan-400 to-purple-400 
  bg-clip-text text-transparent"
            >
              Not Your Average Navbar
            </h2>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
