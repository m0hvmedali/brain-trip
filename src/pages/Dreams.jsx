import React, { useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Heart, Plane, Home, Stars, GraduationCap, Star } from 'lucide-react'
import { Timeline, TimelineItem } from '../components/timeline'
import Header from '../components/header'
export default function DreamsPage() {
  const { scrollYProgress } = useScroll()
  const scale = useTransform(scrollYProgress, [0, 1], [0.5, 1.5])
  
  useEffect(() => {
    document.title = "Our future | our dreams"
  }, [])
  
  const dreams = [
    {
      year: "",
      title: "travel out",
      description: "نسافر ونطلع برا البلد دي ",
      icon: <Plane className="text-indigo-600 dark:text-indigo-400" />,
      color: "indigo"
    },
    {
      year: "",
      title: "Home ",
      description: "تعملي بيت دافي تحسي في بالامان مع راجل تطمني معاه",
      icon: <Home className="text-rose-600 dark:text-rose-400" />,
      color: "rose"
    },
    {
      year: "",
      title: "Marry",
      description: "اه بتقولي دايما مش عايزه تجوزي بس هتجوزي حد بيحبك وبيخاف عليكي زي مانت عايزه لانك تستاهلي ",
      icon: <Stars className="text-amber-600 dark:text-amber-400" />,
      color: "amber"
    },
    {
      year: "",
      title: "Study ",
      description: "تخلصي دراسه وتخلصي من التوتر اللي هيقتلك قريب ",
      icon: <GraduationCap className="text-emerald-600 dark:text-emerald-400" />,
      color: "emerald"
    },
    {
      year: "",
      title: "Work", 
      description: "وبعد ما تخلصي دراسه تبقي احلى دكنوره بيطريه",
      icon: <Star className="text-indigo-600 dark:text-indigo-400" />,
      color: "indigo"
    }
  ]

  return (
    <div className="overflow-hidden relative min-h-screen bg-gradient-to-b from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-indigo-900">
      <div className="absolute inset-0 opacity-30 bg-stars dark:opacity-10"></div>
      <Header/>
      <motion.div 
        className="fixed top-1/2 left-1/2 w-64 h-64 bg-yellow-400 rounded-full opacity-20 blur-3xl transform -translate-x-1/2 -translate-y-1/2"
        style={{ scale }}
      />
      
      <div className="container relative z-10 py-20 mx-auto">
        <motion.h1 
          className="mb-20 text-4xl font-bold text-center text-indigo-700 md:text-6xl dark:text-indigo-300"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Our future | our dreams
        </motion.h1>
        
        <Timeline>
          {dreams.map((dream, index) => (
            <TimelineItem 
              key={index}
              year={dream.year}
              title={dream.title}
              description={dream.description}
              icon={dream.icon}
              color={dream.color}
              delay={index * 0.2}
            />
          ))}
        </Timeline>
        
        <div className="py-16 mt-32 text-center border-t border-indigo-200 dark:border-indigo-700">
          <motion.h2 
            className="mb-4 text-3xl font-bold text-indigo-600 dark:text-indigo-300"
            animate={{ 
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity
            }}
          >
            ...To be continued
          </motion.h2>
          <p className="text-xl text-indigo-800 dark:text-indigo-200">
          Because I am sure that your dreams will grow
          </p>
        </div>
      </div>
    </div>
  )
}