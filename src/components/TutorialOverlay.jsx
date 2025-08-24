import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TutorialOverlay = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const tutorialSteps = [
    {
      title: "مرحباً بك في رحلة عقلك!",
      description: "أنا مرشدك الذكي في هذه التجربة الفريدة",
      position: "center",
      highlight: null
    },
    {
      title: "استكشف مناطق دماغك",
      description: "انقر على المناطق الملونة لاستكشاف محتوياتها",
      position: "center",
      highlight: "brain-regions"
    },
    {
      title: "منطقة الذكريات",
      description: "المنطقة الذهبية تحتوي على ذكرياتك الجميلة",
      position: "left",
      highlight: "hippocampus"
    },
    {
      title: "منطقة المشاعر",
      description: "المنطقة الحمراء تضم مشاعرك المختلفة",
      position: "right",
      highlight: "amygdala"
    },
    {
      title: "منطقة الأفكار",
      description: "المنطقة الزرقاء تحتوي على أفكارك الإبداعية",
      position: "top",
      highlight: "cortex"
    },
    {
      title: "تحدث معي",
      description: "يمكنك التحدث معي في أي وقت من خلال زر المحادثة",
      position: "bottom",
      highlight: "chat-button"
    }
  ];

  const playTutorialAudio = () => {
    if (audioRef.current) {
      setIsPlaying(true);
      audioRef.current.play().catch(console.error);
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const skipTutorial = () => {
    onComplete();
  };

  useEffect(() => {
    // Auto-play audio on first step
    if (currentStep === 0) {
      const timer = setTimeout(() => {
        playTutorialAudio();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const currentStepData = tutorialSteps[currentStep];

  const getPositionClasses = (position) => {
    switch (position) {
      case 'center':
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
      case 'left':
        return 'top-1/2 left-8 transform -translate-y-1/2';
      case 'right':
        return 'top-1/2 right-8 transform -translate-y-1/2';
      case 'top':
        return 'top-8 left-1/2 transform -translate-x-1/2';
      case 'bottom':
        return 'bottom-8 left-1/2 transform -translate-x-1/2';
      default:
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
      >
        {/* Tutorial Card */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -50 }}
          transition={{ duration: 0.5 }}
          className={`absolute ${getPositionClasses(currentStepData.position)} max-w-md`}
        >
          <div className="bg-gradient-to-br from-cyan-900/90 to-blue-900/90 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-6 shadow-2xl">
            {/* Step indicator */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-2">
                {tutorialSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentStep ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={skipTutorial}
                className="text-gray-400 hover:text-white text-sm"
              >
                تخطي
              </button>
            </div>

            {/* Content */}
            <div className="text-center">
              <h3 className="text-xl font-bold text-cyan-400 mb-3 neon-text">
                {currentStepData.title}
              </h3>
              <p className="text-cyan-100 text-sm leading-relaxed mb-6">
                {currentStepData.description}
              </p>

              {/* Audio controls */}
              <div className="flex items-center justify-center space-x-4 space-x-reverse mb-6">
                <button
                  onClick={playTutorialAudio}
                  disabled={isPlaying}
                  className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg transition-all ${
                    isPlaying
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-cyan-600 hover:bg-cyan-500'
                  } text-white`}
                >
                  <span>{isPlaying ? '🔊' : '🎵'}</span>
                  <span>{isPlaying ? 'يتم التشغيل...' : 'استمع للشرح'}</span>
                </button>
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  السابق
                </button>
                
                <button
                  onClick={nextStep}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-semibold transition-all pulse-glow"
                >
                  {currentStep === tutorialSteps.length - 1 ? 'ابدأ الاستكشاف' : 'التالي'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Highlight overlay */}
        {currentStepData.highlight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* This would highlight specific elements based on the highlight prop */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl" />
          </motion.div>
        )}

        {/* Hidden audio element */}
        <audio
          ref={audioRef}
          onEnded={handleAudioEnd}
          preload="auto"
        >
          <source src="/src/assets/tutorial_voice.wav" type="audio/wav" />
          متصفحك لا يدعم تشغيل الصوت
        </audio>
      </motion.div>
    </AnimatePresence>
  );
};

export default TutorialOverlay;

