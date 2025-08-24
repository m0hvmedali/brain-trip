import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html, PerspectiveCamera } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

// Memory Orb Component - كرة الذكرى
const MemoryOrb = ({ position, memory, onClick, isActive }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
      
      if (isActive) {
        meshRef.current.scale.setScalar(1.2 + Math.sin(state.clock.elapsedTime * 2) * 0.1);
      } else {
        meshRef.current.scale.setScalar(hovered ? 1.1 : 1);
      }
    }
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        position={position}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshPhongMaterial
          color={memory.color}
          transparent
          opacity={0.8}
          emissive={memory.color}
          emissiveIntensity={isActive ? 0.5 : 0.2}
        />
      </mesh>
      
      {/* Particle effects around the orb */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 0.8;
        return (
          <mesh
            key={i}
            position={[
              position[0] + Math.cos(angle) * radius,
              position[1],
              position[2] + Math.sin(angle) * radius
            ]}
          >
            <sphereGeometry args={[0.02]} />
            <meshBasicMaterial color={memory.color} />
          </mesh>
        );
      })}
      
      {/* Memory title */}
      <Html position={[position[0], position[1] + 0.8, position[2]]}>
        <div className="text-white text-sm font-semibold bg-black/50 px-2 py-1 rounded pointer-events-none text-center">
          {memory.title}
        </div>
      </Html>
    </group>
  );
};

// Memory Scene Component - مشهد الذكرى المفصل
const MemoryScene = ({ memory, onClose }) => {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central memory sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshPhongMaterial
          color={memory.color}
          transparent
          opacity={0.6}
          emissive={memory.color}
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Memory elements floating around */}
      {memory.elements.map((element, index) => {
        const angle = (index / memory.elements.length) * Math.PI * 2;
        const radius = 3 + Math.sin(index) * 0.5;
        const height = Math.cos(index * 0.5) * 2;
        
        return (
          <group key={index}>
            <mesh position={[
              Math.cos(angle) * radius,
              height,
              Math.sin(angle) * radius
            ]}>
              <boxGeometry args={[0.3, 0.3, 0.3]} />
              <meshPhongMaterial
                color={element.color}
                transparent
                opacity={0.8}
                emissive={element.color}
                emissiveIntensity={0.2}
              />
            </mesh>
            
            {/* Element label */}
            <Html position={[
              Math.cos(angle) * radius,
              height + 0.5,
              Math.sin(angle) * radius
            ]}>
              <div className="text-white text-xs bg-black/70 px-2 py-1 rounded pointer-events-none">
                {element.name}
              </div>
            </Html>
          </group>
        );
      })}
      
      {/* Memory description */}
      <Html position={[0, -3, 0]}>
        <div className="text-center max-w-md">
          <h3 className="text-xl font-bold text-cyan-400 mb-2">{memory.title}</h3>
          <p className="text-cyan-100 text-sm leading-relaxed">{memory.description}</p>
          <button
            onClick={onClose}
            className="mt-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-4 py-2 rounded-lg transition-all duration-300"
          >
            العودة للذكريات
          </button>
        </div>
      </Html>
    </group>
  );
};

