// src/components/timeline/Timeline.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Timeline = ({ children }) => {
  return (
    <div className="relative py-12">
      {/* الخط العمودي في المنتصف */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-indigo-200 dark:bg-indigo-800 transform -translate-x-1/2"></div>
      
      <div className="relative space-y-24">
        {React.Children.map(children, (child, index) => {
          // إضافة تأثيرات مختلفة لكل عنصر بناءً على موقعه
          const isEven = index % 2 === 0;
          
          return React.cloneElement(child, {
            position: isEven ? 'left' : 'right',
            delay: index * 0.2,
            ...child.props
          });
        })}
      </div>
    </div>
  );
};

export default Timeline;