import React from 'react';
import { motion } from 'framer-motion'
import { Bell, Settings, Moon, Sun } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import {useStore} from '../store/useStore'


export default function Header() {
    const { 
        darkMode, 
        setDarkMode }
      = useStore()
      return( <header className="fixed top-0 left-0 z-50 w-full border-b border-gray-200 backdrop-blur-md bg-white/80 dark:bg-black/90 dark:border-gray-700">
        <div className="container flex justify-between items-center px-4 py-3 mx-auto">
          {/* العنوان */}
          <motion.h1 
            className="text-2xl font-bold text-rose-700 dark:text-pink-300"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 15 }}
          >
Fav Nana
          </motion.h1>

          {/* الأيقونات */}
          <div className="flex gap-4 items-center text-gray-700 dark:text-gray-300">
          <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-3 rounded-full transition hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label={darkMode ? "التحويل إلى الوضع الفاتح" : "التحويل إلى الوضع الداكن"}
        >
          {darkMode ? <Moon size={24} /> : <Sun size={24} />}
        </button>
            <button className="p-2 rounded-full transition hover:bg-gray-100 dark:hover:bg-gray-800">
  <NavLink to="/settings">
    <Settings size={22} />
  </NavLink>
</button>
          </div>
        </div>
      </header>)
}