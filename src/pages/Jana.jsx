import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Sparkles } from 'lucide-react'

export default function JanaPage() {
  useEffect(() => {
    document.title = "جانا | رحلة الحب"
  }, [])

  return (
    <div className="flex overflow-hidden relative justify-center items-center min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 dark:from-purple-900 dark:to-pink-900">
      
      <div className="z-10 p-8 max-w-4xl text-center">
        <motion.h1 
          className="mb-8 text-7xl font-bold md:text-9xl gradient-text"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, type: "spring" }}
        >
          جانا
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="p-8 rounded-2xl shadow-xl backdrop-blur-sm bg-white/80 dark:bg-gray-900/80"
        >
          <p className="mb-6 text-xl leading-relaxed text-gray-800 md:text-2xl dark:text-gray-200">
            هذه الصفحة مخصصة فقط لكِ، لأنكِ تستحقين كل التميز في العالم. 
            من لحظة دخولك حياتي، أصبح كل شيء أجمل وأكثر معنى. 
            شكرًا لأنكِ أنتِ، شكرًا على كل ضحكة، كل نظرة، وكل لحظة نقضيها معًا.
          </p>
          
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="inline-block"
          >
            <Sparkles size={48} className="text-yellow-400 fill-current" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}