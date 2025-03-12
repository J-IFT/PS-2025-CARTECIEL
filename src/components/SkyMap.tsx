import React, { useEffect, useRef, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Star, Planet } from '../types/celestial';
import { CONSTELLATIONS } from './constellations';
import { Info } from 'lucide-react';

interface SkyMapProps {
  stars: Star[];
  planets: Planet[];
  selectedFilter: 'nearest' | 'brightest' | 'all' | 'hottest' | 'biggest';
  scale: number;
}

function calculateTemperatureFromMag(MV: number): number {
  const temperature = 4600 * (1 / (MV + 0.1)) + 3000;
  
  if (temperature < 0) {
    return 0;
  }
  return temperature;
}

function calculatePlanetTemperature(distance: number): number {
  const temperature = 279 * Math.pow(1 / distance, 0.5);
  
  if (temperature < 0) {
    return 0;
  }

  return temperature;
}

function isStar(obj: Star | Planet): obj is Star {
  return (obj as Star).dist !== undefined;
}

function isPlanet(obj: Star | Planet): obj is Planet {
  return (obj as Planet).distance !== undefined;
}

export function SkyMap({ stars, planets, selectedFilter, scale }: SkyMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredObject, setHoveredObject] = useState<(Star | Planet) & { type: 'star' | 'planet' } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showConstellations, setShowConstellations] = useState(false);
  const [highlightedConstellation, setHighlightedConstellation] = useState<string | null>(null);

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

    // Apply scale
    ctx.save();
    ctx.scale(scale, scale);

    // Draw stars
    stars.forEach(star => {
      const x = (star.ra / 24) * canvas.width;
      const y = ((star.dec + 90) / 180) * canvas.height;

      const isHighlighted = highlightedConstellation && star.constellation === highlightedConstellation;

      ctx.beginPath();
      ctx.arc(x, y, Math.max(3, (6 - star.mag) * 0.5), 0, Math.PI * 2);
      ctx.fillStyle = isHighlighted ? '#FF4500' : '#ffffff';
      ctx.fill();
    });

    // Draw constellation lines if the star is part of the hovered constellation
    if (showConstellations) {
      Object.values(CONSTELLATIONS).forEach(constellation => {
        ctx.strokeStyle = 'rgb(74, 214, 18)';
        ctx.lineWidth = 1;
        constellation.lines.forEach(([star1, star2]) => {
          const s1 = stars.find(s => s.name === star1);
          const s2 = stars.find(s => s.name === star2);
          if (s1 && s2) {
            ctx.beginPath();
            ctx.moveTo((s1.ra / 24) * canvas.width, ((s1.dec + 90) / 180) * canvas.height);
            ctx.lineTo((s2.ra / 24) * canvas.width, ((s2.dec + 90) / 180) * canvas.height);
            ctx.stroke();
          }
        });
      });
    }

    // Draw planets
    planets.forEach(planet => {
      const x = (planet.ra / 24) * canvas.width;
      const y = ((planet.dec + 90) / 180) * canvas.height;

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = planet.color;
      ctx.fill();
    });

    ctx.restore();
  }, [stars, planets, selectedFilter, scale, hoveredObject, showConstellations, highlightedConstellation]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
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

    if (hoveredStar) {
      // Highlight all stars in the same constellation
      setHighlightedConstellation(hoveredStar.constellation || null);
      setHoveredObject({ ...hoveredStar, type: 'star' });

    } else if (hoveredPlanet) {
      setHoveredObject({ ...hoveredPlanet, type: 'planet' });
      setHighlightedConstellation(null);

    } else {
      setHoveredObject(null);
      setHighlightedConstellation(null);
    }
  };

  return (
    <TransformWrapper initialScale={1} minScale={0.5} maxScale={2} wheel={{ step: 0.1 }}>
      <div className="relative w-full h-screen">
        <TransformComponent>
          <canvas ref={canvasRef} onMouseMove={handleMouseMove} className="w-full h-full" />
        </TransformComponent>

        {hoveredObject && (
        <div
          className="absolute bg-white/90 p-4 rounded-lg shadow-lg max-w-xs"
          style={{
            left: mousePos.x + 10,
            top: mousePos.y + 10,
          }}
        >
          <div className="flex items-center gap-2">
            <Info size={16} />
            <h3 className="font-semibold">{hoveredObject.name || 'Nom Indisponible'}</h3>
          </div>
          {isStar(hoveredObject) && (
            <>
              <p className="text-sm text-gray-600">Distance: {hoveredObject.dist.toFixed(2)} parsecs</p>

              {hoveredObject.absmag !== undefined && (
                <p className="text-sm text-gray-600">
                  Température: {calculateTemperatureFromMag(hoveredObject.absmag).toFixed(0)} K
                </p>
              )}
              
              {hoveredObject.constellation && (
                <p className="text-sm text-gray-600">Constellation: {hoveredObject.constellation}</p>
              )}
            </>
          )}
          {isPlanet(hoveredObject) && (
            <>
              {hoveredObject.distance !== undefined && (
                <p className="text-sm text-gray-600">Distance: {hoveredObject.distance.toFixed(2)} UA</p>
              )}

              {hoveredObject.distance !== undefined && (
                <p className="text-sm text-gray-600">
                  Température: {calculatePlanetTemperature(hoveredObject.distance).toFixed(0)} K
                </p>
              )}

              {'description' in hoveredObject && hoveredObject.description && (
                <p className="text-sm text-gray-600 mt-2">{hoveredObject.description}</p>
              )}
            </>
          )}
        </div>
      )}

        {/* BOUTON ON/OFF CONSTELLATIONS */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setShowConstellations(!showConstellations)}
            className={`px-4 py-2 text-white font-semibold rounded-lg transition-all ${
              showConstellations ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'
            }`}
          >
            {showConstellations ? 'Masquer Constellations' : 'Afficher Constellations'}
          </button>
        </div>
      </div>
    </TransformWrapper>
  );
}