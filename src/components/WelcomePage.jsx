import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const WelcomePage = ({ onComplete }) => {
  const [currentText, setCurrentText] = useState('');
  const [showSkip, setShowSkip] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const welcomeText = 'Here are things that the mind failed to remember, so I remembered them';
  const subtitle = 'reedy!!!!!';

  useEffect(() => {
    // Typewriter effect for welcome text
    let index = 0;
    const timer = setInterval(() => {
      if (index < welcomeText.length) {
        setCurrentText(welcomeText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
        setShowSkip(true);
        
        // Start countdown
        const countdownTimer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(countdownTimer);
              onComplete();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [onComplete, welcomeText]);

  return (
    <div className="flex justify-center items-center brain-container">
      {/* Background particles */}
      <div className="overflow-hidden absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="z-10 px-8 mx-auto max-w-4xl text-center">
        {/* Logo/Title */}
        <motion.h1
          className="mb-8 text-6xl font-bold text-cyan-400 md:text-8xl neon-text"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Virtual mind
        </motion.h1>

        {/* Animated welcome text */}
        <motion.div
          className="text-2xl md:text-3xl mb-6 text-cyan-100 min-h-[3rem]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          {currentText}
          <span className="animate-pulse">|</span>
        </motion.div>

        {/* Subtitle */}
        {showSkip && (
          <motion.p
            className="mb-12 text-lg text-cyan-300 md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {subtitle}
          </motion.p>
        )}

        {/* Loading animation */}
        {showSkip && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex justify-center items-center mb-4 space-x-2">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-cyan-400 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
            <p className="text-cyan-300">جاري التحضير...</p>
          </motion.div>
        )}

        {/* Countdown and skip button */}
        {showSkip && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p className="text-cyan-200">
              سيبدأ العرض خلال {countdown} ثوانٍ
            </p>
            
            <motion.button
              onClick={onComplete}
              className="px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full transition-all duration-300 interactive-element hover:from-cyan-500 hover:to-blue-500 pulse-glow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              gooooo
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-10 left-10">
        <motion.div
          className="w-20 h-20 rounded-full border-2 border-cyan-400 neural-glow"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      <div className="absolute top-10 right-10">
        <motion.div
          className="w-16 h-16 rounded-full border-2 border-purple-400 neural-glow"
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
};

export default WelcomePage;