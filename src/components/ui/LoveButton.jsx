import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

const LoveButton = ({ onClick, size = 40, pulse = true }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    onClick();
    setTimeout(() => setIsAnimating(false), 3000);
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleClick}
        className="p-3 bg-rose-100 dark:bg-rose-900/30 text-rose-500 dark:text-rose-400 rounded-full shadow-lg"
        style={{ width: `${size}px`, height: `${size}px` }}
        aria-label="إرسال حب"
      >
        <Heart className="fill-current" />
      </motion.button>
      
      <AnimatePresence>
        {isAnimating && pulse && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            className="absolute inset-0 rounded-full bg-rose-300"
            style={{ zIndex: -1 }}
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            initial={{ 
              scale: 0,
              opacity: 1,
              x: 0,
              y: 0
            }}
            animate={{ 
              scale: [0, 1, 0],
              x: (Math.random() - 0.5) * 100,
              y: -100 - Math.random() * 50,
              opacity: [1, 1, 0]
            }}
            transition={{ 
              duration: 2,
              times: [0, 0.5, 1]
            }}
            className="absolute text-rose-500"
            style={{ top: '50%', left: '50%' }}
          >
            <Heart className="fill-current" size={24} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoveButton;