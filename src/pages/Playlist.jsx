// src/pages/PlaylistPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, Heart } from 'lucide-react';

const songs = [
  {
    id: 1,
    title: "أغنية حبنا",
    artist: "فنان مميز",
    duration: "3:45",
    reason: "هذه الأغنية كانت تعزف في أول مرة اعترفنا فيها بحبنا",
    cover: "🎵"
  },
  {
    id: 2,
    title: "رحلة الحب",
    artist: "مغنية رومانسية",
    duration: "4:22",
    reason: "كنا نستمع لهذه الأغنية في أول رحلة سفر معًا",
    cover: "🎶"
  },
  {
    id: 3,
    title: "أنتِ حياتي",
    artist: "فنان مشهور",
    duration: "3:18",
    reason: "الكلمات تعبر تمامًا عن مشاعري تجاهك",
    cover: "🎧"
  },
  {
    id: 4,
    title: "ليلتنا",
    artist: "ثنائي رومانسي",
    duration: "5:01",
    reason: "ذكرتني بأول ليلة قضيناها نتحدث حتى الفجر",
    cover: "🎤"
  },
  {
    id: 5,
    title: "أحلامنا معًا",
    artist: "فرقة موسيقية",
    duration: "4:36",
    reason: "هذه الأغنية تلهمنا للتخطيط لمستقبلنا معًا",
    cover: "🎼"
  },
  {
    id: 6,
    title: "قلبي معك",
    artist: "مطرب مفضل",
    duration: "3:55",
    reason: "نستمع لها دائمًا عندما نشتاق لبعضنا",
    cover: "🎷"
  }
];

export default function PlaylistPage() {
  const [currentSong, setCurrentSong] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(progressInterval.current);
    }

    return () => clearInterval(progressInterval.current);
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentSong(prev => (prev < songs.length - 1 ? prev + 1 : 0));
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentSong(prev => (prev > 0 ? prev - 1 : songs.length - 1));
    setProgress(0);
  };

  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
  };

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const width = rect.width;
    const newProgress = Math.round((offsetX / width) * 100);
    setProgress(newProgress);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-100 dark:from-violet-900 dark:to-purple-900 p-4 relative overflow-hidden">
      <div className="max-w-4xl mx-auto py-12">
        <motion.h1 
          className="text-4xl font-bold text-center mb-12 text-violet-700 dark:text-violet-300"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          سجل حبنا الموسيقي
        </motion.h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* مشغل الموسيقى */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-8">
                <div className="bg-gradient-to-r from-violet-500 to-purple-500 w-24 h-24 rounded-xl flex items-center justify-center text-white text-4xl mr-6">
                  {songs[currentSong].cover}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-violet-700 dark:text-violet-300">
                    {songs[currentSong].title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">{songs[currentSong].artist}</p>
                  <p className="text-gray-500 dark:text-gray-500">{songs[currentSong].duration}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <div 
                  className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden cursor-pointer"
                  onClick={handleProgressClick}
                >
                  <motion.div 
                    className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
                    style={{ width: `${progress}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <span>{formatTime(progress)}</span>
                  <span>{songs[currentSong].duration}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-8 mb-8">
                <button onClick={handlePrev} className="text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300">
                  <SkipBack size={28} />
                </button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handlePlayPause}
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center text-white shadow-lg"
                >
                  {isPlaying ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" />}
                </motion.button>
                
                <button onClick={handleNext} className="text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300">
                  <SkipForward size={28} />
                </button>
              </div>
              
              <div className="flex items-center">
                <Volume2 className="text-violet-600 dark:text-violet-400 mr-3" />
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={volume} 
                  onChange={handleVolumeChange}
                  className="w-full accent-violet-600 dark:accent-violet-400"
                />
              </div>
            </div>
            
            <div className="bg-violet-50 dark:bg-violet-900/30 p-6">
              <h3 className="font-bold text-violet-700 dark:text-violet-300 mb-2 flex items-center">
                <Heart className="mr-2 text-rose-500" size={18} /> لماذا هذه الأغنية؟
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{songs[currentSong].reason}</p>
            </div>
          </div>
          
          {/* قائمة التشغيل */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white">
              <h2 className="text-xl font-bold flex items-center">
                <Music className="mr-2" /> قائمة أغانينا
              </h2>
            </div>
            
            <div className="overflow-y-auto max-h-[500px]">
              {songs.map((song, index) => (
                <motion.div
                  key={song.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer flex items-center ${
                    currentSong === index 
                      ? 'bg-violet-50 dark:bg-violet-900/30' 
                      : 'hover:bg-violet-50/50 dark:hover:bg-violet-900/10'
                  }`}
                  onClick={() => {
                    setCurrentSong(index);
                    setProgress(0);
                    setIsPlaying(true);
                  }}
                >
                  <div className="bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-800/30 dark:to-purple-800/30 w-12 h-12 rounded-lg flex items-center justify-center mr-4 text-violet-700 dark:text-violet-300">
                    {song.cover}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium truncate ${
                      currentSong === index 
                        ? 'text-violet-700 dark:text-violet-300' 
                        : 'text-gray-800 dark:text-gray-200'
                    }`}>
                      {song.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{song.artist}</p>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-500 mr-3">{song.duration}</span>
                    {currentSong === index && isPlaying && (
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                        }}
                        transition={{ 
                          duration: 0.8,
                          repeat: Infinity,
                        }}
                      >
                        <div className="w-2 h-2 rounded-full bg-violet-500"></div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="text-center mt-16">
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <div className="inline-block bg-gradient-to-r from-violet-600 to-purple-600 text-white px-8 py-4 rounded-full">
              <span className="text-lg font-bold">الموسيقى التي تصف رحلتنا معًا</span>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* تأثيرات الموجات الصوتية */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bottom-0 w-2 bg-violet-400 dark:bg-purple-500 rounded-t-lg"
          style={{
            left: `${5 + i * 8}%`,
            height: `${Math.random() * 100 + 20}px`,
          }}
          animate={{
            height: [
              `${Math.random() * 100 + 20}px`,
              `${Math.random() * 80 + 40}px`,
              `${Math.random() * 120 + 10}px`,
            ],
          }}
          transition={{
            duration: 1.5 + Math.random(),
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  );
}

// دالة مساعدة لتنسيق الوقت
function formatTime(progress) {
  const totalSeconds = (progress / 100) * 300; // نفترض أن الأغنية 5 دقائق
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}