import React, { useState, useEffect } from 'react';
import { SkyMap } from './components/SkyMap';
import { Star, Planet } from './types/celestial';
import { Filter } from 'lucide-react';
import { loadStarData } from './utils/dataLoader';

function App() {
  const [stars, setStars] = useState<Star[]>([]);
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'nearest' | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const starData = await loadStarData();
        if (starData.length === 0) {
          throw new Error('No star data loaded');
        }
        // Filtrer les étoiles visibles à l'œil nu (magnitude < 6)
        const visibleStars = starData.filter(star => star.mag < 6);
        setStars(visibleStars);

        // Données des planètes (positions approximatives)
        const mockPlanets: Planet[] = [
          { id: 'mercury', name: 'Mercury', ra: 2, dec: 10, magnitude: -0.5, distance: 0.4, color: '#E5E5E5' },
          { id: 'venus', name: 'Venus', ra: 4, dec: 20, magnitude: -4.4, distance: 0.7, color: '#FFA500' },
          { id: 'mars', name: 'Mars', ra: 6, dec: 30, magnitude: -2.9, distance: 1.5, color: '#FF4500' },
          { id: 'jupiter', name: 'Jupiter', ra: 8, dec: 40, magnitude: -2.7, distance: 5.2, color: '#DEB887' },
          { id: 'saturn', name: 'Saturn', ra: 10, dec: 50, magnitude: 0.6, distance: 9.5, color: '#FFD700' }
        ];
        setPlanets(mockPlanets);
        setError(null);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load star data. Please ensure the data file is in the correct location.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const filteredStars = selectedFilter === 'nearest'
    ? [...stars].sort((a, b) => a.dist - b.dist).slice(0, 50)
    : stars;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading sky map...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl bg-red-900/50 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="fixed top-4 left-4 z-10 bg-white/90 p-4 rounded-lg shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} />
          <h2 className="font-semibold">Filtres</h2>
        </div>
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value as 'nearest' | 'all')}
          className="w-full p-2 rounded border border-gray-300"
        >
          <option value="all">Toutes les étoiles</option>
          <option value="nearest">50 étoiles les plus proches</option>
        </select>
      </div>
      <SkyMap
        stars={filteredStars}
        planets={planets}
        selectedFilter={selectedFilter}
      />
    </div>
  );
}

export default App;