import React, { useRef } from "react";
import {
  Shield,
  Calendar,
  FileText,
  User,
  Folder,
  MessageCircle,
  Brain,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import * as allData from "../assets/data/index.js";

/**
 * يحلل الاستعلام ويُنشئ تقرير استخباراتي بصري متكامل.
 * @param {string} query - الكلمة أو العبارة المراد التحقيق فيها.
 * @returns {JSX.Element} - تقرير استخباراتي منسق.
 */
export const getSmartResponse = (query) => {
  const lowerQuery = query.toLowerCase().trim();

  if (!lowerQuery) {
    return (
      <div className="p-4 text-red-300 rounded-xl border border-red-700 shadow-lg bg-red-900/40">
        <Shield className="inline mr-1 w-4 h-4 text-red-400" /> يرجى تحديد مصطلح
        للتحقيق فيه.
      </div>
    );
  }

  let intelligenceDossiers = [];

  // البحث في جميع الملفات (characters, messages, emotions_details ...)
  Object.entries(allData).forEach(([fileName, dataset]) => {
    if (!Array.isArray(dataset)) return;

    dataset.forEach((entry) => {
      const subjectName = entry.name || entry.title || entry.sender || "مجهول";

      // البحث داخل كل الخصائص
      const entryString = JSON.stringify(entry, null, 2).toLowerCase();
      if (entryString.includes(lowerQuery)) {
        intelligenceDossiers.push({
          subject: subjectName,
          content: entry,
          sourceFile: `${fileName}.json`,
        });
      }
    });
  });

  if (intelligenceDossiers.length === 0) {
    return (
      <div className="p-4 text-yellow-200 rounded-xl border border-yellow-700 shadow-lg bg-yellow-900/30">
        <Shield className="inline mr-1 w-4 h-4 text-yellow-400" /> تقرير أولي:
        لم يتم العثور على أي نتائج للمصطلح{' '}
        <span className="font-bold text-yellow-400">"{query}"</span>.
      </div>
    );
  }

  // تجميع النتائج حسب الملفات
  const sections = {};
  intelligenceDossiers.forEach((dossier) => {
    if (!sections[dossier.sourceFile]) sections[dossier.sourceFile] = [];
    sections[dossier.sourceFile].push(dossier);
  });

  // دالة لتظليل النص المطابق للاستعلام
  const highlightText = (text, highlight) => {
    if (typeof text !== 'string') return text;
    
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === highlight.toLowerCase() 
        ? <span key={index} className="px-1 font-bold text-yellow-300 rounded bg-yellow-500/30">{part}</span>
        : part
    );
  };

  // دالة عرض المحتوى بشكل منظم مع تمييز النص المطابق
  const renderContent = (content, searchTerm) => {
    return Object.entries(content).map(([key, value], idx) => (
      <div
        key={idx}
        className="p-3 mb-2 bg-gray-900 rounded-lg border border-gray-700"
      >
        <div className="flex gap-2 items-center mb-1 font-semibold text-green-400">
          <FileText className="w-4 h-4" /> {key}
        </div>

        {Array.isArray(value) ? (
          <ul className="space-y-1 list-disc list-inside text-gray-200">
            {value.map((item, i) =>
              typeof item === "object" ? (
                <li
                  key={i}
                  className="p-2 rounded-lg border border-gray-700 bg-gray-800/70"
                >
                  {Object.entries(item).map(([subKey, subVal], j) => (
                    <div key={j} className="text-sm text-gray-300">
                      <span className="text-gray-400">{subKey}:</span> {highlightText(subVal, searchTerm)}
                    </div>
                  ))}
                </li>
              ) : (
                <li key={i} className="text-gray-200">
                  {highlightText(item, searchTerm)}
                </li>
              )
            )}
          </ul>
        ) : typeof value === "object" && value !== null ? (
          <div className="space-y-1 text-gray-300">
            {Object.entries(value).map(([subKey, subVal], j) => (
              <div key={j}>
                <span className="text-gray-400">{subKey}:</span> {highlightText(subVal, searchTerm)}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-200 whitespace-pre-wrap">
            {highlightText(value, searchTerm)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="p-6 space-y-6 text-gray-100 bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl animate-fadeIn">
      {/* العنوان */}
      <div className="flex gap-3 items-center text-xl font-bold text-green-400">
        <Shield className="w-6 h-6 animate-pulse" />
        تقرير استخباراتي سري
      </div>

      {/* معلومات عامة */}
      <div className="grid grid-cols-1 gap-4 p-4 text-sm rounded-xl border border-gray-700 sm:grid-cols-2 bg-gray-800/70">
        <div>
          <span className="font-bold text-gray-300">الموضوع:</span>{' '}
          <span className="text-green-300">{query}</span>
        </div>
        <div className="flex gap-2 items-center">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>
            تاريخ التقرير:{' '}
            {new Date().toLocaleDateString('ar-EG', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
        <div>
          <span className="font-bold text-gray-300">عدد النتائج:</span>{' '}
          <span className="text-green-300">{intelligenceDossiers.length}</span>
        </div>
      </div>

      {/* اختصارات الأقسام */}
      <div className="flex flex-wrap gap-2 p-2">
        {Object.keys(sections).map((section, idx) => (
          <a
            key={idx}
            href={`#${section}`}
            className="px-3 py-1 text-sm text-green-400 bg-gray-800 rounded-full border border-gray-600 hover:border-green-400"
          >
            {section.replace('.json', '')}
          </a>
        ))}
      </div>

      {/* النتائج */}
      <div className="space-y-8">
        {Object.entries(sections).map(([sectionName, dossiers], idx) => (
          <div key={idx} id={sectionName}>
            <h2 className="flex gap-2 items-center mb-3 text-lg font-bold text-green-400">
              <Folder className="w-5 h-5" /> {sectionName.replace('.json', '')}
            </h2>

            {dossiers.map((dossier, index) => (
              <div
                key={index}
                className="p-4 mb-4 bg-gray-800 rounded-xl border border-gray-700 shadow-lg transition-colors hover:border-green-400"
              >
                <div className="flex gap-2 items-center font-semibold text-green-400">
                  <User className="w-4 h-4" />
                  {index + 1}. متعلق بـ {dossier.subject}
                </div>

                {/* عرض البيانات بناءً على النوع */}
                <div className="mt-3 space-y-2 text-sm">
                  {dossier.sourceFile.includes('messages') ? (
                    <div>
                      <div className="flex gap-1 items-center mb-2 text-xs text-gray-400">
                        <MessageCircle className="w-3 h-3" /> محادثة
                      </div>
                      {renderContent(dossier.content, lowerQuery)}
                    </div>
                  ) : dossier.sourceFile.includes('emotions_details') ? (
                    <div>
                      <div className="flex gap-1 items-center mb-2 text-xs text-gray-400">
                        <Brain className="w-3 h-3" /> مشاعر / وصف
                      </div>
                      {renderContent(dossier.content, lowerQuery)}
                    </div>
                  ) : (
                    <div>
                      <div className="flex gap-1 items-center mb-2 text-xs text-gray-400">
                        <FileText className="w-3 h-3" /> بيانات
                      </div>
                      {renderContent(dossier.content, lowerQuery)}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 items-center mt-2 text-xs text-gray-400">
                  <Folder className="w-3 h-3 text-gray-400" /> المصدر: {dossier.sourceFile}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="pt-4 text-xs text-center text-gray-500 border-t border-gray-700">
        <Shield className="inline mr-1 w-3 h-3 text-gray-400" /> نهاية التقرير
      </div>
    </div>
  );
};

// مكوّن تحكّم لحقل إدخال الرسالة مع أسهم للتمرير فقط (بدون زر إرسال)
export const MessageInputControls = ({ placeholder = "اكتب رسالتك هنا..." }) => {
  const textareaRef = useRef(null);

  const scrollUpSmall = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.scrollTop = Math.max(0, el.scrollTop - 120);
  };

  const scrollUpLarge = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.scrollTop = Math.max(0, el.scrollTop - 400);
  };

  const scrollDown = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.scrollTop = Math.min(el.scrollHeight, el.scrollTop + 300);
  };

  return (
    <div className="p-3 mx-auto w-full max-w-full bg-transparent sm:max-w-xl">
      <div className="overflow-hidden relative bg-gray-800 rounded-xl border border-gray-700">
        {/* سهم في الأعلى للذهاب للأسفل داخل الرسالة الطويلة */}
        <button
          onClick={scrollDown}
          aria-label="نزول"
          className="absolute -top-3 right-3 p-1 rounded-full shadow-md backdrop-blur bg-gray-800/60"
        >
          <ArrowDown className="w-4 h-4 text-gray-300" />
        </button>

        <textarea
          ref={textareaRef}
          rows={3}
          placeholder={placeholder}
          className="p-4 pr-12 w-full placeholder-gray-400 text-gray-100 bg-transparent outline-none resize-none"
        />

        {/* أزرار في الأسفل للتمرير للأعلى (سهمان: صغير وكبير) - بدون زر إرسال */}
        <div className="flex absolute right-2 bottom-2 gap-2 items-center">
          <button
            onClick={scrollUpSmall}
            aria-label="صعود صغير"
            className="p-2 rounded-md bg-gray-800/60 hover:bg-gray-700/60"
            title="صعود بكمية صغيرة"
          >
            <ArrowUp className="w-4 h-4 text-gray-300" />
          </button>

          <button
            onClick={scrollUpLarge}
            aria-label="صعود كبير"
            className="p-2 rounded-md bg-gray-800/60 hover:bg-gray-700/60"
            title="صعود بكمية كبيرة"
          >
            <ArrowUp className="w-4 h-4 text-gray-300 stroke-2" />
          </button>
        </div>
      </div>

      {/* تلميح صغير لملائمة الهاتف */}
      <div className="mt-2 text-xs text-center text-gray-400">
        استخدم الأسهم للتمرير داخل الرسالة الطويلة — مناسب لشاشات الهاتف.
      </div>
    </div>
  );
};