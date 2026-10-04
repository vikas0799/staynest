import { useState } from 'react';
import './ImageGallery.css';


const FALLBACK = 'https://placehold.co/800x500?text=StayNest';

export default function ImageGallery({ images = [], title = '' }) {
  const imgs = images.length > 0 ? images : [FALLBACK];
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className="gallery">
      {/* Main image */}
      <img
        className="gallery-main hero-img"
        src={imgs[activeIdx]}
        alt={`${title} — image ${activeIdx + 1} of ${imgs.length}`}
        onError={(e) => { e.currentTarget.src = FALLBACK; }}
      />

      {/* Thumbnails — only show when there are multiple images */}
      {imgs.length > 1 && (
        <div className="gallery-thumbs" role="list" aria-label="Image thumbnails">
          {imgs.map((src, i) => (
            <button
              key={i}
              type="button"
              role="listitem"
              className={`gallery-thumb-btn${i === activeIdx ? ' gallery-thumb-active' : ''}`}
              onClick={() => setActiveIdx(i)}
              aria-label={`View image ${i + 1} of ${imgs.length}`}
              aria-pressed={i === activeIdx}
            >
              <img
                src={src}
                alt={`${title} thumbnail ${i + 1}`}
                onError={(e) => { e.currentTarget.src = FALLBACK; }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
