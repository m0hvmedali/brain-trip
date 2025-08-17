// تسجيل خدمة الإشعارات
export const registerNotificationService = () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
          requestNotificationPermission();
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    } else {
      console.warn('Push notifications are not supported in this browser');
    }
  };
  
  // طلب إذن الإشعارات
  const requestNotificationPermission = () => {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('Notification permission granted');
        schedulePeriodicNotifications();
      }
    });
  };
  
  // جدولة الإشعارات الدورية
  const schedulePeriodicNotifications = () => {
    if ('periodicSync' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        try {
          registration.periodicSync.register('love-reminders', {
            minInterval: 6 * 60 * 60 * 1000 // كل 6 ساعات
          }).then(() => {
            console.log('Periodic sync registered');
          });
        } catch (error) {
          console.log('Periodic sync could not be registered', error);
        }
      });
    } else {
      console.log('Periodic Background Sync is not supported in this browser');
      // بديل للمتصفحات التي لا تدعم PeriodicSync
      setInterval(showNotification, 6 * 60 * 60 * 1000);
    }
  };
  
  // عرض الإشعار
  export const showNotification = () => {
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
    
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(reg => {
        if (reg) {
          reg.showNotification('رسالة حب ❤️', {
            body: randomMsg,
            icon: '/heart-icon.png',
            vibrate: [200, 100, 200],
            tag: 'love-notification'
          });
        } else {
          fallbackNotification(randomMsg);
        }
      });
    } else {
      fallbackNotification(randomMsg);
    }
  };
  
  // بديل لعرض الإشعارات
  const fallbackNotification = (message) => {
    if (Notification.permission === 'granted') {
      new Notification('رسالة حب ❤️', {
        body: message,
        icon: '/heart-icon.png'
      });
    }
  };