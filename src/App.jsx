import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WelcomePage from './components/WelcomePage';
import BrainScene from './components/BrainScene';
import ChatInterface from './components/ChatInterface';
import MemoryViewer from './components/MemoryViewer';
import './App.css';
function App() {
  const [currentPage, setCurrentPage] = useState('welcome'); // 'welcome', 'brain', 'chat', 'memory'
  const [selectedRegion, setSelectedRegion] = useState(null);

  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -100 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.8
  };

  const handleWelcomeComplete = () => {
    setCurrentPage('brain');
  };

  const handleChatClick = () => {
    setCurrentPage('chat');
  };

  const handleRegionClick = (region) => {
    setSelectedRegion(region);
    setCurrentPage('memory');
  };

  const handleBackToBrain = () => {
    setCurrentPage('brain');
    setSelectedRegion(null);
  };

  return (
    <div className="App">
      <AnimatePresence mode="wait">
        {currentPage === 'welcome' && (
          <motion.div
            key="welcome"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <WelcomePage onComplete={handleWelcomeComplete} />
          </motion.div>
        )}

        {currentPage === 'brain' && (
          <motion.div
            key="brain"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <BrainScene 
              onChatClick={handleChatClick}
              onRegionClick={handleRegionClick}
            />
          </motion.div>
        )}

        {currentPage === 'memory' && selectedRegion && (
          <motion.div
            key="memory"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <MemoryViewer 
              region={selectedRegion}
              onBack={handleBackToBrain}
            />
          </motion.div>
        )}

        {currentPage === 'chat' && (
          <motion.div
            key="chat"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <ChatInterface onBackClick={handleBackToBrain} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
