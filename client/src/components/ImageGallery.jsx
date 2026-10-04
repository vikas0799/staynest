import { useState } from 'react';

export default function ImageGallery({ images, title }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <div className="image-gallery" style={{ marginBottom: '24px' }}>
      <div className="main-image-container" style={{ position: 'relative' }}>
        <img 
          className="hero-img" 
          src={images[currentIndex]} 
          alt={title} 
          style={{ width: '100%', maxHeight: '460px', objectFit: 'cover', borderRadius: '12px' }} 
        />
        {images.length > 1 && (
          <>
            <button 
              onClick={() => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
              style={{
                position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%',
                width: '40px', height: '40px', cursor: 'pointer', fontSize: '1.2rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              &#10094;
            </button>
            <button 
              onClick={() => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
              style={{
                position: 'absolute', top: '50%', right: '16px', transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%',
                width: '40px', height: '40px', cursor: 'pointer', fontSize: '1.2rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              &#10095;
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="thumbnail-list" style={{ display: 'flex', gap: '12px', overflowX: 'auto', marginTop: '12px', paddingBottom: '8px' }}>
          {images.map((img, idx) => (
            <img 
              key={idx} 
              src={img} 
              alt={`Thumbnail ${idx + 1}`} 
              onClick={() => setCurrentIndex(idx)}
              style={{
                width: '120px',
                height: '80px',
                objectFit: 'cover',
                cursor: 'pointer',
                borderRadius: '8px',
                border: currentIndex === idx ? '2px solid var(--primary)' : '2px solid transparent',
                opacity: currentIndex === idx ? 1 : 0.6,
                transition: 'all 0.2s ease'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
