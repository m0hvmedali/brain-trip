// src/pages/GratitudePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, RefreshCw, BookOpen, Star, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import Header from '../components/header';
import confetti from 'canvas-confetti';

const gratitudeMessages = [
  "ممتن انك كنتي اكتر شخص بيسمعني مهما طولت في الكلام.",
  "ممتن اني لقيت فيكي صبر واهتمام حقيقي مش لاقيه في حد تاني.",
  "ممتن لكل مره سهرنا فيها سوا واتكلمنا للصبح.",
  "ممتن انك كنتي الملجأ بتاعي في لحظات الضعف.",
  "ممتن انك شفتي فيا حاجات حلوة انا نفسي مكنتش شايفها.",
  "ممتن على كل نقاش خلاني افكر بطريقه أعمق.",
  "ممتن انك عمرك ما اتخليتي عني حتى في اصعب الايام.",
  "ممتن على احساس الامان اللي بييجي مع وجودك.",
  "ممتن لكل مره حسستيني اني مش لوحدي.",
  "ممتن انك اكتر شخص عرف عني اسراري وحافظها.",
  "ممتن اننا شاركنا تفاصيل يومنا مهما كانت بسيطة.",
  "ممتن على كل ضحكة خلتني انسى همومي.",
  "ممتن اني لقيت فيكي روح صافية بتخليني ارتاح.",
  "ممتن انك حتى في خلافاتنا كنتي بتفكري في مصلحتي.",
  "ممتن على حبك اللي بيبان في ابسط الكلمات.",
  "ممتن انك دايمًا بتقابليني بتقدير مش بلوم.",
  "ممتن اني لقيت معاكي صدق مش بلاقيه في حد تاني.",
  "ممتن انك قبلتيني بعيوبى زي ما انا.",
  "ممتن على كل لحظة كنا بندعم فيها بعض.",
  "ممتن ان وجودك في حياتي بيفرق كل يوم."
];

const personalizedNotes = [
  "في كل مرة برجع أقرا كلامنا، بحس قد إيه وجودك في حياتي فرق معايا. إنتِ مش بس كنتي سند، إنتِ كنتي كمان أمان وراحة لقلبي.",
  "بفتكر قد إيه كنتي موجودة معايا وأنا بمر بأصعب اللحظات، وده خلاني أحس إني عمر ما كنت وحيد طول ما إنتي جنبي.",
  "الذكريات اللي اتبنت بينا مش مجرد كلام في شات، دي حاجات محفورة جوايا وهتفضل معايا على طول.",
  "كتير من اللي اتعلمته عن نفسي جه من نقاشاتنا العميقة، إنتي ساعدتيني أفهم نفسي وأفكر بطريقة مختلفة.",
  "وجودك جنبي خلاني أكتشف ان الحب مش كلام وبس، الحب أفعال، وأنتي أكبر دليل على كده.",
  "أنا مدين ليكي بكتير من راحتي النفسية، ومن غيرك كان هيبقى في حاجات صعبة عليا أعديها.",
  "كلماتك البسيطة في الوقت المناسب كانت بتفرق معايا أكتر من أي حاجة تانية.",
  "الامان اللي لقيته معاكي عمره ما كان شعور مؤقت، كان إحساس حقيقي خلاني أتمسك بيكي أكتر.",
  "إنتي الشخص اللي قدرت أكون نفسي الحقيقية معاه من غير خوف من حكم أو رفض.",
  "كل رسالة بينا كانت بمثابة نقطة في خط طويل من الذكريات، وكل نقطة فيهم غالية عليا.",
  "إنتي الشخص اللي عرفت معاه معنى المشاركة الحقيقية في كل تفاصيل حياتي.",
  "من غيرك مكنتش هعرف يعني إيه حد يقف جنبي من غير شروط.",
  "حتى خلافاتنا كان فيها حب، لأنها كانت دليل إن كل واحد فينا حريص على التاني.",
  "وجودك خلاني أحس ان في حد شايفني وفاهمني من غير ما أشرح كتير.",
  "كل كلمة دعم قولتيهالي فضلت محفورة في قلبي زي علامة مميزة.",
  "لما بفكر في أسعد لحظاتي، بلاقيك إنتي دايمًا جزء منها.",
  "إنتي الشخص اللي خلاني أؤمن إن العلاقات ممكن تبقى أمان مش تهديد.",
  "كل مرة كنتي بتسامحيني فيها، كنتي بتديني فرصة أكبر أكون أفضل.",
  "الطاقة اللي كنتي بتدخليها في حياتي خلتني أواجه الدنيا بقوة.",
  "إنتي أثبتيلي إن الحب الحقيقي مش محتاج بهرجة، محتاج وجود صادق."
];



