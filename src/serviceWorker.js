// src/serviceWorker.js
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'love-notifications') {
      event.waitUntil(showNotification());
    }
  });
  
  function showNotification() {
    const messages = ["أفكر فيكِ ❤️", "أشتاق إليكِ...", "أنتِ أجمل شيء في حياتي"];
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    
    self.registration.showNotification('رسالة حب ❤️', {
      body: randomMsg,
      icon: '/heart-icon.png',
      vibrate: [200, 100, 200]
    });
  }