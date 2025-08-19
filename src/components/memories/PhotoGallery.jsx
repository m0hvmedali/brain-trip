import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const photos = [
  { id: 1, src: '/WhatsApp Image 2025-08-17 at 1.38.47 AM.jpeg' },
  { id: 2, src: '/WhatsApp Image 2025-08-17 at 1.38.55 AM.jpeg' },
  { id: 3, src: '/WhatsApp Image 2025-08-17 at 1.38.56 AM (1).jpeg'},
  { id: 4, src: '/WhatsApp Image 2025-08-17 at 1.38.56 AM.jpeg' },
  { id: 5, src: '/WhatsApp Image 2025-08-17 at 1.38.57 AM.jpeg' },
  { id: 6, src: '/WhatsApp Image 2025-08-17 at 1.39.00 AM.jpeg'},
  { id: 7, src: '/WhatsApp Image 2025-08-17 at 1.39.01 AM.jpeg'},
  { id: 8, src: '/WhatsApp Image 2025-08-17 at 1.39.02 AM.jpeg' },
  { id: 9, src: '/WhatsApp Image 2025-08-17 at 1.39.04 AM (1).jpeg' },
  { id: 10, src: '/WhatsApp Image 2025-08-17 at 1.39.04 AM.jpeg'},
  { id: 11, src: '/WhatsApp Image 2025-08-17 at 1.39.05 AM.jpeg' },
  { id: 12, src: '/WhatsApp Image 2025-08-17 at 1.39.06 AM.jpeg' },
  { id: 13, src: '/WhatsApp Image 2025-08-17 at 1.39.07 AM.jpeg'},
  { id: 14, src: '/WhatsApp Image 2025-08-17 at 1.39.08 AM (1).jpeg' },
  { id: 15, src: '/WhatsApp Image 2025-08-17 at 1.39.08 AM.jpeg'},
  { id: 16, src: '/WhatsApp Image 2025-08-17 at 1.39.09 AM.jpeg' },
    { id: 17, src: '/WhatsApp Image 2025-08-17 at 1.39.10 AM (1).jpeg'},
  { id: 18, src: '/WhatsApp Image 2025-08-17 at 1.39.10 AM.jpeg'},
  { id: 19, src: '/WhatsApp Image 2025-08-17 at 1.39.11 AM (1).jpeg' },
  { id: 20, src: '/WhatsApp Image 2025-08-17 at 1.39.11 AM (2).jpeg'},
  { id: 21, src: '/WhatsApp Image 2025-08-17 at 1.39.11 AM.jpeg'},
  { id: 22, src: '/WhatsApp Image 2025-08-17 at 1.39.12 AM (1).jpeg' },
  { id: 23, src: '/WhatsApp Image 2025-08-17 at 1.39.12 AM.jpeg'},
  { id: 24, src: '/WhatsApp Image 2025-08-17 at 1.39.16 AM (1).jpeg' },
  { id: 25, src: '/WhatsApp Image 2025-08-17 at 1.39.16 AM.jpeg'},
  { id: 26, src: '/WhatsApp Image 2025-08-17 at 1.39.17 AM (1).jpeg' },
  { id: 27, src: '/WhatsApp Image 2025-08-17 at 1.39.17 AM.jpeg'},
  { id: 28, src: '/WhatsApp Image 2025-08-17 at 1.39.18 AM (1).jpeg' },
  { id: 29, src: '/WhatsApp Image 2025-08-17 at 1.39.18 AM.jpeg'},
  { id: 30, src: '/WhatsApp Image 2025-08-17 at 1.39.19 AM.jpeg' },
  { id: 31, src: '/WhatsApp Image 2025-08-17 at 1.39.20 AM.jpeg'},
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
