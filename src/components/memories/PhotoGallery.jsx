import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const photos = [
  { id: 1, src: '/WhatsApp Image 2025-08-17 at 1.38.47 AM.jpeg', caption: 'ذكرى أول لقاء', date: 'يناير 2020' },
  { id: 2, src: '/WhatsApp Image 2025-08-17 at 1.38.55 AM.jpeg', caption: 'رحلة إلى الجبل', date: 'مارس 2020' },
  { id: 3, src: '/WhatsApp Image 2025-08-17 at 1.38.56 AM (1).jpeg', caption: 'عيد ميلاد سعيد', date: 'مايو 2020' },
  { id: 4, src: '/WhatsApp Image 2025-08-17 at 1.38.56 AM.jpeg', caption: 'شاطئ الأحلام', date: 'يوليو 2020' },
  { id: 5, src: '/WhatsApp Image 2025-08-17 at 1.38.57 AM.jpeg', caption: 'ليلة النجوم', date: 'سبتمبر 2020' },
  { id: 6, src: '/WhatsApp Image 2025-08-17 at 1.39.00 AM.jpeg', caption: 'عيد الحب', date: 'فبراير 2021' },
  { id: 7, src: '/WhatsApp Image 2025-08-17 at 1.39.01 AM.jpeg', caption: 'لحظة سعيدة', date: 'مارس 2021' },
  { id: 8, src: '/WhatsApp Image 2025-08-17 at 1.39.02 AM.jpeg', caption: 'رحلة إلى البحر', date: 'أبريل 2021' },
  { id: 9, src: '/WhatsApp Image 2025-08-17 at 1.39.04 AM (1).jpeg', caption: 'أمسية رومانسية', date: 'يونيو 2021' },
  { id: 10, src: '/WhatsApp Image 2025-08-17 at 1.39.04 AM.jpeg', caption: 'سعادة مطلقة', date: 'يوليو 2021' },
  { id: 11, src: '/WhatsApp Image 2025-08-17 at 1.39.05 AM.jpeg', caption: 'ذكريات الصيف', date: 'أغسطس 2021' },
  { id: 12, src: '/WhatsApp Image 2025-08-17 at 1.39.06 AM.jpeg', caption: 'لحظات عائلية', date: 'سبتمبر 2021' },
  { id: 13, src: '/WhatsApp Image 2025-08-17 at 1.39.07 AM.jpeg', caption: 'حفلة صغيرة', date: 'أكتوبر 2021' },
  { id: 14, src: '/WhatsApp Image 2025-08-17 at 1.39.08 AM (1).jpeg', caption: 'ليلة النجوم', date: 'نوفمبر 2021' },
  { id: 15, src: '/WhatsApp Image 2025-08-17 at 1.39.08 AM.jpeg', caption: 'رحلة قصيرة', date: 'ديسمبر 2021' },
  { id: 16, src: '/WhatsApp Image 2025-08-17 at 1.39.09 AM.jpeg', caption: 'لحظة حب', date: 'يناير 2022' },
  { id: 17, src: '/WhatsApp Image 2025-08-17 at 1.39.10 AM (1).jpeg', caption: 'ذكرى خاصة', date: 'فبراير 2022' },
  { id: 18, src: '/WhatsApp Image 2025-08-17 at 1.39.10 AM.jpeg', caption: 'سعادة كبيرة', date: 'مارس 2022' },
  { id: 19, src: '/WhatsApp Image 2025-08-17 at 1.39.11 AM (1).jpeg', caption: 'أمسية رومانسية', date: 'أبريل 2022' },
  { id: 20, src: '/WhatsApp Image 2025-08-17 at 1.39.11 AM (2).jpeg', caption: 'رحلة ممتعة', date: 'مايو 2022' },
  { id: 21, src: '/WhatsApp Image 2025-08-17 at 1.39.11 AM.jpeg', caption: 'ليلة سعيدة', date: 'يونيو 2022' },
  { id: 22, src: '/WhatsApp Image 2025-08-17 at 1.39.12 AM (1).jpeg', caption: 'ذكريات جميلة', date: 'يوليو 2022' },
  { id: 23, src: '/WhatsApp Image 2025-08-17 at 1.39.12 AM.jpeg', caption: 'لحظات ممتعة', date: 'أغسطس 2022' },
  { id: 24, src: '/WhatsApp Image 2025-08-17 at 1.39.16 AM (1).jpeg', caption: 'رحلة للأصدقاء', date: 'سبتمبر 2022' },
  { id: 25, src: '/WhatsApp Image 2025-08-17 at 1.39.16 AM.jpeg', caption: 'أيام جميلة', date: 'أكتوبر 2022' },
  { id: 26, src: '/WhatsApp Image 2025-08-17 at 1.39.17 AM (1).jpeg', caption: 'لحظات رومانسية', date: 'نوفمبر 2022' },
  { id: 27, src: '/WhatsApp Image 2025-08-17 at 1.39.17 AM.jpeg', caption: 'حفلة صغيرة', date: 'ديسمبر 2022' },
  { id: 28, src: '/WhatsApp Image 2025-08-17 at 1.39.18 AM (1).jpeg', caption: 'ذكريات الشتاء', date: 'يناير 2023' },
  { id: 29, src: '/WhatsApp Image 2025-08-17 at 1.39.18 AM.jpeg', caption: 'لحظة سعادة', date: 'فبراير 2023' },
  { id: 30, src: '/WhatsApp Image 2025-08-17 at 1.39.19 AM.jpeg', caption: 'رحلة رومانسية', date: 'مارس 2023' },
  { id: 31, src: '/WhatsApp Image 2025-08-17 at 1.39.20 AM.jpeg', caption: 'أمسية جميلة', date: 'أبريل 2023' },
];

export default function PhotoGallery() {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const filteredPhotos = filter === 'all'
    ? photos
    : photos.filter(photo => photo.date.includes(filter));

  return (
    <div className="p-4">
     

      {/* شبكة الصور */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {filteredPhotos.map(photo => (
          <motion.div
            key={photo.id}
            whileHover={{ scale: 1.03 }}
            className="overflow-hidden relative rounded-xl shadow-lg cursor-pointer group"
            onClick={() => setSelected(photo)}
          >
            {/* الصورة نفسها */}
            <img
              src={photo.src}
              alt={photo.caption}
              className="object-cover w-full h-full rounded-xl aspect-square"
            />

            {/* Overlay للنصوص */}
            <div className="flex absolute inset-0 flex-col justify-end p-3 bg-gradient-to-t to-transparent from-black/30">
              <h3 className="font-bold text-white">{photo.caption}</h3>
              <p className="text-sm text-rose-200">{photo.date}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Zoom / Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.img
              src={selected.src}
              alt={selected.caption}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="max-w-full max-h-full rounded-lg shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
