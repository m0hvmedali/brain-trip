// src/services/memoryService.jsx
import React from "react";
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
  Download,
  Send,
  Eye,
  EyeOff
} from "lucide-react";
import * as allData from "../assets/data/index.js";

// دالة لإرسال الاستعلام إلى API handler
const sendToAPIHandler = async (query) => {
  try {
    const response = await fetch('/api/handler', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: query })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.result || 'لم يتم الحصول على رد من API';
  } catch (error) {
    console.error('خطأ في إرسال الطلب إلى API:', error);
    return `خطأ في الاتصال بـ API: ${error.message}`;
  }
};

/**
 * مكون React لعرض التقرير الذكي مع إمكانية إرسال الطلب إلى API
 */
export const SmartResponseComponent = ({ query }) => {
  const [apiResponse, setApiResponse] = React.useState(null);
  const [showReport, setShowReport] = React.useState(false);
  const [loadingAPI, setLoadingAPI] = React.useState(false);

  const lowerQuery = (query || '').toLowerCase().trim();

  // تعابير مساعدة
  const CHUNK_SIZE = 900;

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

  // دالة لإرسال الطلب إلى API
  const handleAPIRequest = async () => {
    setLoadingAPI(true);
    const response = await sendToAPIHandler(query);
    setApiResponse(response);
    setLoadingAPI(false);
  };

  // دالة التمرير الى أعلى
  const scrollToTop = () => {
    const el = document.getElementById('smart-report-top');
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // دالة التمرير الى الاسفل
  const scrollToBottom = () => {
    const el = document.getElementById('smart-report-bottom');
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth', block: 'end' });
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  if (!lowerQuery) {
    return (
      <div className="p-4 text-red-300 rounded-xl border border-red-700 shadow-lg bg-red-900/40">
        <Shield className="inline mr-1 w-4 h-4 text-red-400" /> يرجى تحديد مصطلح للتحقيق فيه.
      </div>
    );
  }

  // البحث المتقدم مع الترجيح
  let intelligenceDossiers = [];
  
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

  // مكون زر النسخ
  const CopyButton = ({ text, fileName }) => {
    const [copied, setCopied] = React.useState(false);

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

  return (
    <div className="space-y-4">
      {/* رسالة توضيحية أولية مع زر إرسال إلى API */}
      <div id="smart-report-top" className="p-4 text-blue-200 rounded-xl border border-blue-700 shadow-lg bg-blue-900/30">
        <div className="flex gap-2 items-center mb-2">
          <Search className="w-5 h-5 text-blue-400" />
          <span className="font-bold">جاري البحث عن:</span>
          <span className="font-bold text-blue-300"> "{query}"</span>
        </div>
        <p className="mb-3 text-sm">ستظهر النتائج منظمة في بطاقات حسب نوع البيانات. الأشخاص، المشاعر، والمحادثات كل لها عرض خاص.</p>
        
        {/* زر إرسال إلى API */}
        <div className="flex gap-3 items-center mb-3">
          <button 
            onClick={handleAPIRequest}
            disabled={loadingAPI}
            className="flex gap-2 items-center px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {loadingAPI ? 'جاري الإرسال...' : 'إرسال إلى API'}
          </button>
          
          {apiResponse && (
            <button 
              onClick={() => setShowReport(!showReport)}
              className="flex gap-2 items-center px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              {showReport ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showReport ? 'إخفاء التقرير' : 'عرض التقرير'}
            </button>
          )}
        </div>

        <div className="flex justify-center mt-3">
          <button onClick={scrollToBottom} title="الذهاب للأسفل" className="flex gap-2 items-center px-3 py-1 mx-auto text-white bg-blue-600 rounded-full w-fit hover:bg-blue-700">
            <ChevronDown className="w-5 h-5" />
            <span className="text-sm">إلى الأسفل</span>
          </button>
        </div>
      </div>

      {/* عرض رد API إذا كان متوفراً */}
      {apiResponse && (
        <div className="p-4 mb-4 text-green-200 rounded-xl border border-green-700 shadow-lg bg-green-900/30">
          <div className="flex gap-2 items-center mb-3">
            <Brain className="w-5 h-5 text-green-400" />
            <span className="font-bold text-green-300">رد من API:</span>
          </div>
          <div className="p-3 rounded-lg border bg-green-800/30 border-green-700/50">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{apiResponse}</p>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => navigator.clipboard.writeText(apiResponse)}
              className="flex gap-1 items-center px-3 py-1 text-xs text-white bg-green-600 rounded"
            >
              <Copy className="w-3 h-3" />
              نسخ الرد
            </button>
            <button
              onClick={() => downloadText(apiResponse, `api-response-${query}.txt`)}
              className="flex gap-1 items-center px-3 py-1 text-xs text-white bg-blue-600 rounded"
            >
              <Download className="w-3 h-3" />
              تحميل
            </button>
          </div>
        </div>
      )}

      {/* إذا كان المستخدم لا يريد عرض التقرير، نتوقف هنا */}
      {apiResponse && !showReport && (
        <div className="p-4 text-center text-gray-400">
          <p className="text-sm">اضغط على "عرض التقرير" لرؤية التحليل التفصيلي</p>
        </div>
      )}

      {/* عرض التقرير إذا لم يكن هناك رد API أو إذا اختار المستخدم عرضه */}
      {(!apiResponse || showReport) && (
        <>
          {intelligenceDossiers.length === 0 ? (
            <div className="p-4 text-yellow-200 rounded-xl border border-yellow-700 shadow-lg bg-yellow-900/30">
              <Shield className="inline mr-1 w-4 h-4 text-yellow-400" />
              لم يتم العثور على أي نتائج للمصطلح <span className="font-bold text-yellow-400">"{query}"</span>.
            </div>
          ) : (
            <>
              {/* إحصاءات النتائج */}
              <div className="p-4 rounded-xl border border-gray-700 bg-gray-800/70">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex gap-2 items-center">
                    <Zap className="w-4 h-4 text-green-400" />
                    <span>عدد النتائج: <span className="text-green-300">{intelligenceDossiers.length}</span></span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Filter className="w-4 h-4 text-blue-400" />
                    <span>عدد الأقسام: <span className="text-blue-300">{new Set(intelligenceDossiers.map(d => d.sourceFile)).size}</span></span>
                  </div>
                </div>
              </div>

              {/* عرض النتائج */}
              <div className="space-y-4">
                {intelligenceDossiers.slice(0, 10).map((dossier, index) => (
                  <div key={index} className="p-4 bg-gray-800 rounded-xl border border-gray-700">
                    <div className="flex gap-2 items-center mb-3">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <h3 className="font-semibold text-white">{dossier.subject}</h3>
                      <span className="px-2 py-1 text-xs text-gray-300 bg-gray-700 rounded">
                        درجة الصلة: {dossier.relevanceScore}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-300">
                      {Object.entries(dossier.content).slice(0, 3).map(([key, value]) => {
                        if (typeof value === 'string' && value.toLowerCase().includes(lowerQuery)) {
                          return (
                            <div key={key} className="p-2 rounded bg-gray-700/50">
                              <span className="font-semibold text-gray-400">{key}:</span>
                              <div className="mt-1">{highlightText(value, lowerQuery)}</div>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <CopyButton text={JSON.stringify(dossier.content, null, 2)} fileName={`${dossier.subject}.json`} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* نهاية التقرير */}
          <div id="smart-report-bottom" className="p-4 mt-6 text-center text-gray-400 rounded-xl border border-gray-700 bg-gray-800/50">
            <div className="flex gap-4 justify-center mb-3">
              <button onClick={scrollToTop} title="العودة للأعلى" className="flex gap-2 items-center px-3 py-1 text-white bg-gray-600 rounded-full hover:bg-gray-700">
                <ChevronUp className="w-5 h-5" />
                <span className="text-sm">إلى الأعلى</span>
              </button>
            </div>
            <p className="text-sm">انتهى التقرير الاستخباراتي عن "{query}"</p>
          </div>
        </>
      )}
    </div>
  );
};

/**
 * دالة مساعدة للحصول على نص بسيط من التقرير (للاستخدام في ChatInterface)
 */
export const getSmartResponse = (query) => {
  const lowerQuery = (query || '').toLowerCase().trim();
  
  if (!lowerQuery) {
    return 'يرجى تحديد مصطلح للتحقيق فيه.';
  }

  // البحث السريع للحصول على نتيجة نصية
  let results = [];
  
  Object.entries(allData).forEach(([fileName, dataset]) => {
    if (!Array.isArray(dataset)) return;

    dataset.forEach((entry) => {
      let relevanceScore = 0;
      const subjectName = entry.name || entry.title || entry.sender || 'مجهول';

      // البحث في الحقول المهمة
      const importantFields = { name: 10, title: 8, content: 7, message: 7, text: 6 };

      Object.entries(importantFields).forEach(([field, weight]) => {
        if (entry[field] && typeof entry[field] === 'string') {
          const fieldValue = entry[field].toLowerCase();
          if (fieldValue.includes(lowerQuery)) relevanceScore += weight;
        }
      });

      if (relevanceScore > 0) {
        results.push({
          subject: subjectName,
          content: entry,
          relevanceScore: relevanceScore
        });
      }
    });
  });

  results.sort((a, b) => b.relevanceScore - a.relevanceScore);

  if (results.length === 0) {
    return `لم يتم العثور على أي نتائج للمصطلح "${query}".`;
  }

  // إرجاع ملخص نصي للنتائج الأولى
  const topResults = results.slice(0, 3);
  let summary = `تم العثور على ${results.length} نتيجة للبحث عن "${query}":\n\n`;
  
  topResults.forEach((result, index) => {
    summary += `${index + 1}. ${result.subject}\n`;
    
    // إضافة بعض التفاصيل من المحتوى
    const content = result.content;
    if (content.name && content.relationship_to_user) {
      summary += `   - العلاقة: ${content.relationship_to_user}\n`;
    }
    if (content.definition) {
      summary += `   - التعريف: ${content.definition.substring(0, 100)}...\n`;
    }
    if (content.background) {
      summary += `   - الخلفية: ${content.background.substring(0, 100)}...\n`;
    }
    summary += '\n';
  });

  if (results.length > 3) {
    summary += `... و ${results.length - 3} نتائج أخرى.`;
  }

  return summary;
};