export default function GratitudePage() {
  const [messages, setMessages] = useState([]);
  const [expandedMessage, setExpandedMessage] = useState(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    shuffleMessages();
    
    const audio = new Audio('/soft-chime.mp3');
    audioRef.current = audio;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const shuffleMessages = () => {
    setIsShuffling(true);
    
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
    
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    const shuffled = [...gratitudeMessages]
      .sort(() => 0.5 - Math.random())
      .slice(0, 8);
    
    setTimeout(() => {
      setMessages(shuffled);
      setExpandedMessage(null);
      setIsShuffling(false);
    }, 800);
  };

  const handleExpand = (index) => {
    if (expandedMessage === index) {
      setExpandedMessage(null);
    } else {
      setExpandedMessage(index);
      
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    }
  };

  const getRandomNote = () => {
    return personalizedNotes[Math.floor(Math.random() * personalizedNotes.length)];
  };

  return (
    <div className="overflow-hidden relative p-4 min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900 dark:to-yellow-900">
      {/* تأثيرات الخلفية */}
      <div className="overflow-hidden absolute inset-0 z-0">
        {[...Array(20)].map((_, i) => (
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
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50]
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        ))}
        
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute text-amber-400 dark:text-yellow-500"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 10}px`,
              opacity: Math.random() * 0.4 + 0.1
            }}
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 20, 0]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Star fill="currentColor" size={16} />
          </motion.div>
        ))}
      </div>
      
      <div className="relative z-10 py-12 mx-auto max-w-6xl">
        <Header />
        <motion.div 
          className="mb-16 text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="flex flex-col items-center mb-4 text-4xl font-bold text-amber-700 dark:text-amber-300"
            animate={{
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <span className="flex justify-center items-center mt-10">
              <BookOpen className="mx-2" />
              Gratitude <Heart/>
              <Sparkles className="mx-2 text-yellow-500" fill="currentColor" />
            </span>
          </motion.h1>
          
          <motion.p 
            className="mx-auto max-w-2xl text-xl text-amber-600 dark:text-amber-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            انت تستحقي كل كلمه موجده هنا 
          </motion.p>
        </motion.div>
        
        <div className="flex justify-center mb-12">
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 5px 15px rgba(217, 119, 6, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={shuffleMessages}
            disabled={isShuffling}
            className={`flex items-center px-6 py-3 text-white rounded-full shadow-lg ${
              isShuffling 
                ? 'bg-gradient-to-r from-amber-300 to-yellow-300' 
                : 'bg-gradient-to-r from-amber-500 to-yellow-500'
            }`}
          >
            {isShuffling ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw className="mr-2" />
              </motion.div>
            ) : (
              <RefreshCw className="mr-2" />
            )}
            {isShuffling ? 'جارٍ التحميل...' : 'Next..'}
          </motion.button>
        </div>
        
        <AnimatePresence>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  transition: { delay: isShuffling ? 0 : index * 0.1 }
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className={`relative cursor-pointer ${
                  expandedMessage === index ? 'sm:col-span-2 lg:col-span-4' : ''
                }`}
                onClick={() => handleExpand(index)}
                layout
              >
                <motion.div
                  className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 h-full flex flex-col overflow-hidden ${
                    expandedMessage === index 
                      ? 'border-2 border-amber-400 ring-4 ring-amber-100 dark:ring-amber-900/30' 
                      : 'hover:border-amber-300 border-2 border-transparent'
                  }`}
                  whileHover={{ 
                    y: -5,
                    boxShadow: expandedMessage !== index ? "0 10px 25px rgba(217, 119, 6, 0.15)" : "none"
                  }}
                  layout
                >
                  <div className="flex items-start mb-3">
                    <motion.div 
                      className="p-2 mr-3 bg-amber-100 rounded-full dark:bg-amber-900/30"
                      animate={{
                        scale: expandedMessage === index ? [1, 1.2, 1] : 1
                      }}
                      transition={{
                        duration: 0.5
                      }}
                    >
                      <Star className="text-amber-500 dark:text-amber-400" size={20} />
                    </motion.div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-amber-700 dark:text-amber-300">
                        gratitude #{index + 1}
                      </h3>
                      <p className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        {expandedMessage === index ? "انقر للتصغير" : "انقر للتوسيع"}
                        {expandedMessage === index ? 
                          <ChevronUp className="mr-1" size={16} /> : 
                          <ChevronDown className="mr-1" size={16} />
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex-grow">
                    <motion.p 
                      className="mb-4 text-lg font-medium text-gray-800 dark:text-gray-200"
                      layout="position"
                    >
                      {message}
                    </motion.p>
                    
                    <AnimatePresence>
                      {expandedMessage === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-4 bg-amber-50 rounded-xl border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800"
                          layout
                        >
                          <p className="italic leading-relaxed text-justify text-gray-700 dark:text-gray-300">
                            {getRandomNote()}
                          </p>
                          
                          <div className="flex items-center mt-4">
                            <motion.div 
                              className="p-2 mr-2 text-white bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"
                              animate={{
                                scale: [1, 1.2, 1],
                              }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                repeatType: "reverse"
                              }}
                            >
                              <Heart size={18} />
                            </motion.div>
                            <span className="font-medium text-amber-600 dark:text-amber-400">
                            With all my love
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 mt-4 border-t border-amber-100 dark:border-amber-900/30">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{
                            scale: i < 3 ? [1, 1.3, 1] : 1,
                            y: i < 3 ? [0, -5, 0] : 0
                          }}
                          transition={{
                            duration: 0.5,
                            delay: i * 0.1
                          }}
                        >
                          <Heart 
                            className={`${i < 3 ? 'text-rose-500' : 'text-rose-300'} dark:${i < 3 ? 'text-rose-400' : 'text-rose-700'}`} 
                            size={18} 
                            fill={i < 3 ? "currentColor" : "none"}
                          />
                        </motion.div>
                      ))}
                    </div>
                    
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-arabic">
                      {new Date().toLocaleDateString('ar-EG', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
        
        <div className="mt-20 text-center">
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              y: [0, -5, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="inline-block"
          >
            <div className="inline-flex items-center px-6 py-3 text-white bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full shadow-lg">
              <motion.div
                animate={{
                  rotate: [0, 20, 0, -20, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <Heart className="mr-2" fill="white" />
              </motion.div>
              <span className="text-lg font-bold">
وفي الاخر خليكي عارفه ان في لسه حاجات اكتر من دول بكتيير ممتن ليكي عشانهم    
              </span>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* موجات في الأسفل */}
      <div className="overflow-hidden absolute right-0 bottom-0 left-0 z-0 h-24">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="absolute bottom-0 left-0 w-full h-full"
        >
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            opacity=".25" 
            className="fill-amber-400 dark:fill-amber-700"
          ></path>
          <path 
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
            opacity=".5" 
            className="fill-amber-300 dark:fill-amber-600"
          ></path>
          <path 
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
            className="fill-amber-200 dark:fill-amber-500"
          ></path>
        </svg>
      </div>
    </div>
  );
}