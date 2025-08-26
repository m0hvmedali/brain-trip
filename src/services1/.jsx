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
  Zap,
  Heart,
  Users,
  Crown,
  Sparkles,
  Copy,
  Check,
  Download
} from "lucide-react";
import * as allData from "../assets/data/index.js";

/**
 * يحلل الاستعلام ويُنشئ تقرير استخباراتي بصري متكامل.
 * الآن يدعم:
 * - عرض الأشخاص بشكل بطاقات شخصية مع الصفات والعلاقات
 * - عرض المفاهيم والعواطف بشكل منظم مع تفاصيل علمية
 * - عرض المحادثات بشكل شبيه بواتساب مع تفاعلية كاملة
 * - تقسيم الرد الطويل إلى عدة "رسائل" (chunks)
 * - إمكانية تنزيل كل جزء كملف نصي
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

  // دالة لتحميل التقرير كاملاً
  const downloadFullReport = () => {
    // جمع كل النصوص من التقرير
    let fullReport = `تقرير البحث عن: "${query}"\n\n`;
    
    // إضافة محتوى كل قسم
    const reportElements = document.querySelectorAll('[data-report-content]');
    reportElements.forEach((el, index) => {
      fullReport += `\n--- قسم ${index + 1} ---\n`;
      fullReport += el.textContent + '\n';
    });
    
    downloadText(fullReport, `تقرير-كامل-عن-${query}.txt`);
  };

  // دالة التمرير الى أعلى (سهم العودة)
  const scrollToTop = () => {
    const el = document.getElementById('smart-report-top');
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // دالة التمرير الى الاسفل (سهم النزول)
  const scrollToBottom = () => {
    const el = document.getElementById('smart-report-bottom');
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth', block: 'end' });
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
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

  // إضافة مرساة في بداية التقرير لتمكين العودة السلسة
  // نضع id على العنصر التعريفي الأول لتسهيل scrollIntoView

  // رسالة توضيحية أولية
  responseMessages.push(
    <div id="smart-report-top" key="intro" className="p-4 text-blue-200 rounded-xl border border-blue-700 shadow-lg bg-blue-900/30">
      <div className="flex gap-2 items-center mb-2">
        <Search className="w-5 h-5 text-blue-400" />
        <span className="font-bold">جاري البحث عن:</span>
        <span className="font-bold text-blue-300"> "{query}"</span>
      </div>
      <p className="text-sm">ستظهر النتائج منظمة في بطاقات حسب نوع البيانات. الأشخاص، المشاعر، والمحادثات كل لها عرض خاص.</p>
      <div className="flex justify-center mt-3">
        <button onClick={scrollToBottom} title="الذهاب للأسفل" aria-label="الذهاب للأسفل" className="flex gap-2 items-center px-3 py-1 mx-auto text-white bg-blue-600 rounded-full w-fit hover:bg-blue-700">
          <ChevronDown className="w-5 h-5" />
          <span className="text-sm">إلى الأسفل</span>
        </button>
      </div>
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
        } else if (Array.isArray(value)) {
          value.forEach(item => {
            if (typeof item === 'string' && item.toLowerCase().includes(lowerQuery)) {
              relevanceScore += 2;
            }
          });
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

    try {
      const pattern = new RegExp(`(${String(highlight).replace(/[-/\\^$*+?.()|[\\]{}]/g, '\\\\$&')})`, 'gi');
      const parts = text.split(pattern);
      return parts.map((part, index) =>
        pattern.test(part) ? <span key={index} className="px-1 font-bold text-yellow-300 rounded bg-yellow-500/30">{part}</span> : part
      );
    } catch (e) {
      return text;
    }
  };

  // مكون زر النسخ مع تغيير اللون
  const CopyButton = ({ text, fileName }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    };

    return (
      <button
        onClick={handleCopy}
        className={`px-3 py-1 text-xs rounded flex items-center gap-1 ${
          copied ? 'text-white bg-green-600' : 'text-white bg-blue-600'
        }`}
      >
        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
        {copied ? 'تم النسخ!' : 'نسخ'}
      </button>
    );
  };

  // مكون لعرض الأشخاص بشكل بطاقة شخصية
  const PersonCard = ({ person }) => {
    return (
      <div className="p-5 bg-gradient-to-br rounded-2xl border border-purple-700 shadow-lg from-purple-900/40 to-blue-900/40" data-report-content>
        <div className="flex gap-3 items-center mb-4">
          <div className="p-2 bg-purple-700 rounded-full">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{person.name}</h3>
            <p className="text-purple-300">{person.relationship_to_user}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {person.age && (
            <div className="flex gap-2 items-center">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">العمر: {person.age}</span>
            </div>
          )}
        </div>

        {person.traits && person.traits.length > 0 && (
          <div className="mb-4">
            <h4 className="mb-2 text-sm font-semibold text-purple-400">الصفات</h4>
            <div className="flex flex-wrap gap-2">
              {person.traits.map((trait, index) => (
                <span key={index} className="px-3 py-1 text-xs text-purple-200 rounded-full bg-purple-700/50">
                  {trait}
                </span>
              ))}
            </div>
          </div>
        )}

        {person.background && (
          <div className="mb-4">
            <h4 className="mb-2 text-sm font-semibold text-purple-400">خلفية</h4>
            <p className="text-sm leading-relaxed text-gray-300">{highlightText(person.background, lowerQuery)}</p>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <CopyButton text={JSON.stringify(person, null, 2)} fileName={`person-${person.name}.json`} />
        </div>
      </div>
    );
  };

  // مكون لعرض المشاعر والمفاهيم
  const EmotionCard = ({ emotion }) => {
    return (
      <div className="p-5 bg-gradient-to-br rounded-2xl border border-pink-700 shadow-lg from-pink-900/40 to-red-900/40" data-report-content>
        <div className="flex gap-3 items-center mb-4">
          <div className="p-2 bg-pink-700 rounded-full">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{emotion.name} ({emotion.english_name})</h3>
            <p className="text-pink-300">{emotion.family} - {emotion.type}</p>
          </div>
        </div>

        {emotion.definition && (
          <div className="mb-4">
            <h4 className="mb-2 text-sm font-semibold text-pink-400">التعريف</h4>
            <p className="text-sm leading-relaxed text-gray-300">{highlightText(emotion.definition, lowerQuery)}</p>
          </div>
        )}

        {emotion.branches && emotion.branches.length > 0 && (
          <div className="mb-4">
            <h4 className="mb-2 text-sm font-semibold text-pink-400">الفروع</h4>
            <div className="flex flex-wrap gap-2">
              {emotion.branches.map((branch, index) => (
                <span key={index} className="px-3 py-1 text-xs text-pink-200 rounded-full bg-pink-700/50">
                  {branch}
                </span>
              ))}
            </div>
          </div>
        )}

        {emotion.triggers && emotion.triggers.length > 0 && (
          <div className="mb-4">
            <h4 className="mb-2 text-sm font-semibold text-pink-400">المحفزات</h4>
            <ul className="space-y-1 text-sm list-disc list-inside text-gray-300">
              {emotion.triggers.map((trigger, index) => (
                <li key={index}>{highlightText(trigger, lowerQuery)}</li>
              ))}
            </ul>
          </div>
        )}

        {emotion.expressions && emotion.expressions.length > 0 && (
          <div className="mb-4">
            <h4 className="mb-2 text-sm font-semibold text-pink-400">التعبيرات</h4>
            <div className="space-y-3">
              {emotion.expressions.map((expression, index) => (
                <div key={index} className="p-3 rounded-lg border bg-pink-900/30 border-pink-800/50">
                  <p className="text-sm italic text-gray-300">"{highlightText(expression, lowerQuery)}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <CopyButton text={JSON.stringify(emotion, null, 2)} fileName={`emotion-${emotion.name}.json`} />
        </div>
      </div>
    );
  };

  // مكون لعرض المحادثات بشكل مشابه لواتساب
  const ConversationView = ({ messages, searchTerm, title }) => {
    const [expanded, setExpanded] = useState(true);
    const [showAll, setShowAll] = useState(false);
    const [windowMessages, setWindowMessages] = useState(null);

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
      const end = Math.min(messages.length, idx + 6);
      setWindowMessages(messages.slice(start, end));
    };

    const clearWindow = () => setWindowMessages(null);

    // دالة لتحويل الوقت إلى صيغة أكثر جاذبية
    const formatTime = (timeStr) => {
      if (!timeStr) return '';
      return timeStr.replace(/\s/g, '').replace(/AM|PM/gi, '');
    };

    // دالة لتحديد إذا كان المرسل هو المستخدم الحالي
    const isCurrentUser = (sender) => {
      const senderLower = (sender || '').toLowerCase();
      return senderLower.includes('mohamed') || senderLower.includes('mohamed aly');
    };

    return (
      <div className="p-4 mt-4 bg-gray-800 rounded-xl border border-gray-700" data-report-content>
        <div className="flex justify-between items-center mb-3">
          <h3 className="flex gap-2 items-center font-semibold text-green-400">
            <MessageCircle className="w-4 h-4" /> {title}
          </h3>
          <div className="flex gap-2 items-center">
            <button onClick={() => setExpanded(!expanded)} className="text-gray-400 transition-colors hover:text-gray-200">
              {expanded ? <ChevronUp /> : <ChevronDown />}
            </button>
            <button onClick={() => { setShowAll(!showAll); clearWindow(); }} className="px-3 py-1 text-xs bg-blue-700 rounded">
              {showAll ? 'إخفاء كامل' : `عرض كامل (${messages.length})`}
            </button>
          </div>
        </div>

        {expanded && (
          <div className="space-y-1">
            {displayMessages.map((msg, index) => {
              const globalIndex = messages.indexOf(msg);
              const isMatch = JSON.stringify(msg).toLowerCase().includes(searchTerm.toLowerCase());
              const fromMe = isCurrentUser(msg.sender);

              // استخراج النص الفعلي من الرسالة
              const messageText = msg.text || msg.message || '';

              return (
                <div key={index} className={`flex ${fromMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs w-fit p-3 rounded-xl ${fromMe ? 'bg-green-700 rounded-br-none' : 'bg-gray-700 rounded-bl-none'} ${isMatch ? 'ring-2 ring-yellow-500' : ''}`}>
                    {!fromMe && (
                      <div className="mb-1 text-xs font-medium text-gray-300">
                        {msg.sender}
                      </div>
                    )}
                    
                    <div className="text-sm leading-relaxed text-white whitespace-pre-wrap">
                      {highlightText(messageText, searchTerm)}
                    </div>
                    
                    <div className="mt-1 text-xs text-left text-gray-300">
                      {formatTime(msg.time)}
                    </div>

                    <div className="flex gap-2 items-center mt-2">
                      {isMatch && (
                        <button 
                          onClick={() => showContextAround(globalIndex)} 
                          className="px-2 py-1 text-xs text-white bg-blue-600 rounded"
                        >
                          عرض السياق
                        </button>
                      )}
                      <CopyButton text={JSON.stringify(msg, null, 2)} fileName={`message-${globalIndex}.json`} />
                    </div>
                  </div>
                </div>
              );
            })}

            {!showAll && !windowMessages && messages.length > displayMessages.length && (
              <div className="mt-4 text-center">
                <button onClick={() => setShowAll(true)} className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                  عرض المحادثة كاملة ({messages.length} رسالة)
                </button>
              </div>
            )}

            {windowMessages && (
              <div className="mt-2 text-right">
                <button onClick={clearWindow} className="px-3 py-1 text-sm bg-gray-700 rounded">
                  عودة للنتائج
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // عرض كل قسم حسب نوع البيانات
  Object.entries(sections).forEach(([sectionName, dossiers], idx) => {
    const sectionTitle = sectionName.replace('.json', '');

    responseMessages.push(
      <div key={sectionName} className="p-4 space-y-4 text-gray-100 bg-gray-900 rounded-2xl border border-gray-700">
        <h2 className="flex gap-2 items-center text-lg font-bold text-green-400">
          <Folder className="w-5 h-5" /> {sectionTitle}
        </h2>

        {dossiers.map((dossier, index) => {
          // تحديد نوع البيانات وعرضها بشكل مناسب
          const content = dossier.content;
          
          // إذا كانت بيانات شخص
          if (content.relationship_to_user && content.traits) {
            return (
              <div key={index} className="p-4 bg-gray-800 rounded-xl border border-gray-700 transition-colors hover:border-purple-400">
                <div className="flex gap-2 items-center mb-3 font-semibold text-purple-400">
                  <User className="w-4 h-4" /> {index + 1}. شخص: {dossier.subject}
                </div>
                <PersonCard person={content} />
                <div className="flex gap-2 items-center mt-3 text-xs text-gray-400">
                  <Folder className="w-3 h-3 text-gray-400" /> المصدر: {dossier.sourceFile}
                </div>
              </div>
            );
          }
          
          // إذا كانت بيانات عاطفة/مفهوم
          else if (content.english_name && content.family) {
            return (
              <div key={index} className="p-4 bg-gray-800 rounded-xl border border-gray-700 transition-colors hover:border-pink-400">
                <div className="flex gap-2 items-center mb-3 font-semibold text-pink-400">
                  <Heart className="w-4 h-4" /> {index + 1}. مفهوم: {dossier.subject}
                </div>
                <EmotionCard emotion={content} />
                <div className="flex gap-2 items-center mt-3 text-xs text-gray-400">
                  <Folder className="w-3 h-3 text-gray-400" /> المصدر: {dossier.sourceFile}
                </div>
              </div>
            );
          }
          
          // إذا كانت محادثة (مجموعة رسائل)
          else if (Array.isArray(content) && content[0] && content[0].sender) {
            return (
              <div key={index} className="p-4 bg-gray-800 rounded-xl border border-gray-700 transition-colors hover:border-green-400">
                <div className="flex gap-2 items-center mb-3 font-semibold text-green-400">
                  <MessageCircle className="w-4 h-4" /> {index + 1}. محادثة: {dossier.subject}
                </div>
                <ConversationView messages={content} searchTerm={lowerQuery} title={`سجل المحادثة — ${dossier.subject}`} />
                <div className="flex gap-2 items-center mt-3 text-xs text-gray-400">
                  <Folder className="w-3 h-3 text-gray-400" /> المصدر: {dossier.sourceFile}
                </div>
              </div>
            );
          }
          
          // إذا كانت رسالة فردية
          else if (content.sender && content.text) {
            // هذه رسالة فردية، نعرضها بشكل منفرد
            return (
              <div key={index} className="p-4 bg-gray-800 rounded-xl border border-gray-700 transition-colors hover:border-green-400">
                <div className="flex gap-2 items-center mb-3 font-semibold text-green-400">
                  <MessageCircle className="w-4 h-4" /> {index + 1}. رسالة: {dossier.subject}
                </div>
                
                <div className="p-3 rounded-lg border border-gray-700 bg-gray-900/60" data-report-content>
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm text-gray-200">رسالة من {content.sender}</div>
                    <div className="text-xs text-gray-400">{content.date} {content.time}</div>
                  </div>

                  <div className="text-sm text-gray-200 whitespace-pre-wrap">
                    {highlightText(content.text, lowerQuery)}
                  </div>

                  <div className="flex gap-2 mt-3">
                    <CopyButton text={content.text} fileName={`message-${content.sender}.txt`} />
                  </div>
                </div>

                <div className="flex gap-2 items-center mt-3 text-xs text-gray-400">
                  <Folder className="w-3 h-3 text-gray-400" /> المصدر: {dossier.sourceFile}
                </div>
              </div>
            );
          }
          
          // إذا كانت بيانات أخرى
          else {
            // بدلاً من عرض الكائن كاملاً، نعرض فقط الحقول النصية المهمة
            const importantFields = ['text', 'message', 'content', 'name', 'title', 'description'];
            let displayContent = '';

            // البحث عن أول حقل نصي مهم
            for (const field of importantFields) {
              if (content[field] && typeof content[field] === 'string') {
                displayContent = content[field];
                break;
              }
            }

            // إذا لم نجد حقل نصي مهم، نعرض الكائن كاملاً
            if (!displayContent) {
              displayContent = JSON.stringify(content, null, 2);
            }

            const chunks = splitIntoChunks(displayContent, CHUNK_SIZE);

            return (
              <div key={index} className="p-4 bg-gray-800 rounded-xl border border-gray-700 transition-colors hover:border-green-400">
                <div className="flex gap-2 items-center mb-3 font-semibold text-green-400">
                  <FileText className="w-4 h-4" /> {index + 1}. بيانات: {dossier.subject}
                </div>

                <div className="space-y-3">
                  {chunks.map((chunk, ci) => (
                    <div key={ci} className="p-3 rounded-lg border border-gray-700 bg-gray-900/60" data-report-content>
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-sm text-gray-200">ملف {ci + 1} من {chunks.length}</div>
                        <div className="text-xs text-gray-400">المصدر: {dossier.sourceFile}</div>
                      </div>

                      <div className="text-sm text-gray-200 whitespace-pre-wrap">{highlightText(chunk, lowerQuery)}</div>

                      <div className="flex gap-2 mt-3">
                        <CopyButton text={chunk} fileName={`${sectionTitle.replace(/\s+/g,'_')}_part_${ci+1}.txt`} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 items-center mt-3 text-xs text-gray-400">
                  <Folder className="w-3 h-3 text-gray-400" /> المصدر: {dossier.sourceFile}
                </div>
              </div>
            );
          }
        })}
      </div>
    );
  });

  // زر تحميل التقرير كاملاً
  responseMessages.push(
    <div key="download-full" className="p-4 text-center rounded-xl border border-gray-700 bg-gray-800/50">
      <button 
        onClick={downloadFullReport} 
        className="flex gap-2 items-center px-4 py-2 mx-auto text-white bg-green-600 rounded-lg transition-colors hover:bg-green-700"
      >
        <Download className="w-5 h-5" />
        dowenload all
      </button>
    </div>
  );

  // زر السهم في نهاية التقرير للرجوع إلى البداية
  responseMessages.push(
    <div key="back-to-top" id="smart-report-bottom" className="p-4 text-center rounded-xl border border-gray-700 bg-gray-800/50">
      <button
        onClick={scrollToTop}
        title="العودة للبداية"
        aria-label="العودة للبداية"
        className="flex gap-2 items-center px-4 py-2 mx-auto text-white bg-blue-600 rounded-full w-fit hover:bg-blue-700"
      >
        <ChevronUp className="w-5 h-5" />
      </button>
    </div>
  );

  // رسالة ختامية
  responseMessages.push(
    <div key="footer" className="p-4 text-center rounded-xl border border-gray-700 bg-gray-800/50">
      <div className="flex gap-2 justify-center items-center text-xs text-gray-400">انتهت النتائج. يمكنك حفظ أو نسخ أي جزء من الرد للرجوع إليه لاحقاً.</div>
    </div>
  );

  return responseMessages;
};
