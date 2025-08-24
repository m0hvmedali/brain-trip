import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Users, Heart, Target, BrainCircuit, ArrowLeft, Send, ArrowDown, ArrowUp } from 'lucide-react';

// استيراد "العقل" الجديد من ملف الخدمات
import { getSmartResponse } from "../services1/memoryService.jsx";

const ChatInterface = ({ onBackClick }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'مرحباً محمد! أنا ذاكرتك الثانية. اسألني عن أي شخص، حدث، أو شعور لأساعدك على استكشافه.',
      timestamp: new Date()
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const messagesContainerRef = useRef(null); // مرجع جديد لحاوية الرسائل

  // refs for click / long-press handling
  const upClickTimeoutRef = useRef(null);
  const downClickTimeoutRef = useRef(null);
  const upLongPressTimerRef = useRef(null);
  const downLongPressTimerRef = useRef(null);
  const upLongPressActiveRef = useRef(false);
  const downLongPressActiveRef = useRef(false);

  // التمرير للأسفل تلقائيًا عند وصول رسالة جديدة
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // التركيز على حقل الإدخال عند تحميل المكون
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // تنظيف التايمرات عند فك المكون
  useEffect(() => {
    return () => {
      if (upClickTimeoutRef.current) clearTimeout(upClickTimeoutRef.current);
      if (downClickTimeoutRef.current) clearTimeout(downClickTimeoutRef.current);
      if (upLongPressTimerRef.current) clearTimeout(upLongPressTimerRef.current);
      if (downLongPressTimerRef.current) clearTimeout(downLongPressTimerRef.current);
    };
  }, []);

  // **الإجراءات السريعة الآن تدعم رد ثابت** (response)
  const quickActions = [
    { label: <><User className="inline ml-1 w-4 h-4" /> تكلم عن شخصيتي</>, query: 'تكلم عن شخصيتي', response: 'أنت شخص حساس ومبدع، تهتم بالتفاصيل وتحب مساعدة الآخرين. تملك شغفاً بالتعلم والتطوير الذاتي.' },
    { label: <><Heart className="inline ml-1 w-4 h-4" /> ما هي علاقتي برحمه؟</>, query: 'ما هي علاقتي برحمه محمد؟', response: 'علاقتك برحمه تبدو حنونة ومستقرة؛ تشعر بالراحة معها وتبادلها اهتمامك ودعمك.' },
    { label: <><Users className="inline ml-1 w-4 h-4" /> كلمني عن انجي</>, query: 'تكلم عن انجي', response: 'انجي شخصية ودودة ومحبة، تميل للتفكير العملي وتحب أن تكون جزءاً من المشاريع الجماعية.' },
    { label: <><Target className="inline ml-1 w-4 h-4" /> ما هي أهدافي؟</>, query: 'ما هي أهدافي؟', response: 'أهدافك تشمل التطور المهني، بناء علاقات أعمق، وتحقيق توازن صحي بين العمل والحياة.' },
  ];

  // دالة إرسال الرسائل (للمستخدم اليدوي)
  const handleSendMessage = async (query) => {
    const messageToSend = query || inputValue;
    if (!messageToSend.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    // always clear input after sending (works for manual sends)
    setInputValue('');
    inputRef.current?.focus();

    setIsTyping(true);

    // محاكاة استدعاء العقل والتفكير (يتم فقط للرسائل اليدوية)
    setTimeout(() => {
      const botResponseContent = getSmartResponse(messageToSend);

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponseContent,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  // دالة خاصة بالإجراءات السريعة: ترسل رسالة المستخدم ثم تضيف رد ثابت (بدون استدعاء العقل)
  const handleQuickAction = (action) => {
    if (!action || !action.query) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: action.query,
      timestamp: new Date()
    };

    // نُضيف رسالة المستخدم أولا
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    inputRef.current?.focus();

    // نُحاكي لحظة تفكير قصيرة ثم نضيف الرد الثابت
    setIsTyping(true);
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: action.response ?? 'هذا رد ثابت على الإجراء.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 300); // وقت قصير ليشعر المستخدم بتفاعل
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ---------- New scrolling helpers ----------
  const SMALL_SCROLL = 120; // كمية التمرير عند كل نقرة مفردة (بالبكسل)
  const DOUBLE_CLICK_MS = 250; // نافذة التمييز للنقر المزدوج
  const LONG_PRESS_MS = 500; // مدة الضغط المستمر لتفعيل القفزة

  const scrollByAmount = (amount) => {
    const c = messagesContainerRef.current;
    if (!c) return;
    c.scrollBy({ top: amount, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    const c = messagesContainerRef.current;
    if (!c) return;
    c.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    const c = messagesContainerRef.current;
    if (!c) return;
    c.scrollTo({ top: c.scrollHeight - c.clientHeight, behavior: 'smooth' });
  };

  // Up button handlers
  const handleUpClick = () => {
    // detect double click using timeout
    if (upClickTimeoutRef.current) {
      clearTimeout(upClickTimeoutRef.current);
      upClickTimeoutRef.current = null;
      // double click -> jump to top
      scrollToTop();
      return;
    }

    upClickTimeoutRef.current = setTimeout(() => {
      // single click -> small scroll up
      scrollByAmount(-SMALL_SCROLL);
      upClickTimeoutRef.current = null;
    }, DOUBLE_CLICK_MS);
  };

  const handleUpMouseDown = (e) => {
    // prevent text selection on long press
    e.preventDefault?.();
    // start long-press timer
    upLongPressActiveRef.current = false;
    if (upLongPressTimerRef.current) clearTimeout(upLongPressTimerRef.current);
    upLongPressTimerRef.current = setTimeout(() => {
      upLongPressActiveRef.current = true;
      scrollToTop();
    }, LONG_PRESS_MS);
  };

  const handleUpMouseUp = () => {
    // cancel long-press timer
    if (upLongPressTimerRef.current) {
      clearTimeout(upLongPressTimerRef.current);
      upLongPressTimerRef.current = null;
    }
  };

  // Down button handlers
  const handleDownClick = () => {
    if (downClickTimeoutRef.current) {
      clearTimeout(downClickTimeoutRef.current);
      downClickTimeoutRef.current = null;
      // double click -> jump to bottom
      scrollToBottom();
      return;
    }

    downClickTimeoutRef.current = setTimeout(() => {
      // single click -> small scroll down
      scrollByAmount(SMALL_SCROLL);
      downClickTimeoutRef.current = null;
    }, DOUBLE_CLICK_MS);
  };

  const handleDownMouseDown = (e) => {
    e.preventDefault?.();
    downLongPressActiveRef.current = false;
    if (downLongPressTimerRef.current) clearTimeout(downLongPressTimerRef.current);
    downLongPressTimerRef.current = setTimeout(() => {
      downLongPressActiveRef.current = true;
      scrollToBottom();
    }, LONG_PRESS_MS);
  };

  const handleDownMouseUp = () => {
    if (downLongPressTimerRef.current) {
      clearTimeout(downLongPressTimerRef.current);
      downLongPressTimerRef.current = null;
    }
  };

  // ---------- end scrolling helpers ----------

  return (
    <div className="flex relative flex-col h-screen font-sans text-white">
      {/* خلفية متحركة */}
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: "url('/robot_guide_reference.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>

      {/* طبقة التعتيم عشان الكلام يبان */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* المحتوى */}
      <div className="flex relative flex-col h-full">
        {/* الهيدر */}
        <div className="flex justify-between items-center p-4 border-b backdrop-blur-sm border-cyan-500/20 bg-black/40">
          <button
            onClick={onBackClick}
            type="button"
            className="text-cyan-400 transition-colors hover:text-cyan-300"
          >
            <ArrowLeft/>
          </button>
          <div className="text-center">
            <h2 className="flex gap-2 items-center text-lg font-bold text-cyan-400">
              <BrainCircuit size={20} />
              مرشد الذكريات
            </h2>
            <p className="text-xs text-cyan-300/70">متصل بذاكرتك العميقة</p>
          </div>
          <div className="w-16"></div>
        </div>

        {/* الرسائل مع إضافة المرجع الجديد */}
        <div 
          ref={messagesContainerRef}
          className="overflow-y-auto flex-1 p-4 space-y-6 md:p-6"
        >
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-end gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'bot' && <div className="overflow-hidden flex-shrink-0 w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full"></div>}
                <div className={`max-w-md lg:max-w-lg rounded-2xl p-3 text-sm md:text-base ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-lg' 
                    : 'bg-gray-800/90 text-gray-200 border border-gray-700 rounded-bl-lg'
                }`}>
                  <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs opacity-60 mt-2 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                    {message.timestamp.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-2 justify-start items-end"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full"></div>
              <div className="p-4 rounded-2xl rounded-bl-lg border border-gray-700 bg-gray-800/90">
                <div className="flex space-x-1.5" style={{ direction: 'ltr' }}>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* أزرار التمرير - single click = خطوة صغيرة, double click أو ضغط مستمر = إلى الأعلى/الأسفل */}
        <div className="flex absolute right-4 bottom-32 z-50 flex-col gap-3">
          <button
            onClick={handleUpClick}
            onDoubleClick={(e) => { e.preventDefault(); /* handled by click timer logic */ }}
            onMouseDown={handleUpMouseDown}
            onMouseUp={handleUpMouseUp}
            onMouseLeave={handleUpMouseUp}
            onTouchStart={handleUpMouseDown}
            onTouchEnd={handleUpMouseUp}
            type="button"
            className="p-2 text-cyan-400 rounded-full border shadow-lg backdrop-blur-sm transition-colors bg-black/40 border-cyan-500/20 hover:text-cyan-300"
            title="نقرة: تمرير صغير لأعلى — نقرتان أو ضغط مستمر: انتقل للأعلى"
            aria-label="تمرير لأعلى"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
          <button
            onClick={handleDownClick}
            onDoubleClick={(e) => { e.preventDefault(); /* handled by click timer logic */ }}
            onMouseDown={handleDownMouseDown}
            onMouseUp={handleDownMouseUp}
            onMouseLeave={handleDownMouseUp}
            onTouchStart={handleDownMouseDown}
            onTouchEnd={handleDownMouseUp}
            type="button"
            className="p-2 text-cyan-400 rounded-full border shadow-lg backdrop-blur-sm transition-colors bg-black/40 border-cyan-500/20 hover:text-cyan-300"
            title="نقرة: تمرير صغير لأسفل — نقرتان أو ضغط مستمر: انتقل للأسفل"
            aria-label="تمرير لأسفل"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
        </div>

        {/* إدخال الرسائل + الأكشنات */}
        <div className="p-4 border-t backdrop-blur-sm bg-black/40 border-cyan-500/20">
          {/* الأكشنات السريعة */}
          <div className="flex flex-wrap gap-2 justify-center mb-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleQuickAction(action)}
                className="bg-gray-800/70 border border-gray-700 text-cyan-200 px-3 py-1.5 rounded-full text-xs hover:bg-gray-700 hover:border-cyan-600 transition-all"
              >
                {action.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2 items-center">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="اسأل عن ذكرى، شخص، أو شعور..."
              className="px-4 py-2 w-full placeholder-gray-500 text-gray-100 rounded-xl border border-gray-700 transition-all resize-none bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              rows="1"
            />
            <button
              onClick={() => handleSendMessage()}
              type="button"
              disabled={!inputValue.trim() || isTyping}
              className="px-5 py-2 font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl transition-all duration-300 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed"
            >
              <Send/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
