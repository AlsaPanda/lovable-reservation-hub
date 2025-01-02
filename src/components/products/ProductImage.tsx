import React from "react";

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b";

interface ProductImageProps {
  imageUrl: string | null;
  altText: string;
}

const ProductImage = ({ imageUrl, altText }: ProductImageProps) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = DEFAULT_IMAGE;
  };

  return (
    <div className="relative w-full h-[200px] overflow-hidden rounded-md">
      <img 
        src={imageUrl || DEFAULT_IMAGE}
        alt={altText}
        onError={handleImageError}
        className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-105"
      />
    </div>
  );
};

export default ProductImage;