import React, { useEffect, useRef, useState } from 'react';
import { Star, Planet } from '../types/celestial';
import { Info } from 'lucide-react';

interface SkyMapProps {
  stars: Star[];
  planets: Planet[];
  selectedFilter: 'nearest' | 'all';
}

export function SkyMap({ stars, planets, selectedFilter }: SkyMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredObject, setHoveredObject] = useState<Star | Planet | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Clear canvas
    ctx.fillStyle = '#000033';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars
    const visibleStars = selectedFilter === 'nearest' 
      ? stars.slice(0, 50) 
      : stars;

    visibleStars.forEach(star => {
      const x = (star.ra / 24) * canvas.width;
      const y = ((star.dec + 90) / 180) * canvas.height;
      
      ctx.beginPath();
      ctx.arc(x, y, Math.max(3, (6 - star.mag) * 0.5), 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    });

    // Draw planets
    planets.forEach(planet => {
      const x = (planet.ra / 24) * canvas.width;
      const y = ((planet.dec + 90) / 180) * canvas.height;
      
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = planet.color;
      ctx.fill();
    });
  }, [stars, planets, selectedFilter]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x: e.clientX, y: e.clientY });

    // Find hovered object
    const hoveredStar = stars.find(star => {
      const starX = (star.ra / 24) * canvas.width;
      const starY = ((star.dec + 90) / 180) * canvas.height;
      return Math.sqrt(Math.pow(x - starX, 2) + Math.pow(y - starY, 2)) < 5;
    });

    const hoveredPlanet = planets.find(planet => {
      const planetX = (planet.ra / 24) * canvas.width;
      const planetY = ((planet.dec + 90) / 180) * canvas.height;
      return Math.sqrt(Math.pow(x - planetX, 2) + Math.pow(y - planetY, 2)) < 5;
    });

    setHoveredObject(hoveredStar || hoveredPlanet);
  };

  return (
    <div className="relative w-full h-screen">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        className="w-full h-full"
      />
      {hoveredObject && (
        <div
          className="absolute bg-white/90 p-4 rounded-lg shadow-lg"
          style={{
            left: mousePos.x + 10,
            top: mousePos.y + 10,
          }}
        >
          <div className="flex items-center gap-2">
            <Info size={16} />
            <h3 className="font-semibold">{hoveredObject.name || 'Unknown Object'}</h3>
          </div>
          {'constellation' in hoveredObject && hoveredObject.constellation && (
            <p className="text-sm text-gray-600">
              Constellation: {hoveredObject.constellation}
            </p>
          )}
          {'magnitude' in hoveredObject && (
            <p className="text-sm text-gray-600">
              Magnitude: {hoveredObject.magnitude.toFixed(2)}
            </p>
          )}
          {'dist' in hoveredObject && (
            <p className="text-sm text-gray-600">
              Distance: {hoveredObject.dist.toFixed(2)} parsecs
            </p>
          )}
        </div>
      )}
    </div>
  );
}