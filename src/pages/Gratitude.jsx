// src/pages/GratitudePage.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, RefreshCw, BookOpen, Star } from 'lucide-react';
import Header from '../components/header';
const gratitudeMessages = [
  "لابتسامتك التي تضيء يومي",
  "لصبرك على أخطائي",
  "لقلبك الطيب الذي يحب بلا حدود",
  "لدعمك لي في أصعب الأوقات",
  "لمساعدتك لي أن أصبح شخصًا أفضل",
  "لضحكتك التي تملأ قلبي سعادة",
  "لحنانك الذي يشعرني بالأمان",
  "لتفهمك لمشاعري دائمًا",
  "لروحك المرحة التي تجعل الحياة أجمل",
  "لوجودك في حياتي الذي هو أعظم هدية",
  "لمساعدتك لي في تحقيق أحلامي",
  "لصدقك الذي لا يتزعزع",
  "لحضنك الدافئ الذي يشعرني بالراحة",
  "لمواقفك الشجاعة في الأوقات الصعبة",
  "لتفانيك في جعلنا سعداء دائمًا"
];

export default function GratitudePage() {
  const [messages, setMessages] = useState(gratitudeMessages.slice(0, 8));
  const [expandedMessage, setExpandedMessage] = useState(null);

  const shuffleMessages = () => {
    // خلط عشوائي للرسائل
    const shuffled = [...gratitudeMessages]
      .sort(() => 0.5 - Math.random())
      .slice(0, 8);
    
    setMessages(shuffled);
    setExpandedMessage(null);
  };

  const handleExpand = (index) => {
    setExpandedMessage(expandedMessage === index ? null : index);
  };

  return (
    <div className="overflow-hidden relative p-4 min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900 dark:to-yellow-900">
      <div className="py-12 mx-auto max-w-6xl">
        <Header />
        <motion.h1 
          className="flex flex-col items-center mb-12 text-4xl font-bold text-center text-amber-700 dark:text-amber-300"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="flex items-center">
            كتاب امتناني 
            <BookOpen className="mx-2" />
          </span>
          <span className="mt-2 text-xl font-normal text-amber-600 dark:text-amber-400">
            كل الأشياء الصغيرة والكبيرة التي أشكرك عليها
          </span>
        </motion.h1>
        
        <div className="flex justify-center mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={shuffleMessages}
            className="flex items-center px-6 py-3 text-white bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full shadow-lg"
          >
            <RefreshCw className="mr-2" />
            ملاحظات جديدة
          </motion.button>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`relative cursor-pointer ${
                expandedMessage === index ? 'sm:col-span-2 lg:col-span-4' : ''
              }`}
              onClick={() => handleExpand(index)}
            >
              <motion.div
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 h-full flex flex-col ${
                  expandedMessage === index 
                    ? 'border-2 border-amber-400' 
                    : 'hover:border-amber-300 border-2 border-transparent'
                }`}
                whileHover={{ y: -5 }}
                layout
              >
                <div className="flex items-start mb-3">
                  <div className="p-2 mr-3 bg-amber-100 rounded-full dark:bg-amber-900/30">
                    <Star className="text-amber-500 dark:text-amber-400" size={20} />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-amber-700 dark:text-amber-300">
                      سبب للامتنان #{index + 1}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {expandedMessage === index ? "انقر للتصغير" : "انقر للتوسيع"}
                    </p>
                  </div>
                </div>
                
                <div className="flex-grow">
                  <p className="mb-4 text-gray-800 dark:text-gray-200">
                    {message}
                  </p>
                  
                  {expandedMessage === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-4 bg-amber-50 rounded-xl border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800"
                    >
                      <p className="italic text-gray-700 dark:text-gray-300">
                        "هذا الشيء الذي تفعليه يجعلني أشعر بأنني محظوظ جدًا لوجودك في حياتي. 
                        أريدك أن تعرفي كم أقدر هذا منك، وكم يعني لي أنك دائمًا موجودة لدعمي وحبي. 
                        شكرًا لأنك أنتِ."
                      </p>
                      
                      <div className="flex items-center mt-4">
                        <div className="p-1 mr-2 text-white bg-amber-500 rounded-full">
                          <Heart size={16} />
                        </div>
                        <span className="font-medium text-amber-600 dark:text-amber-400">
                          مع كل حبي وتقديري
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <div className="flex">
                    {[...Array(3)].map((_, i) => (
                      <Heart 
                        key={i} 
                        className="text-rose-400 dark:text-rose-500" 
                        size={18} 
                        fill={i < 2 ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                  
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date().toLocaleDateString('ar-EG')}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="inline-block"
          >
            <div className="inline-flex items-center px-8 py-4 text-white bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full">
              <Heart className="mr-2" fill="white" />
              <span className="text-lg font-bold">هناك الآلاف من الأسباب الأخرى التي تجعلني ممتنًا لوجودك في حياتي</span>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* تأثيرات الخلفية */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-amber-300/20 dark:bg-yellow-400/10"
          style={{
            width: `${Math.random() * 100 + 20}px`,
            height: `${Math.random() * 100 + 20}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}