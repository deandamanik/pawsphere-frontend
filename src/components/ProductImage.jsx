import { useState } from 'react';
import { resolveProductImage } from '../lib/productImage';

export default function ProductImage({ src, alt, className }) {
  const resolved = resolveProductImage(src);
  const [failedSource, setFailedSource] = useState(null);
  if (!resolved || failedSource === resolved) {
    return <span role="img" aria-label={alt || 'Gambar produk tidak tersedia'} className="flex h-full w-full items-center justify-center bg-gray-50 p-3 text-center text-xs text-gray-400">Gambar tidak tersedia</span>;
  }
  return <img src={resolved} alt={alt} className={className} onError={() => setFailedSource(resolved)} />;
}
