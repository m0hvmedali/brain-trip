import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Users, Heart, Target, BrainCircuit, ArrowLeft, Send, ArrowDown, ArrowUp, Brain, BookOpen, Shield, Sparkles } from 'lucide-react';

// استيراد "العقل" الجديد من ملف الخدمات
import { getSmartResponse, SmartResponseComponent } from "../services1/memoryService.jsx";

const ChatInterface = ({ onBackClick }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'هنا يمكنك العثور على اي شئ مر به محمد واي شخص عرفه تحتاج فقط ان تعرف كيف تكتب لتستطيع استخدام البوت',  
      timestamp: new Date()
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false); // جديد للتحكم في ظهور الأزرار

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // التمرير للأسفل تلقائيًا عند وصول رسالة جديدة
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    checkScrollable();
  }, [messages]);

  // التركيز على حقل الإدخال عند تحميل المكون
  useEffect(() => {
    inputRef.current?.focus();
    checkScrollable();
    window.addEventListener("resize", checkScrollable);
    return () => window.removeEventListener("resize", checkScrollable);
  }, []);

  const checkScrollable = () => {
    const c = messagesContainerRef.current;
    if (!c) return;
    setIsScrollable(c.scrollHeight > c.clientHeight);
  };

  // دالة إرسال الرسائل
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
    setInputValue('');
    inputRef.current?.focus();

    setIsTyping(true);

    setTimeout(() => {
      // استخدام الدالة المحدثة التي ترجع نص بسيط
      const botResponseContent = getSmartResponse(messageToSend);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponseContent,
        timestamp: new Date(),
        // إضافة معرف خاص للرسائل التي تحتاج مكون تفاعلي
        isSmartResponse: true,
        query: messageToSend
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  // الإجراءات السريعة
  const quickActions = [
    { label: <><User className="inline ml-1 w-4 h-4" /> شخصيتي</>, query: 'تكلم عن شخصيتي', response: 'شخصيتك INTJ...' },
    { label: <><Heart className="inline ml-1 w-4 h-4" /> علاقتي برحمه</>, query: 'ما هي علاقتي برحمه؟', response: 'رحمه بالنسبة ليك هي باقي عمرك...' },
    { label: <><Users className="inline ml-1 w-4 h-4" /> إنجي</>, query: 'تكلم عن انجي', response: 'إنجي هي معالجتك النفسية...' },
    { label: <><Shield className="inline ml-1 w-4 h-4" /> هند</>, query: 'كلمني عن هند', response: 'هند هي أقرب شخص ليك...' },
    { label: <><Target className="inline ml-1 w-4 h-4" /> أهدافي</>, query: 'ما هي أهدافي؟', response: 'أهدافك: تنجح وتتعلم باستمرار...' },
    { label: <><Brain className="inline ml-1 w-4 h-4" /> نقاط قوتي</>, query: 'ما هي نقاط قوتي؟', response: 'خيالك النشط...' },
    { label: <><BookOpen className="inline ml-1 w-4 h-4" /> ما الذي أتعلمه الآن؟</>, query: 'ماذا أتعلم الآن؟', response: 'أنت بتتعلم عن التفكير السقراطي...' },
    { label: <><Sparkles className="inline ml-1 w-4 h-4" /> دوافعي</>, query: 'ما هو دافعي الأساسي؟', response: 'الدافع الأساسي ليك هو المتعة...' },
  ];

  const handleQuickAction = (action) => {
    if (!action || !action.query) return;
    const userMessage = { id: Date.now(), type: 'user', content: action.query, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    inputRef.current?.focus();
    setIsTyping(true);
    setTimeout(() => {
      const botMessage = { id: Date.now() + 1, type: 'bot', content: action.response, timestamp: new Date() };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 300);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ---------- scroll helpers ----------
  const SMALL_SCROLL = 120;

  const scrollByAmount = (amount) => {
    const c = messagesContainerRef.current;
    if (!c) return;
    if (c.scrollHeight <= c.clientHeight) return;
    c.scrollBy({ top: amount, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    const c = messagesContainerRef.current;
    if (!c) return;
    if (c.scrollHeight <= c.clientHeight) return;
    c.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    const c = messagesContainerRef.current;
    if (!c) return;
    if (c.scrollHeight <= c.clientHeight) return;
    c.scrollTo({ top: c.scrollHeight - c.clientHeight, behavior: 'smooth' });
  };

  // أحداث الضغط العادي + المطوّل
  let upPressTimer, downPressTimer;

  const handleUpMouseDown = () => {
    upPressTimer = setTimeout(scrollToTop, 500); // ضغط مطوّل
  };
  const handleUpMouseUp = () => {
    if (upPressTimer) {
      clearTimeout(upPressTimer);
      scrollByAmount(-SMALL_SCROLL); // ضغط عادي
    }
  };

  const handleDownMouseDown = () => {
    downPressTimer = setTimeout(scrollToBottom, 500); // ضغط مطوّل
  };
  const handleDownMouseUp = () => {
    if (downPressTimer) {
      clearTimeout(downPressTimer);
      scrollByAmount(SMALL_SCROLL); // ضغط عادي
    }
  };
  // ---------- end scrolling helpers ----------

  return (
    <div className="flex relative flex-col h-screen font-sans text-white">
      {/* خلفية */}
      <div className="absolute inset-0" style={{
        backgroundImage: "url('/robot_guide_reference.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}></div>
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="flex relative flex-col h-full">
        {/* الهيدر */}
        <div className="flex justify-between items-center p-4 border-b backdrop-blur-sm border-cyan-500/20 bg-black/40">
          <button onClick={onBackClick} type="button" className="text-cyan-400 hover:text-cyan-300">
            <ArrowLeft/>
          </button>
          <div className="text-center">
            <h2 className="flex gap-2 items-center text-lg font-bold text-cyan-400">
              <BrainCircuit size={20} /> Virtual mind
            </h2>
            <p className="text-xs text-cyan-300/70">online for you </p>
          </div>
          <div className="w-16"></div>
        </div>

        {/* الرسائل */}
        <div ref={messagesContainerRef} className="overflow-y-auto flex-1 p-4 space-y-6 md:p-6 custom-scrollbar">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div key={message.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-end gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.type === 'bot' && <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full"></div>}
                <div className={`max-w-md lg:max-w-lg rounded-2xl p-3 text-sm md:text-base ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-lg' 
                    : 'bg-gray-800/90 text-gray-200 border border-gray-700 rounded-bl-lg'
                }`}>
                  {/* عرض المحتوى العادي أو المكون التفاعلي */}
                  {message.isSmartResponse ? (
                    <div className="space-y-4">
                      <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      <div className="pt-3 border-t border-gray-600">
                        <p className="mb-2 text-xs text-gray-400">للحصول على تحليل تفاعلي مع إمكانية الإرسال إلى API:</p>
                        <SmartResponseComponent query={message.query} />
                      </div>
                    </div>
                  ) : (
                    <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  )}
                  <p className={`text-xs opacity-60 mt-2 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                    {message.timestamp.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 justify-start items-end">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full"></div>
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

        {/* أزرار التمرير */}
        {isScrollable && (
          <div className="flex absolute right-4 bottom-40 z-50 flex-col gap-4">
            <button 
              onMouseDown={handleUpMouseDown} 
              onMouseUp={handleUpMouseUp}
              onMouseLeave={() => clearTimeout(upPressTimer)}
              type="button"
              className="flex justify-center items-center w-12 h-12 text-white bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full shadow-lg transition-all hover:from-cyan-500 hover:to-blue-500">
              <ArrowUp className="w-6 h-6" />
            </button>
            <button 
              onMouseDown={handleDownMouseDown} 
              onMouseUp={handleDownMouseUp}
              onMouseLeave={() => clearTimeout(downPressTimer)}
              type="button"
              className="flex justify-center items-center w-12 h-12 text-white bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full shadow-lg transition-all hover:from-cyan-500 hover:to-blue-500">
              <ArrowDown className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* إدخال الرسائل */}
        <div className="p-4 border-t backdrop-blur-sm bg-black/40 border-cyan-500/20">
          <div className="flex flex-wrap gap-2 justify-center mb-3">
            {quickActions.map((action, index) => (
              <button key={index} type="button" onClick={() => handleQuickAction(action)}
                className="bg-gray-800/70 border border-gray-700 text-cyan-200 px-3 py-1.5 rounded-full text-xs hover:bg-gray-700 hover:border-cyan-600 transition-all">
                {action.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2 items-center">
            <textarea ref={inputRef} value={inputValue} onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress} placeholder="اسأل عن ذكرى، شخص، أو شعور..."
              className="px-4 py-2 w-full placeholder-gray-500 text-gray-100 rounded-xl border border-gray-700 transition-all resize-none bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              rows="1" />
            <button onClick={() => handleSendMessage()} type="button" disabled={!inputValue.trim() || isTyping}
              className="px-5 py-2 font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed">
              <Send/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;

