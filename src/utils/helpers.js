// تنسيق التاريخ
export const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('ar-EG', options);
  };
  
  // تنسيق الوقت
  export const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // إنشاء تأخير
  export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  // توليد ألوان عشوائية
  export const getRandomColor = () => {
    const colors = [
      'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
      'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
      'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300',
      'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
      'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  // تقصير النص
  export const truncateText = (text, maxLength = 100) => {
    return text.length > maxLength 
      ? text.substring(0, maxLength) + '...' 
      : text;
  };