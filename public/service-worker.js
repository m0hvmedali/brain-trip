// تسجيل الحدث عند تثبيت Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('love-journey-cache').then((cache) => {
        return cache.addAll([
          '/',
          '/index.html',
          '/manifest.json',
          '/heart-icon.png',
          // يمكن إضافة المزيد من الموارد التي تريد تخزينها مؤقتًا
        ]);
      })
    );
  });
  
  // استراتيجية التخزين المؤقت: التخزين المؤقت أولاً ثم الشبكة
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });
  
  // خدمة الإشعارات الدورية
// In service-worker.js
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      // Add fallback logic:
      return new Response('Fallback content', { status: 200 });
    })
  );
});
  
  // دالة لعرض الإشعار
  function showNotification() {
    const messages = [
      "أفكر فيكِ ❤️",
      "أشتاق إليكِ...",
      "أنتِ أجمل شيء في حياتي",
      "أحبك أكثر من الأمس وأقل من الغد",
      "رحلة حبنا أجمل قصة سأحكيها طوال حياتي",
      "شكرًا لأنكِ تجعلين كل يوم خاصًا",
      "لحظة واحدة معكِ تساوي ألف لحظة",
      "أنتِ سبب ابتسامتي في الصباح",
      "قلبي ينبض لأجلكِ فقط",
      "لا يمكنني الانتظار حتى أراكِ مجددًا"
    ];
    
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    
    self.registration.showNotification('رسالة حب ❤️', {
      body: randomMsg,
      icon: '/heart-icon.png',
      vibrate: [200, 100, 200],
      tag: 'love-notification'
    });
  }