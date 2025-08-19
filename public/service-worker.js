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
      "كل يوم بفتكر قد إيه إنتي فارقة معايا ❤️",
      "من غيرك الدنيا ملهاش طعم.",
      "إنتي أول حد بييجي في بالي قبل ما أنام.",
      "حتى في عز الزحمة، صورتك في دماغي.",
      "إنتي مش مجرد حب.. إنتي حياة كاملة.",
      "مبسوط إني لسه بلاقي نفسي في وجودك.",
      "إنتي الشخص اللي بيديني أمل في بكرة.",
      "مع كل ذكرى لينا، بحس إني أغنى إنسان.",
      "إنتي السبب إني بتحدى الدنيا كل يوم.",
      "كل رسائلي قليلة قدام اللي جوا قلبي ليكي."
    ];
    
    
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    
    self.registration.showNotification('رسالة حب ❤️', {
      body: randomMsg,
      icon: '/heart-icon.png',
      vibrate: [200, 100, 200],
      tag: 'love-notification'
    });
  }