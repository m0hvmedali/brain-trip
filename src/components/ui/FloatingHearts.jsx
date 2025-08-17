// import React from 'react';
// import { motion } from 'framer-motion';
// import { Heart } from 'lucide-react';

// const FloatingHearts = ({ count = 20, size = 24, speed = 6 }) => {
//   const hearts = Array.from({ length: count }, (_, i) => {
//     const startX = Math.random() * 100;
//     const startY = Math.random() * 100;
//     const delay = Math.random() * 5;
//     const duration = speed + Math.random() * 4;
    
//     return {
//       id: i,
//       startX,
//       startY,
//       delay,
//       duration,
//       size: size + Math.random() * 20
//     };
//   });

//   return (
//     <div className="overflow-hidden fixed inset-0 pointer-events-none">
//       {hearts.map((heart) => (
//         <motion.div
//           key={heart.id}
//           className="absolute text-rose-500"
//           style={{
//             left: `${heart.startX}%`,
//             top: `${heart.startY}%`,
//           }}
//           animate={{
//             y: [0, -100],
//             x: [0, (Math.random() - 0.5) * 100],
//             opacity: [0, 0.8, 0],
//             scale: [0, 1, 0.5],
//           }}
//           transition={{
//             duration: heart.duration,
//             repeat: Infinity,
//             delay: heart.delay,
//             ease: "easeOut",
//           }}
//         >
//           <Heart 
//             className="fill-current" 
//             style={{ 
//               width: `${heart.size}px`, 
//               height: `${heart.size}px` 
//             }} 
//           />
//         </motion.div>
//       ))}
//     </div>
//   );
// };

// export default FloatingHearts;