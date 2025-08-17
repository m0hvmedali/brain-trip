import React, { useState, useEffect, useRef } from 'react';
import { FixedSizeList as List } from 'react-window';
import { motion } from 'framer-motion';
import { Heart, Search, Send } from 'lucide-react';
import chatDataUrl from '/chat.json?url';
import ScrollButtons from '../scroltop-bot';

export default function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    fetch(chatDataUrl)
      .then(res => res.json())
      .then(data => setMessages(data));
  }, []);

  const filteredMessages = messages.filter(msg =>
    msg.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const now = new Date();
    const msg = {
      datetime: now.toISOString(),
      date: now.toLocaleDateString('ar-EG', { day: '2-digit', month: '2-digit', year: '2-digit' }),
      time: now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      sender: 'Mohamed Aly',
      type: 'message',
      text: newMessage
    };
    setMessages(prev => [...prev, msg]);
    setNewMessage('');
    setTimeout(() => listRef.current?.scrollToItem(messages.length, 'end'), 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleHeartClick = () => {
    setIsHeartAnimating(true);
    const now = new Date();
    const loveMsg = {
      datetime: now.toISOString(),
      date: now.toLocaleDateString('ar-EG', { day: '2-digit', month: '2-digit', year: '2-digit' }),
      time: now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      sender: 'Mohamed Aly',
      type: 'love',
      text: '❤️ أحبك أكثر من أي شيء في هذا العالم ❤️'
    };
    setMessages(prev => [...prev, loveMsg]);
    setTimeout(() => setIsHeartAnimating(false), 3000);
  };

  // دمج الرسائل مع Dividers حسب اليوم
  const groupedMessages = [];
  let lastDate = null;
  filteredMessages.forEach(msg => {
    if (msg.date !== lastDate) {
      groupedMessages.push({ type: 'divider', date: msg.date, id: `divider-${msg.date}` });
      lastDate = msg.date;
    }
    groupedMessages.push(msg);
  });

  const Row = ({ index, style }) => {
    const message = groupedMessages[index];

    if (message.type === 'divider') {
      return (
        <div style={style} className="flex justify-center my-2">
          <span className="font-bold text-gray-600 font-mediufm text-m dark:text-black">
            {message.date}
          </span> 
        </div>
      );
    }

    const isMe = message.sender === 'Mohamed Aly';
    return (
      <div style={style} className={`flex mb-3 ${isMe ? 'justify-end' : 'justify-start'} px-3`}>
        {!isMe && (
          <div className="flex justify-center items-center mr-2 w-10 h-10 font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
            N
          </div>
        )}
        <div className="flex flex-col max-w-xs">
          <div className={`px-4 py-2 rounded-2xl shadow-md text-sm ${isMe 
            ? 'text-white bg-rose-500 rounded-bl-none backdrop-blur-sm dark:text-white dark:bg-gray-800' 
            : 'text-gray-900 bg-white rounded-bl-none backdrop-blur-sm dark:text-white dark:bg-black'}`}>
            {message.type === 'love' 
              ? <span>{message.text}</span> 
              : message.type === 'file' 
                ? <span className="underline cursor-pointer">{message.text}</span> 
                : <p>{message.text}</p>}
          </div>
          <div className={`text-xs mt-1 ${isMe ? 'text-right text-gray-200' : 'text-left text-gray-100'}`}>
            {message.time}
          </div>
        </div>
        {isMe && (
          <div className="flex justify-center items-center ml-2 w-10 h-10 font-bold text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full">
            M
          </div>
        )}
      </div>
    );
  };

  // ---------- container background style ----------
  const bgUrl = '/WhatsApp Image 2025-08-17 at 1.39.12 AM.jpeg'; // تأكد إن المسار صحيح في public/
  const containerStyle = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.18), rgba(0,0,0,0.18)), url("${bgUrl}")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundBlendMode: 'overlay'
  };

  return (
    <div
      className="h-[600px] w-full max-w-xl mx-auto flex flex-col border rounded-2xl shadow-lg overflow-hidden relative"
      style={containerStyle}
    >
      {/* هيدر داخل الشات (شبه شفاف لكي تظهر الخلفية) */}
      <div className="flex justify-between items-center p-4 border-b backdrop-blur-sm bg-white/20 dark:bg-black/30">
        <div className="flex items-center">
          <div className="flex justify-center items-center w-12 h-12 font-bold text-white bg-gradient-to-r from-pink-500 to-rose-500 rounded-full">
            N
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-bold text-white">Fav Nana ✨</h3>
          </div>
        </div>
        <motion.button whileTap={{ scale: 0.9 }} onClick={handleHeartClick} className="p-2 text-rose-300 rounded-full bg-white/10">
          <Heart className={isHeartAnimating ? 'animate-pulse fill-rose-400' : ''} />
        </motion.button>
      </div>

      {/* شريط البحث (شفاف) */}
      <div className="p-2 border-b backdrop-blur-sm bg-white/10 dark:bg-black/30">
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث في المحادثات..."
            className="py-2 pr-4 pl-10 w-full text-white rounded-full border border-white/20 bg-white/20 placeholder:text-white/80 focus:outline-none focus:ring-2 focus:ring-rose-400"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-white/80" size={18} />
        </div>
      </div>

      {/* منطقة الرسائل مع مسافة أعلى - محتفظة بشفافية لتظهر الخلفية */}
      <div className="overflow-hidden flex-1 p-2 pt-6">
        <List
          height={400}
          itemCount={groupedMessages.length}
          itemSize={70}
          width={'100%'}
          ref={listRef}
          className="overflow-y-auto"
        >
          {Row}
        </List>
      </div>

      {/* إدخال الرسائل */}
      <div className="flex justify-between items-center p-3 border-t backdrop-blur-sm bg-white/10 dark:bg-black/30">
        <ScrollButtons
          onScrollTop={() => listRef.current?.scrollToItem(0, 'start')}
          onScrollBottom={() => listRef.current?.scrollToItem(groupedMessages.length - 1, 'end')}
        />
        <textarea
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="اكتب رسالة..."
          className="flex-1 px-4 py-2 mx-2 w-full text-white rounded-full border resize-none border-white/20 bg-white/10 placeholder:text-white/80 focus:outline-none focus:ring-2 focus:ring-rose-400"
          rows={1}
          style={{ minHeight: '44px' }}
        />
        <motion.button
          onClick={handleSendMessage}
          whileTap={{ scale: 0.9 }}
          className="p-3 text-white bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"
        >
          <Send size={18} />
        </motion.button>
      </div>
    </div>
  );
}
