// src/services/memoryService.jsx
import React, { useState } from "react";
import {
  Shield,
  Calendar,
  FileText,
  User,
  Folder,
  MessageCircle,
  Brain,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Zap
} from "lucide-react";
import * as allData from "../assets/data/index.js";

/**
 * يحلل الاستعلام ويُنشئ تقرير استخباراتي بصري متكامل.
 * الآن يدعم:
 * - رسالة توضيحية أولية
 * - تقسيم الرد الطويل إلى عدة "رسائل" (chunks)
 * - إمكانية تنزيل كل جزء كملف نصي
 * - عرض محادثة بشكل شبيه بواتساب مع زر لعرض 5 رسائل قبل/بعد
 * @param {string} query - الكلمة أو العبارة المراد التحقيق فيها.
 * @returns {JSX.Element[]} - مجموعة من التقارير الاستخباراتية المنظمة.
 */
export const getSmartResponse = (query) => {
  const lowerQuery = (query || '').toLowerCase().trim();
  const responseMessages = [];

  // تعابير مساعدة
  const CHUNK_SIZE = 900; // طول القطعة عند تقسيم النص

  const splitIntoChunks = (text, size = CHUNK_SIZE) => {
    if (!text) return [''];
    text = typeof text === 'string' ? text : JSON.stringify(text, null, 2);
    const chunks = [];
    for (let i = 0; i < text.length; i += size) {
      chunks.push(text.slice(i, i + size));
    }
    return chunks;
  };

  const downloadText = (text, fileName = 'snippet.txt') => {
    try {
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.warn('Download failed', e);
    }
  };

  if (!lowerQuery) {
    responseMessages.push(
      <div key="error" className="p-4 text-red-300 rounded-xl border border-red-700 shadow-lg bg-red-900/40">
        <Shield className="inline mr-1 w-4 h-4 text-red-400" /> يرجى تحديد مصطلح للتحقيق فيه.
      </div>
    );
    return responseMessages;
  }

  // رسالة توضيحية أولية (ثابتة، تظهر في أعلى النتائج)
  responseMessages.push(
    <div key="intro" className="p-4 text-blue-200 rounded-xl border border-blue-700 shadow-lg bg-blue-900/30">
      <div className="flex gap-2 items-center mb-2">
        <Search className="w-5 h-5 text-blue-400" />
        <span className="font-bold">جاري البحث عن:</span>
        <span className="font-bold text-blue-300"> "{query}"</span>
      </div>
      <p className="text-sm">ستظهر النتائج منظمة في "ملفات" منفصلة. إذا كان الرد طويلاً فسيُقسم إلى أجزاء قابلة للقراءة والتنزيل. أسفل كل جزء يوجد زر لحفظه كملف نصي.</p>
    </div>
  );

  let intelligenceDossiers = [];

  // البحث المتقدم مع الترجيح
  Object.entries(allData).forEach(([fileName, dataset]) => {
    if (!Array.isArray(dataset)) return;

    dataset.forEach((entry) => {
      let relevanceScore = 0;
      const subjectName = entry.name || entry.title || entry.sender || 'مجهول';

      // الحقول المهمة ذات الوزن الأعلى
      const importantFields = { name: 10, title: 8, content: 7, message: 7, text: 6 };

      // حساب درجة الصلة
      Object.entries(importantFields).forEach(([field, weight]) => {
        if (entry[field] && typeof entry[field] === 'string') {
          const fieldValue = entry[field].toLowerCase();
          if (fieldValue === lowerQuery) relevanceScore += weight * 3;
          if (fieldValue.startsWith(lowerQuery)) relevanceScore += weight * 2;
          if (fieldValue.includes(lowerQuery)) relevanceScore += weight;
        }
      });

      // البحث في الحقول الأخرى
      Object.entries(entry).forEach(([key, value]) => {
        if (typeof value === 'string' && !importantFields[key]) {
          const fieldValue = value.toLowerCase();
          if (fieldValue.includes(lowerQuery)) relevanceScore += 1;
        }
      });

      if (relevanceScore > 0) {
        intelligenceDossiers.push({
          subject: subjectName,
          content: entry,
          sourceFile: `${fileName}.json`,
          relevanceScore: relevanceScore
        });
      }
    });
  });

  intelligenceDossiers.sort((a, b) => b.relevanceScore - a.relevanceScore);

  if (intelligenceDossiers.length === 0) {
    responseMessages.push(
      <div key="no-results" className="p-4 text-yellow-200 rounded-xl border border-yellow-700 shadow-lg bg-yellow-900/30">
        <Shield className="inline mr-1 w-4 h-4 text-yellow-400" />
        لم يتم العثور على أي نتائج للمصطلح <span className="font-bold text-yellow-400">"{query}"</span>.
      </div>
    );
    return responseMessages;
  }

  // تجميع حسب الملف
  const sections = {};
  intelligenceDossiers.forEach((dossier) => {
    if (!sections[dossier.sourceFile]) sections[dossier.sourceFile] = [];
    sections[dossier.sourceFile].push(dossier);
  });

  // إحصاءات النتائج
  responseMessages.push(
    <div key="stats" className="p-4 rounded-xl border border-gray-700 bg-gray-800/70">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex gap-2 items-center">
          <Zap className="w-4 h-4 text-green-400" />
          <span>عدد النتائج: <span className="text-green-300">{intelligenceDossiers.length}</span></span>
        </div>
        <div className="flex gap-2 items-center">
          <Filter className="w-4 h-4 text-blue-400" />
          <span>عدد الأقسام: <span className="text-blue-300">{Object.keys(sections).length}</span></span>
        </div>
      </div>
    </div>
  );

  // دالة لتظليل النص المطابق
  const highlightText = (text, highlight) => {
    if (text === null || text === undefined) return '';
    if (typeof text !== 'string') text = String(text);

    // تبسيط التمييز: قسم النص حول الكلمة المطابقة (case-insensitive)
    try {
      const pattern = new RegExp(`(${String(highlight).replace(/[-/\\^$*+?.()|[\\]{}]/g, '\\\\$&')})`, 'gi');
      const parts = text.split(pattern);
      return parts.map((part, index) =>
        pattern.test(part) ? <span key={index} className="px-1 font-bold text-yellow-300 rounded bg-yellow-500/30">{part}</span> : part
      );
    } catch (e) {
      // لو حصل خطأ في الريجيكس نرجع النص كما هو
      return text;
    }
  };

  // مكون لعرض المحادثات بشكل مشابه لواتساب مع زر عرض 5 قبل/بعد لكل رسالة مطابقة
  const ConversationView = ({ messages, searchTerm, title }) => {
    const [expanded, setExpanded] = useState(true);
    const [showAll, setShowAll] = useState(false);
    const [windowMessages, setWindowMessages] = useState(null); // null => use default display

    // البحث عن مؤشرات المطابقة
    const matchedIndices = [];
    messages.forEach((msg, index) => {
      const msgText = JSON.stringify(msg).toLowerCase();
      if (msgText.includes(searchTerm.toLowerCase())) {
        matchedIndices.push(index);
      }
    });

    // تحديد العرض الافتراضي: 5 قبل و5 بعد لكل مطابقة
    let displayIndices = new Set();
    matchedIndices.forEach(idx => {
      const start = Math.max(0, idx - 5);
      const end = Math.min(messages.length - 1, idx + 5);
      for (let i = start; i <= end; i++) displayIndices.add(i);
    });

    let displayMessages = Array.from(displayIndices).sort((a,b)=>a-b).map(i => messages[i]);

    if (displayMessages.length === 0 && messages.length > 0) {
      displayMessages = messages.slice(0, 10);
    }

    if (showAll) displayMessages = messages;
    if (windowMessages) displayMessages = windowMessages;

    const showContextAround = (idx) => {
      const start = Math.max(0, idx - 5);
      const end = Math.min(messages.length, idx + 6); // slice end exclusive
      setWindowMessages(messages.slice(start, end));
    };

    const clearWindow = () => setWindowMessages(null);

    return (
      <div className="p-4 mt-4 bg-gray-800 rounded-xl border border-gray-700">
        <div className="flex justify-between items-center mb-3">
          <h3 className="flex gap-2 items-center font-semibold text-green-400">
            <MessageCircle className="w-4 h-4" /> {title}
          </h3>
          <div className="flex gap-2 items-center">
            <button onClick={() => setExpanded(!expanded)} className="text-gray-400 transition-colors hover:text-gray-200">
              {expanded ? <ChevronUp /> : <ChevronDown />}
            </button>
            <button onClick={() => { setShowAll(!showAll); clearWindow(); }} className="text-sm text-blue-300">
              {showAll ? 'إخفاء كامل' : `عرض كامل (${messages.length})`}
            </button>
          </div>
        </div>

        {expanded && (
          <div className="space-y-3">
            {displayMessages.map((msg, index) => {
              const globalIndex = messages.indexOf(msg);
              const isMatch = JSON.stringify(msg).toLowerCase().includes(searchTerm.toLowerCase());
              const senderLower = (msg.sender || '').toLowerCase();
              const fromMe = senderLower.includes('mohamed') || senderLower.includes('mohamed aly');

              return (
                <div key={index} className={`flex ${fromMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-md w-fit p-3 rounded-xl ${fromMe ? 'text-white bg-blue-600 rounded-br-none' : 'text-gray-200 rounded-bl-none bg-gray-700/60'} ${isMatch ? 'ring-2 ring-yellow-500' : ''}`}>
                    <div className="flex justify-between items-start mb-1">
                      <div className="text-sm font-semibold">{msg.sender}</div>
                      <div className="text-xs text-gray-300">{msg.date} {msg.time}</div>
                    </div>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">{highlightText(msg.text || msg.message || '', searchTerm)}</div>

                    <div className="flex gap-2 items-center mt-2">
                      {isMatch && (
                        <button onClick={() => showContextAround(globalIndex)} className="px-2 py-1 text-xs text-white bg-blue-600 rounded">عرض 5 قبل/بعد</button>
                      )}
                      <button onClick={() => downloadText(JSON.stringify(msg, null, 2), `message-${globalIndex}.json`)} className="px-2 py-1 text-xs text-white bg-green-600 rounded">تحميل</button>
                    </div>
                  </div>
                </div>
              );
            })}

            {!showAll && !windowMessages && messages.length > displayMessages.length && (
              <div className="mt-4 text-center">
                <button onClick={() => setShowAll(true)} className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">عرض المحادثة كاملة ({messages.length} رسالة)</button>
              </div>
            )}

            {windowMessages && (
              <div className="mt-2 text-right">
                <button onClick={clearWindow} className="px-3 py-1 text-sm bg-gray-700 rounded">عودة للنتائج</button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // عرض كل قسم و تقسيم المحتوى الطويل إلى "ملفات"/رسائل منفصلة
  Object.entries(sections).forEach(([sectionName, dossiers], idx) => {
    const sectionTitle = sectionName.replace('.json', '');

    responseMessages.push(
      <div key={sectionName} className="p-4 space-y-4 text-gray-100 bg-gray-900 rounded-2xl border border-gray-700">
        <h2 className="flex gap-2 items-center text-lg font-bold text-green-400">
          <Folder className="w-5 h-5" /> {sectionTitle}
        </h2>

        {dossiers.map((dossier, index) => {
          // stringify content for length checking
          const serialized = (typeof dossier.content === 'object') ? JSON.stringify(dossier.content, null, 2) : String(dossier.content || '');

          // إذا المحتوى عبارة عن محادثة
          if (Array.isArray(dossier.content) && dossier.content[0] && dossier.content[0].sender) {
            return (
              <div key={index} className="p-4 bg-gray-800 rounded-xl border border-gray-700 transition-colors hover:border-green-400">
                <div className="flex gap-2 items-center mb-3 font-semibold text-green-400">
                  <User className="w-4 h-4" /> {index + 1}. متعلق بـ {dossier.subject}
                </div>
                <div className="flex gap-2 items-center mb-3 text-xs text-gray-400"><MessageCircle className="w-3 h-3" /> محادثة — يمكنك عرض أجزاء مطابقة أو تحميلها.</div>
                {<ConversationView messages={dossier.content} searchTerm={lowerQuery} title={`سجل المحادثة — ${dossier.subject}`} />}
                <div className="flex gap-2 items-center mt-3 text-xs text-gray-400">
                  <Folder className="w-3 h-3 text-gray-400" /> المصدر: {dossier.sourceFile}
                </div>
              </div>
            );
          }

          // خلاف ذلك: محتوى عام (كائن) — نقسمه إلى قطع نصية قابلة للعرض والتنزيل
          const chunks = splitIntoChunks(serialized, CHUNK_SIZE);

          return (
            <div key={index} className="p-4 bg-gray-800 rounded-xl border border-gray-700 transition-colors hover:border-green-400">
              <div className="flex gap-2 items-center mb-3 font-semibold text-green-400">
                <User className="w-4 h-4" /> {index + 1}. متعلق بـ {dossier.subject}
              </div>

              <div className="space-y-3">
                {chunks.map((chunk, ci) => (
                  <div key={ci} className="p-3 rounded-lg border border-gray-700 bg-gray-900/60">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-sm text-gray-200">ملف {ci + 1} من {chunks.length}</div>
                      <div className="text-xs text-gray-400">المصدر: {dossier.sourceFile}</div>
                    </div>

                    <pre className="text-sm text-gray-200 whitespace-pre-wrap">{highlightText(chunk, lowerQuery)}</pre>

                    <div className="flex gap-2 mt-3">
                      <button onClick={() => downloadText(chunk, `${sectionTitle.replace(/\s+/g,'_')}_part_${ci+1}.txt`)} className="px-3 py-1 text-xs text-white bg-green-600 rounded">تحميل الجزء</button>
                      <button onClick={() => { navigator.clipboard?.writeText(chunk); }} className="px-3 py-1 text-xs text-white bg-blue-600 rounded">نسخ</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 items-center mt-3 text-xs text-gray-400">
                <Folder className="w-3 h-3 text-gray-400" /> المصدر: {dossier.sourceFile}
              </div>
            </div>
          );
        })}
      </div>
    );
  });

  // رسالة ختامية بسيطة
  responseMessages.push(
    <div key="footer" className="p-4 text-center rounded-xl border border-gray-700 bg-gray-800/50">
      <div className="flex gap-2 justify-center items-center text-xs text-gray-400">انتهت النتائج. يمكنك حفظ أو نسخ أي جزء من الرد للرجوع إليه لاحقاً.</div>
    </div>
  );

  return responseMessages;
};
