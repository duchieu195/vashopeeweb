import { useState } from 'react';

interface Props {
  images: string[];
  productName: string;
}

export default function ImageGallery({ images, productName }: Props) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
        <img
          src={images[selected]}
          alt={productName}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-colors ${
                i === selected ? 'border-primary' : 'border-transparent'
              }`}
            >
              <img src={img} alt={`${productName} ${i + 1}`} loading="lazy" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