// Main Memory Viewer Component
const MemoryViewer = ({ region, onBack }) => {
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Sample memories data based on region
  const getMemoriesForRegion = (region) => {
    const memoriesData = {
      hippocampus: [
        {
          id: 1,
          title: "ذكرى الطفولة",
          description: "لحظات جميلة من أيام الطفولة البريئة، اللعب في الحديقة والضحك مع الأصدقاء",
          color: "#FFD700",
          elements: [
            { name: "اللعب", color: "#FF6B6B" },
            { name: "الأصدقاء", color: "#4ECDC4" },
            { name: "المرح", color: "#45B7D1" },
            { name: "البراءة", color: "#96CEB4" }
          ]
        },
        {
          id: 2,
          title: "التخرج",
          description: "يوم التخرج المميز، شعور الفخر والإنجاز بعد سنوات من الدراسة والتعب",
          color: "#9B59B6",
          elements: [
            { name: "الفخر", color: "#E74C3C" },
            { name: "الإنجاز", color: "#F39C12" },
            { name: "المستقبل", color: "#3498DB" },
            { name: "الأهل", color: "#2ECC71" }
          ]
        },
        {
          id: 3,
          title: "السفر الأول",
          description: "أول رحلة سفر خارج البلاد، اكتشاف ثقافات جديدة ومغامرات لا تُنسى",
          color: "#1ABC9C",
          elements: [
            { name: "المغامرة", color: "#E67E22" },
            { name: "الاكتشاف", color: "#8E44AD" },
            { name: "الثقافة", color: "#34495E" },
            { name: "الحرية", color: "#16A085" }
          ]
        }
      ],
      amygdala: [
        {
          id: 4,
          title: "الحب الأول",
          description: "مشاعر الحب الأولى، الفراشات في المعدة والقلب الذي ينبض بسرعة",
          color: "#E91E63",
          elements: [
            { name: "الشغف", color: "#FF5722" },
            { name: "الحنان", color: "#FF9800" },
            { name: "الأمل", color: "#CDDC39" },
            { name: "السعادة", color: "#FFC107" }
          ]
        },
        {
          id: 5,
          title: "الخوف والتحدي",
          description: "لحظات الخوف التي تحولت إلى قوة، التغلب على المخاوف وتحقيق المستحيل",
          color: "#FF5722",
          elements: [
            { name: "الشجاعة", color: "#795548" },
            { name: "التحدي", color: "#607D8B" },
            { name: "النمو", color: "#4CAF50" },
            { name: "القوة", color: "#9C27B0" }
          ]
        }
      ],
      cortex: [
        {
          id: 6,
          title: "الإبداع والابتكار",
          description: "لحظات الإلهام والإبداع، عندما تتدفق الأفكار كالنهر الجاري",
          color: "#00BCD4",
          elements: [
            { name: "الإلهام", color: "#FFEB3B" },
            { name: "الابتكار", color: "#03A9F4" },
            { name: "التفكير", color: "#673AB7" },
            { name: "الحلول", color: "#009688" }
          ]
        },
        {
          id: 7,
          title: "التعلم والنمو",
          description: "رحلة التعلم المستمر، اكتساب المعرفة والمهارات الجديدة",
          color: "#3F51B5",
          elements: [
            { name: "المعرفة", color: "#2196F3" },
            { name: "المهارات", color: "#00BCD4" },
            { name: "التطور", color: "#4CAF50" },
            { name: "الحكمة", color: "#FF9800" }
          ]
        }
      ]
    };
    
    return memoriesData[region] || [];
  };

  const memories = getMemoriesForRegion(region);

  if (isLoading) {
    return (
      <div className="brain-container flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-400 text-lg">جاري تحميل الذكريات...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="brain-container relative">
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="interactive-element flex items-center space-x-2 space-x-reverse text-cyan-400 hover:text-cyan-300 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg"
          >
            <span>←</span>
            <span>العودة للدماغ</span>
          </button>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold text-cyan-400 neon-text">
              {region === 'hippocampus' && 'رحلة الذكريات'}
              {region === 'amygdala' && 'عالم المشاعر'}
              {region === 'cortex' && 'فضاء الأفكار'}
            </h2>
            <p className="text-cyan-300 text-sm">اختر ذكرى لاستكشافها</p>
          </div>
          
          <div className="w-16"></div>
        </div>
      </div>

      {/* 3D Scene */}
      <Canvas className="w-full h-full">
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ffff" />
        
        {/* Background particles */}
        {[...Array(50)].map((_, i) => (
          <mesh
            key={i}
            position={[
              (Math.random() - 0.5) * 20,
              (Math.random() - 0.5) * 20,
              (Math.random() - 0.5) * 20
            ]}
          >
            <sphereGeometry args={[0.01]} />
            <meshBasicMaterial color="#00ffff" />
          </mesh>
        ))}
        
        {selectedMemory ? (
          <MemoryScene
            memory={selectedMemory}
            onClose={() => setSelectedMemory(null)}
          />
        ) : (
          <>
            {memories.map((memory, index) => {
              const angle = (index / memories.length) * Math.PI * 2;
              const radius = 4;
              return (
                <MemoryOrb
                  key={memory.id}
                  position={[
                    Math.cos(angle) * radius,
                    Math.sin(index * 0.5) * 2,
                    Math.sin(angle) * radius
                  ]}
                  memory={memory}
                  onClick={() => setSelectedMemory(memory)}
                  isActive={false}
                />
              );
            })}
          </>
        )}
      </Canvas>

      {/* Instructions */}
      {!selectedMemory && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 right-4 z-10"
        >
          <div className="bg-black/50 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4 text-center">
            <p className="text-cyan-100 text-sm">
              انقر على أي كرة ذكرى لاستكشافها • استخدم الماوس للتنقل في الفضاء ثلاثي الأبعاد
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MemoryViewer;

