// src/components/timeline/TimelineItem.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const TimelineItem = ({ 
  year, 
  title, 
  description, 
  position = 'left', 
  delay = 0,
  icon,
  color = 'indigo'
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const isLeft = position === 'left';
  const colors = {
    indigo: {
      bg: 'bg-indigo-100 dark:bg-indigo-900/50',
      text: 'text-indigo-700 dark:text-indigo-300',
      border: 'border-indigo-300 dark:border-indigo-700'
    },
    rose: {
      bg: 'bg-rose-100 dark:bg-rose-900/50',
      text: 'text-rose-700 dark:text-rose-300',
      border: 'border-rose-300 dark:border-rose-700'
    },
    amber: {
      bg: 'bg-amber-100 dark:bg-amber-900/50',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-300 dark:border-amber-700'
    },
    emerald: {
      bg: 'bg-emerald-100 dark:bg-emerald-900/50',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-300 dark:border-emerald-700'
    }
  };
  
  const selectedColor = colors[color] || colors.indigo;
  
  return (
    <div 
      ref={ref}
      className={`flex ${isLeft ? 'flex-row' : 'flex-row-reverse'} items-center justify-between`}
    >
      {/* المحتوى */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -100 : 100 }}
        animate={inView ? { 
          opacity: 1, 
          x: 0,
          transition: { 
            duration: 0.6, 
            delay,
            type: 'spring', 
            damping: 15 
          }
        } : {}}
        className={`w-full md:w-1/2 p-6 rounded-2xl shadow-lg ${selectedColor.bg} ${selectedColor.border} border-2`}
      >
        <div className="flex items-center mb-3">
          {icon && (
            <div className={`mr-3 p-2 rounded-full ${selectedColor.bg}`}>
              {icon}
            </div>
          )}
          <div className={`text-lg font-bold ${selectedColor.text}`}>
            {year}
          </div>
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-3">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          {description}
        </p>
      </motion.div>
      
      {/* النقطة على الخط */}
      <div className="relative flex-shrink-0 w-16 h-16 rounded-full bg-white dark:bg-gray-800 border-4 border-indigo-500 dark:border-indigo-400 shadow-lg flex items-center justify-center z-10">
        <motion.div 
          className="absolute inset-0 rounded-full bg-indigo-400 dark:bg-indigo-600"
          animate={inView ? { 
            scale: [1, 1.5, 1],
            opacity: [0.7, 1, 0.7]
          } : {}}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            delay
          }}
        />
        <div className="w-4 h-4 rounded-full bg-indigo-600 dark:bg-indigo-400"></div>
      </div>
      
      {/* مساحة فارغة في الجانب الآخر */}
      <div className="hidden md:block w-1/2"></div>
    </div>
  );
};

export default TimelineItem;