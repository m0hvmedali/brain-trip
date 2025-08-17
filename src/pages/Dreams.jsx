import React, { useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Heart, Plane, Home, Stars, GraduationCap, Star } from 'lucide-react'
import { Timeline, TimelineItem } from '../components/timeline'
import Header from '../components/header'
export default function DreamsPage() {
  const { scrollYProgress } = useScroll()
  const scale = useTransform(scrollYProgress, [0, 1], [0.5, 1.5])
  
  useEffect(() => {
    document.title = "أحلامنا ومستقبلنا | رحلة الحب"
  }, [])
  
  const dreams = [
    {
      year: "2023",
      title: "رحلة إلى جبال الألب",
      description: "سنقضي أسبوعًا بين الجبال الخلابة والبحيرات الزرقاء",
      icon: <Plane className="text-indigo-600 dark:text-indigo-400" />,
      color: "indigo"
    },
    {
      year: "2024",
      title: "شراء منزلنا الأول",
      description: "منزل صغير بحديقة حيث يمكننا زراعة الورود",
      icon: <Home className="text-rose-600 dark:text-rose-400" />,
      color: "rose"
    },
    {
      year: "2025",
      title: "الزواج",
      description: "يومنا الخاص حيث نبدأ رحلتنا معًا رسميًا",
      icon: <Stars className="text-amber-600 dark:text-amber-400" />,
      color: "amber"
    },
    {
      year: "2026",
      title: "إكمال الدراسات العليا",
      description: "دعم بعضنا البعض في تحقيق الأهداف الأكاديمية",
      icon: <GraduationCap className="text-emerald-600 dark:text-emerald-400" />,
      color: "emerald"
    },
    {
      year: "2027",
      title: "رحلة حول العالم",
      description: "زيارة 10 دول لنكتشف العالم معًا",
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
          أحلامنا ومستقبلنا معًا
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
            ...يُـتـبـع
          </motion.h2>
          <p className="text-xl text-indigo-800 dark:text-indigo-200">
            لأن مستقبلنا معًا سيحمل المزيد من الأحلام الجميلة
          </p>
        </div>
      </div>
    </div>
  )
}