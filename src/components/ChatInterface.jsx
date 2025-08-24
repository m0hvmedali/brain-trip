// src/components/ChatInterface.jsx

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Users, Heart, Target, BrainCircuit } from 'lucide-react';

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

  // التمرير للأسفل تلقائيًا عند وصول رسالة جديدة
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // التركيز على حقل الإدخال عند تحميل المكون
  useEffect(() => {
    inputRef.current?.focus();

  }, []);

  // إجراءات سريعة مقترحة ومحسّنة
  const quickActions = [
    { label: <><User className="inline w-4 h-4 ml-1" /> تكلم عن شخصيتي</>, query: 'تكلم عن شخصيتي' },
    { label: <><Heart className="inline w-4 h-4 ml-1" /> ما هي علاقتي برحمه؟</>, query: 'ما هي علاقتي برحمه محمد؟' },
    { label: <><Users className="inline w-4 h-4 ml-1" /> كلمني عن انجي</>, query: 'تكلم عن انجي' },
    { label: <><Target className="inline w-4 h-4 ml-1" /> ما هي أهدافي؟</>, query: 'ما هي أهدافي؟' },
  ];

  // دالة إرسال الرسائل (للمستخدم والإجراءات السريعة)
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
    if (!query) {
      setInputValue('');
    }
    setIsTyping(true);

    // محاكاة استدعاء العقل والتفكير لإعطاء شعور واقعي
    setTimeout(() => {
      // *** هنا يتم استخدام العقل الذكي الجديد ***
      const botResponseContent = getSmartResponse(messageToSend);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponseContent,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800); // وقت تفكير عشوائي قليلاً
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
      {/* الهيدر */}
      <div className="flex items-center justify-between p-4 border-b border-cyan-500/20 bg-gray-900/50 backdrop-blur-sm">
        <button
          onClick={onBackClick}
          className="text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          → العودة
        </button>
        <div className="text-center">
          <h2 className="text-lg font-bold text-cyan-400 flex items-center gap-2">
            <BrainCircuit size={20} />
            مرشد الذكريات
          </h2>
          <p className="text-xs text-cyan-300/70">متصل بذاكرتك العميقة</p>
        </div>
        <div className="w-16"></div> {/* عنصر وهمي للموازنة */}
      </div>

      {/* منطقة عرض الرسائل */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-end gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'bot' && <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex-shrink-0"></div>}
              <div className={`max-w-md lg:max-w-lg rounded-2xl p-3 text-sm md:text-base ${
                message.type === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-lg' 
                  : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-bl-lg'
              }`}>
                {/* استخدام whitespace-pre-wrap للحفاظ على تنسيق المسافات والأسطر الجديدة */}
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
            className="flex items-end gap-2 justify-start"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex-shrink-0"></div>
            <div className="bg-gray-800 rounded-2xl rounded-bl-lg p-4 border border-gray-700">
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

      {/* منطقة الإدخال والإجراءات السريعة */}
      <div className="p-4 bg-gray-900/50 backdrop-blur-sm border-t border-cyan-500/20">
        <div className="flex flex-wrap gap-2 mb-3 justify-center">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleSendMessage(action.query)}
              className="bg-gray-800/70 border border-gray-700 text-cyan-200 px-3 py-1.5 rounded-full text-xs hover:bg-gray-700 hover:border-cyan-600 transition-all"
            >
              {action.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="اسأل عن ذكرى، شخص، أو شعور..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-gray-100 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            rows="1"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isTyping}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-5 py-2 rounded-xl font-semibold transition-all duration-300 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed"
          >
            إرسال
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
