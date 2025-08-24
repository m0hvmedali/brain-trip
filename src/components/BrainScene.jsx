// src/components/BrainScene.jsx
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import personalData from '../data/personalData.json';
import { MessageCircleMore, MessageCircleQuestionMarkIcon } from "lucide-react";
// Neural Network Component
const NeuralNetwork = ({ radius = 6, count = 100, color = '#00ffff', label, onNeuronClick }) => {
  const groupRef = useRef();
  const [connections] = useState(() => {
    const conns = [];
    for (let i = 0; i < count; i++) {
      const start = new THREE.Vector3().setFromSphericalCoords(
        radius,
        Math.acos(2 * Math.random() - 1),
        2 * Math.PI * Math.random()
      );
      const end = new THREE.Vector3().setFromSphericalCoords(
        radius,
        Math.acos(2 * Math.random() - 1),
        2 * Math.PI * Math.random()
      );
      conns.push({
        start: start.toArray(),
        end: end.toArray(),
        color: Math.random() > 0.5 ? color : '#8a2be2',
        id: `${label}-${i}`
      });
    }
    return conns;
  });

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {connections.map((conn) => (
        <group key={conn.id}>
          {/* الخط */}
          <line onClick={() => onNeuronClick({ ...conn, label })}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([...conn.start, ...conn.end])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color={conn.color} opacity={0.3} transparent />
          </line>

          {/* النقاط */}
          <Sphere args={[0.08]} position={conn.start} onClick={() => onNeuronClick({ ...conn, label })}>
            <meshBasicMaterial color={conn.color} />
          </Sphere>
          <Sphere args={[0.08]} position={conn.end} onClick={() => onNeuronClick({ ...conn, label })}>
            <meshBasicMaterial color={conn.color} />
          </Sphere>
        </group>
      ))}
    </group>
  );
};

// Brain Model
const BrainModel = () => {
  const { scene } = useGLTF('/brain.glb');
  const brainRef = useRef();

  useFrame(() => {
    if (brainRef.current) {
      brainRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={brainRef} scale={1.5}>
      <primitive object={scene} />
    </group>
  );
};

// Main Scene
const BrainScene = ({ onChatClick }) => {
  const [showNav, setShowNav] = useState(true);
  const [activeNeuron, setActiveNeuron] = useState(null);
  const [networks, setNetworks] = useState([]);

  useEffect(() => {
    setNetworks(personalData.networks || []);
  }, []);

  const handleNeuronClick = (conn) => {
    setActiveNeuron(conn);
  };

  return (
    <div className="w-screen h-screen bg-black">
      {/* Header */}
      <div className="fixed top-6 left-6 z-40">
        <h1 className="text-2xl font-bold text-cyan-400 neon-text">on my mind </h1>
      </div>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 12], fov: 75 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8a2be2" />

        <BrainModel />

        {/* رسم الشبكات من JSON */}
        {networks.map((net, i) => (
          <NeuralNetwork
            key={i}
            radius={6 + i * 2}
            count={net.count || 50}
            color={net.color || '#00ffff'}
            label={net.label || `شبكة ${i + 1}`}
            onNeuronClick={handleNeuronClick}
          />
        ))}

        <OrbitControls enablePan={false} enableZoom={true} />
      </Canvas>

      {/* Data Popup */}
      {activeNeuron && (
        <div className="fixed right-6 top-20 z-50 p-4 w-64 text-white rounded-xl shadow-lg bg-black/70">
          <h2 className="mb-2 font-bold text-cyan-400">x</h2>
          <p className="mb-1 text-sm text-gray-200">الشبكة: {activeNeuron.label}</p>
    
          <button
            onClick={() => setActiveNeuron(null)}
            className="px-3 py-1 mt-3 text-sm bg-cyan-600 rounded hover:bg-cyan-500"
          >
            x
          </button>
        </div>
      )}

      {/* Navigation */}
      {showNav && (
  <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2">
    <button
      onClick={onChatClick}
      className="p-4 text-white bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full shadow-lg interactive-element hover:from-cyan-500 hover:to-blue-500 pulse-glow"
    >
      <MessageCircleMore className="w-6 h-6" />
   
    </button>
  </div>
)}

    </div>
  );
};
export default BrainScene;
