import React from "react";
import {
  Shield,
  Calendar,
  FileText,
  User,
  Folder,
  MessageCircle,
  Brain,
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
      <div className="p-4 bg-red-900/40 text-red-300 rounded-xl border border-red-700 shadow-lg">
        <Shield className="inline w-4 h-4 mr-1 text-red-400" /> يرجى تحديد مصطلح
        للتحقيق فيه.
      </div>
    );
  }

  let intelligenceDossiers = [];

  // 🔍 البحث في جميع الملفات (characters, messages, emotions_details ...)
  Object.entries(allData).forEach(([fileName, dataset]) => {
    if (!Array.isArray(dataset)) return;

    dataset.forEach((entry) => {
      const subjectName =
        entry.name || entry.title || entry.sender || "مجهول";

      // ✅ البحث داخل كل الخصائص
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
      <div className="p-4 bg-yellow-900/30 text-yellow-200 rounded-xl border border-yellow-700 shadow-lg">
        <Shield className="inline w-4 h-4 mr-1 text-yellow-400" /> تقرير أولي:
        لم يتم العثور على أي نتائج للمصطلح{" "}
        <span className="text-yellow-400 font-bold">"{query}"</span>.
      </div>
    );
  }

  // 🗂️ تجميع الاختصارات حسب الملفات
  const sections = {};
  intelligenceDossiers.forEach((dossier) => {
    if (!sections[dossier.sourceFile]) sections[dossier.sourceFile] = [];
    sections[dossier.sourceFile].push(dossier);
  });

  // 🎨 دالة عرض المحتوى بشكل منظم (بدل JSON خام)
  const renderContent = (content) => {
    return Object.entries(content).map(([key, value], idx) => (
      <div
        key={idx}
        className="bg-gray-900 p-3 rounded-lg border border-gray-700 mb-2"
      >
        <div className="font-semibold text-green-400 flex items-center gap-2 mb-1">
          <FileText className="w-4 h-4" /> {key}
        </div>

        {Array.isArray(value) ? (
          <ul className="list-disc list-inside text-gray-200 space-y-1">
            {value.map((item, i) =>
              typeof item === "object" ? (
                <li
                  key={i}
                  className="bg-gray-800/70 p-2 rounded-lg border border-gray-700"
                >
                  {Object.entries(item).map(([subKey, subVal], j) => (
                    <div key={j} className="text-sm text-gray-300">
                      <span className="text-gray-400">{subKey}:</span> {subVal}
                    </div>
                  ))}
                </li>
              ) : (
                <li key={i} className="text-gray-200">
                  {item}
                </li>
              )
            )}
          </ul>
        ) : typeof value === "object" && value !== null ? (
          <div className="space-y-1 text-gray-300">
            {Object.entries(value).map(([subKey, subVal], j) => (
              <div key={j}>
                <span className="text-gray-400">{subKey}:</span> {subVal}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-200 whitespace-pre-wrap">{value}</div>
        )}
      </div>
    ));
  };

  return (
    <div className="p-6 bg-gray-900 text-gray-100 rounded-2xl shadow-2xl border border-gray-700 animate-fadeIn space-y-6">
      {/* العنوان */}
      <div className="flex items-center gap-3 text-green-400 text-xl font-bold">
        <Shield className="w-6 h-6 animate-pulse" />
        تقرير استخباراتي سري
      </div>

      {/* معلومات عامة */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-gray-800/70 p-4 rounded-xl border border-gray-700">
        <div>
          <span className="font-bold text-gray-300">الموضوع:</span>{" "}
          <span className="text-green-300">{query}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>
            تاريخ التقرير:{" "}
            {new Date().toLocaleDateString("ar-EG", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        <div>
          <span className="font-bold text-gray-300">عدد النتائج:</span>{" "}
          <span className="text-green-300">{intelligenceDossiers.length}</span>
        </div>
      </div>

      {/* اختصارات الأقسام */}
      <div className="flex flex-wrap gap-2 p-2">
        {Object.keys(sections).map((section, idx) => (
          <a
            key={idx}
            href={`#${section}`}
            className="px-3 py-1 bg-gray-800 text-green-400 rounded-full text-sm border border-gray-600 hover:border-green-400"
          >
            {section.replace(".json", "")}
          </a>
        ))}
      </div>

      {/* النتائج */}
      <div className="space-y-8">
        {Object.entries(sections).map(([sectionName, dossiers], idx) => (
          <div key={idx} id={sectionName}>
            <h2 className="text-lg font-bold text-green-400 flex items-center gap-2 mb-3">
              <Folder className="w-5 h-5" /> {sectionName.replace(".json", "")}
            </h2>

            {dossiers.map((dossier, index) => (
              <div
                key={index}
                className="p-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-green-400 transition-colors shadow-lg mb-4"
              >
                <div className="flex items-center gap-2 text-green-400 font-semibold">
                  <User className="w-4 h-4" />
                  {index + 1}. متعلق بـ {dossier.subject}
                </div>

                {/* عرض البيانات بناءً على النوع */}
                <div className="mt-3 text-sm space-y-2">
                  {dossier.sourceFile.includes("messages") ? (
                    <div>
                      <div className="text-xs text-gray-400 flex items-center gap-1 mb-2">
                        <MessageCircle className="w-3 h-3" /> محادثة
                      </div>
                      {renderContent(dossier.content)}
                    </div>
                  ) : dossier.sourceFile.includes("emotions_details") ? (
                    <div>
                      <div className="text-xs text-gray-400 flex items-center gap-1 mb-2">
                        <Brain className="w-3 h-3" /> مشاعر / وصف
                      </div>
                      {renderContent(dossier.content)}
                    </div>
                  ) : (
                    <div>
                      <div className="text-xs text-gray-400 flex items-center gap-1 mb-2">
                        <FileText className="w-3 h-3" /> بيانات
                      </div>
                      {renderContent(dossier.content)}
                    </div>
                  )}
                </div>

                <div className="text-xs text-gray-400 mt-2">
                  📂 المصدر: {dossier.sourceFile}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-700">
        🛰️ نهاية التقرير
      </div>
    </div>
  );
};
