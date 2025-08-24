import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Text, Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import memoriesData from '../assets/memories_data.json';
import TutorialOverlay from './TutorialOverlay';
import { Gamepad2, Volume2, MessageCircle } from 'lucide-react'; // ✅ أيقونات Lucide

// Neural Network Component
const NeuralNetwork = () => {
  const groupRef = useRef();
  const [connections] = useState(() => {
    const conns = [];
    for (let i = 0; i < 20; i++) {
      conns.push({
        start: [
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        ],
        end: [
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        ],
        color: Math.random() > 0.5 ? '#00ffff' : '#8a2be2'
      });
    }
    return conns;
  });

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {connections.map((conn, index) => (
        <group key={index}>
          {/* Connection line */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([...conn.start, ...conn.end])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color={conn.color} opacity={0.6} transparent />
          </line>
          
          {/* Start node */}
          <Sphere args={[0.05]} position={conn.start}>
            <meshBasicMaterial color={conn.color} />
          </Sphere>
          
          {/* End node */}
          <Sphere args={[0.05]} position={conn.end}>
            <meshBasicMaterial color={conn.color} />
          </Sphere>
        </group>
      ))}
    </group>
  );
};

// Brain Model Component
const BrainModel = ({ onRegionClick }) => {
  const brainRef = useRef();
  
  useFrame((state) => {
    if (brainRef.current) {
      brainRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  const regions = [
    { name: 'hippocampus', position: [-2, 0, 1], color: '#FFD700', label: 'الذكريات' },
    { name: 'amygdala', position: [2, -1, 0], color: '#FF6347', label: 'المشاعر' },
    { name: 'cortex', position: [0, 2, 0], color: '#00CED1', label: 'الأفكار' }
  ];

  return (
    <group ref={brainRef}>
      {/* Main brain shape - more realistic */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshPhongMaterial 
          color="#1a1a2e" 
          transparent 
          opacity={0.8}
          emissive="#0066cc"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Brain surface details */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[3.1, 16, 16]} />
        <meshBasicMaterial 
          color="#00ffff" 
          transparent 
          opacity={0.3}
          wireframe
        />
      </mesh>

      {/* Neural pathways */}
      {[...Array(20)].map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const radius = 2.5 + Math.sin(i) * 0.5;
        return (
          <mesh key={i} position={[
            Math.cos(angle) * radius,
            Math.sin(angle * 0.5) * radius,
            Math.sin(angle) * radius
          ]}>
            <sphereGeometry args={[0.02]} />
            <meshBasicMaterial color="#00ffff" />
          </mesh>
        );
      })}

      {/* Brain regions */}
      {regions.map((region) => (
        <group key={region.name}>
          <mesh 
            position={region.position}
            onClick={() => onRegionClick(region.name)}
          >
            <sphereGeometry args={[0.8]} />
            <meshPhongMaterial 
              color={region.color} 
              transparent 
              opacity={0.7}
              emissive={region.color}
              emissiveIntensity={0.3}
            />
          </mesh>
          
          {/* Pulsing effect */}
          <mesh position={region.position}>
            <sphereGeometry args={[1.0]} />
            <meshBasicMaterial 
              color={region.color} 
              transparent 
              opacity={0.2}
            />
          </mesh>
          
          <Html position={[region.position[0], region.position[1] + 1.2, region.position[2]]}>
            <div className="text-white text-sm font-semibold bg-black/50 px-2 py-1 rounded pointer-events-none">
              {region.label}
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
};

// Floating Robot Component
const FloatingRobot = ({ message }) => {
  const robotRef = useRef();
  
  useFrame((state) => {
    if (robotRef.current) {
      robotRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.5 + 2;
      robotRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <group ref={robotRef} position={[4, 2, 2]}>
      {/* Robot body */}
      <Sphere args={[0.3]}>
        <meshPhongMaterial color="#00ffff" transparent opacity={0.8} />
      </Sphere>
      
      {/* Robot eyes */}
      <Sphere args={[0.05]} position={[-0.1, 0.1, 0.25]}>
        <meshBasicMaterial color="#ffffff" />
      </Sphere>
      <Sphere args={[0.05]} position={[0.1, 0.1, 0.25]}>
        <meshBasicMaterial color="#ffffff" />
      </Sphere>

      {/* Message bubble */}
      {message && (
        <Html position={[0, 0.8, 0]}>
          <div className="robot-message max-w-xs">
            {message}
          </div>
        </Html>
      )}
    </group>
  );
};

// Memory Detail Panel Component
const MemoryDetailPanel = ({ memory, onClose }) => {
  if (!memory) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gradient-to-br from-gray-900 to-black border border-cyan-500/30 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold text-cyan-400 neon-text">
            {memory.title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4 space-x-reverse">
            <span className="text-cyan-300">العمر:</span>
            <span className="text-white">{memory.age}</span>
          </div>
          
          <div className="flex items-center space-x-4 space-x-reverse">
            <span className="text-cyan-300">التأثير العاطفي:</span>
            <span 
              className="px-3 py-1 rounded-full text-sm font-semibold"
              style={{ 
                backgroundColor: memory.color + '20',
                color: memory.color,
                border: `1px solid ${memory.color}50`
              }}
            >
              {memory.emotional_impact}
            </span>
          </div>
          
          <div>
            <h4 className="text-cyan-300 mb-2">الوصف:</h4>
            <p className="text-gray-300 leading-relaxed">
              {memory.description}
            </p>
          </div>
          
          <div className="flex space-x-4 space-x-reverse mt-6">
            <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg transition-colors">
              🔊 استمع للذكرى
            </button>
            <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-colors">
              📷 عرض الصور
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main Brain Scene Component
const BrainScene = ({ onChatClick, onRegionClick }) => {
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [robotMessage, setRobotMessage] = useState('مرحباً محمد! انقر على أي منطقة لاستكشاف ذكرياتك');
  const [showControls, setShowControls] = useState(true);
  const [showTutorial, setShowTutorial] = useState(true);

  const handleRegionClick = (regionName) => {
    const messages = {
      hippocampus: 'دعنا نستكشف ذكرياتك الجميلة...',
      amygdala: 'سنغوص في عالم مشاعرك...',
      cortex: 'لنكتشف أفكارك الإبداعية...'
    };
    
    setRobotMessage(messages[regionName] || 'منطقة مثيرة للاهتمام!');
    
    // Navigate to memory viewer
    if (onRegionClick) {
      onRegionClick(regionName);
    }
  };

  useEffect(() => {
    const messages = [
      'استكشف مناطق دماغك المختلفة',
      'كل منطقة تحتوي على ذكريات ومشاعر مختلفة',
      'انقر على المناطق الملونة لاكتشاف المزيد',
      'يمكنك التحدث معي في أي وقت'
    ];
    
    let messageIndex = 0;
    const interval = setInterval(() => {
      if (messageIndex < messages.length - 1) {
        messageIndex++;
        setRobotMessage(messages[messageIndex]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="brain-container">
      {/* 3D Scene */}
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8a2be2" />
        
        <BrainModel onRegionClick={handleRegionClick} />
        <NeuralNetwork />
        <FloatingRobot message={robotMessage} />
        
        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          maxDistance={15}
          minDistance={5}
        />
      </Canvas>

      {/* UI Controls */}
      {showControls && (
        <div className="floating-ui bottom-6 left-6 right-6">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4 space-x-reverse">
              <button 
                onClick={() => setShowControls(false)}
                className="interactive-element bg-black/50 backdrop-blur-sm border border-cyan-500/30 text-cyan-100 p-3 rounded-full hover:bg-cyan-900/30"
              >
                <Gamepad2 size={22} />
              </button>
              <button className="interactive-element bg-black/50 backdrop-blur-sm border border-cyan-500/30 text-cyan-100 p-3 rounded-full hover:bg-cyan-900/30">
                <Volume2 size={22} />
              </button>
            </div>
            
            <button 
              onClick={onChatClick}
              className="interactive-element bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white p-4 rounded-full shadow-lg pulse-glow"
            >
              <MessageCircle size={24} />
            </button>
          </div>
        </div>
      )}

      {/* Show controls button when hidden */}
      {!showControls && (
        <button 
          onClick={() => setShowControls(true)}
          className="fixed bottom-6 left-6 interactive-element bg-cyan-600 hover:bg-cyan-500 text-white p-3 rounded-full z-40"
        >
          <Gamepad2 size={22} />
        </button>
      )}

      {/* Memory Detail Panel */}
      {selectedMemory && (
        <MemoryDetailPanel 
          memory={selectedMemory} 
          onClose={() => setSelectedMemory(null)} 
        />
      )}

      {/* Navigation */}
      <div className="fixed top-6 left-6 z-40">
        <div className="flex items-center space-x-4 space-x-reverse">
          <h1 className="text-2xl font-bold text-cyan-400 neon-text">
            رحلة في عقلي
          </h1>
          <div className="text-cyan-300 text-sm">
            الدماغ | الذكريات | المشاعر
          </div>
        </div>
      </div>

      {/* Tutorial Overlay */}
      {showTutorial && (
        <TutorialOverlay onComplete={() => setShowTutorial(false)} />
      )}
    </div>
  );
};

export default BrainScene;
