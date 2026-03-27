import { useState } from "react";

interface CampusImageProps {
  src: string;
  alt: string;
  className?: string;
  overlay?: boolean;
}

const CampusImage = ({ src, alt, className = "", overlay = true }: CampusImageProps) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (error) {
    return (
      <div className={`flex items-center justify-center hero-gradient ${className}`}>
        <span className="text-lg font-bold text-foreground/80">NIT Durgapur</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setError(true)}
        onLoad={() => setLoaded(true)}
        className={`h-full w-full object-cover transition-opacity duration-400 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      )}
    </div>
  );
};

export default CampusImage;
