// src/pages/MapPage.jsx
import React, { useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react'

// --- المواقع (غيّرها كما تحب) ---
const locations = [
  {
    id: 1,
    name: "محطة الرمل — محمد عبدالمجيد الزيات (مارييت سابقاً)",
    position: [31.2015, 29.901],
    description: "٤ ش د/ محمد عبدالمجيد الزيات (مارييت سابقاً) محطة الرمل - قسم العطارين شارع فؤاد, طريق الحرية، محافظة الإسكندرية 21521",
    date: "مكان مهم",
    images: ['/WhatsApp Image 2025-08-17 at 1.38.47 AM.jpeg']
  },
  {
    id: 2,
    name: "مكان ثاني (مثال)",
    position: [31.2050, 29.9150],
    description: "وصف موجز للمكان الثاني",
    date: "10 يوليو 2021",
    images: ['/WhatsApp Image 2025-08-17 at 1.38.55 AM.jpeg']
  },
  {
    id: 3,
    name: "مكان ثالث (مثال)",
    position: [31.1980, 29.9050],
    description: "مكان ثالث في الإسكندرية - مثال",
    date: "22 أبريل 2020",
    images: ['/WhatsApp Image 2025-08-17 at 1.38.56 AM.jpeg']
  }
]

// أيقونة مخصصة بسيطة
const createIcon = (color = '#e11d48') => new L.DivIcon({
  html: `<div style="
    width:36px;height:36px;
    display:flex;align-items:center;justify-content:center;
    border-radius:50%;
    background: ${color};
    box-shadow: 0 8px 18px rgba(2,6,23,0.18);
    color:white;font-weight:700;
  ">💗</div>`,
  className: ''
})

export default function MapPage() {
  const polylinePositions = locations.map(l => l.position)
  const mapRef = useRef(null)
  const currentIndexRef = useRef(0)

  const goToIndex = (i) => {
    const idx = (i + locations.length) % locations.length
    currentIndexRef.current = idx
    const latlng = locations[idx].position
    const map = mapRef.current
    if (map) map.flyTo(latlng, 16, { duration: 0.8 })
  }

  const next = () => goToIndex(currentIndexRef.current + 1)
  const prev = () => goToIndex(currentIndexRef.current - 1)
  const fitAll = () => {
    const map = mapRef.current
    if (!map) return
    const bounds = L.latLngBounds(polylinePositions)
    map.fitBounds(bounds.pad(0.25))
  }

  return (
    <div className="p-4 min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-100 dark:from-slate-900 dark:to-cyan-950">
      <div className="mx-auto max-w-6xl">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-emerald-700 dark:text-emerald-200">خريطة ذكرياتنا</h1>
<div className="flex gap-2">
  <button
    onClick={() => window.history.back()}
    className="flex justify-center items-center w-10 h-10 text-emerald-600 bg-white rounded-full shadow-md transition hover:bg-emerald-50 dark:bg-slate-800 dark:text-emerald-400 dark:hover:bg-slate-700"
  >
    <ArrowLeft size={20} />
  </button>
</div>

          {/* ===== الأزرار الأنيقة (Prev / Fit / Next) ===== */}
         
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* الخريطة */}
          <div className="overflow-hidden rounded-2xl border shadow-lg lg:col-span-2">
            <MapContainer
              whenCreated={(map) => (mapRef.current = map)}
              center={locations[0].position}
              zoom={14}
              scrollWheelZoom={true}
              style={{ height: '560px', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Polyline positions={polylinePositions} pathOptions={{ color: '#06b6d4', weight: 4, dashArray: '6' }} />

              {locations.map((loc, idx) => (
                <Marker
                  key={loc.id}
                  position={loc.position}
                  icon={createIcon(idx === 0 ? '#fb7185' : '#06b6d4')}
                  eventHandlers={{
                    click: () => {
                      currentIndexRef.current = idx
                    }
                  }}
                >
                  <Popup>
                    <div className="max-w-xs">
                      <h3 className="text-lg font-bold">{loc.name}</h3>
                      <p className="text-sm text-gray-600">{loc.date}</p>
                      <p className="mt-2 text-sm">{loc.description}</p>
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        {loc.images && loc.images.map((img, i) => (
                          <img key={i} src={img} alt="" className="object-cover w-full h-20 rounded" />
                        ))}
                      </div>
                      <div className="mt-3 text-right">
                        <button onClick={() => {
                          const map = mapRef.current
                          if (map) map.flyTo(loc.position, 16, { duration: 0.8 })
                        }} className="px-3 py-1 text-sm text-white bg-emerald-500 rounded-md">انتقل</button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}

            </MapContainer>
          </div>

          {/* البطاقة الجانبية */}
          <aside className="p-4 bg-white rounded-2xl border shadow-inner dark:bg-slate-800">
            <h2 className="mb-2 text-xl font-semibold text-emerald-700 dark:text-emerald-200">الموقع المحدد</h2>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
              اضغط على أي Marker لرؤية التفاصيل، أو استخدم أزرار التالي / السابق للتنقّل.
            </p>

            <div className="space-y-4">
              {locations.map((loc, idx) => (
                <motion.button
                  key={loc.id}
                  onClick={() => {
                    currentIndexRef.current = idx
                    const map = mapRef.current
                    if (map) map.flyTo(loc.position, 16, { duration: 0.9 })
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="flex justify-between items-center p-3 w-full text-right bg-emerald-50 rounded-lg transition dark:bg-slate-900 hover:shadow-md"
                >
                  <div>
                    <div className="font-medium text-emerald-700 dark:text-emerald-200">{loc.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{loc.date}</div>
                  </div>
                  <div className="text-sm text-gray-500">✦</div>
                </motion.button>
              ))}
            </div>
          </aside>
        </div>
      </div>
      {/* <Navigation  /> */}
    </div>
  )
}
