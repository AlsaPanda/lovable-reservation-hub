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
    <div className="relative aspect-video w-full overflow-hidden rounded-md">
      <img 
        src={imageUrl || DEFAULT_IMAGE}
        alt={altText}
        onError={handleImageError}
        className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105"
      />
    </div>
  );
};

export default ProductImage;