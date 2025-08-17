import React from 'react'
import { ArrowUp, ArrowDown } from 'lucide-react'

export default function ScrollButtons({ onScrollTop, onScrollBottom }) {
  return (
    <div className="flex space-x-2">
      <button
        onClick={onScrollTop}
        className="dark:text-white/80 text-gray-800/80"
      >

        <ArrowUp />
      </button>
      <button
        onClick={onScrollBottom}
        className="dark:text-white/80 text-gray-800/80"
      >
        <ArrowDown />
      </button>
    </div>
  )
}
