import { useState, useEffect } from 'react';
import { SkyMap } from './components/SkyMap';
import { Star, Planet } from './types/celestial';
import { Filter, Search, ZoomIn, ZoomOut } from 'lucide-react';
import { loadStarData } from './utils/dataLoader';
import WelcomeScreen from './components/WelcomeScreen';

function App() {
  const [stars, setStars] = useState<Star[]>([]);
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'nearest' | 'brightest' | 'hottest' | 'all' | 'biggest'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [scale, setScale] = useState(1);
  const [showWelcomePopup, setShowWelcomePopup] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const starData = await loadStarData();
        if (starData.length === 0) {
          throw new Error('No star data loaded');
        }
        const visibleStars = starData.filter(star => star.mag < 6);
        setStars(visibleStars);

        const mockPlanets: Planet[] = [
          { id: 'mercury', name: 'Mercure', ra: 2, dec: 10, magnitude: -0.5, distance: 0.4, color: '#E5E5E5', description: "Le plus petit et le plus proche du Soleil" },
          { id: 'venus', name: 'Venus', ra: 4, dec: 20, magnitude: -4.4, distance: 0.7, color: '#FFA500', description: "La planète la plus chaude du système solaire" },
          { id: 'earth', name: 'Terre', ra: 6, dec: 30, magnitude: -3.5, distance: 1, color: '#32CD32', description: "La planète bleue, notre maison" },
          { id: 'mars', name: 'Mars', ra: 7, dec: 35, magnitude: -2.9, distance: 1.5, color: '#FF4500', description: "La planète rouge, cible des futures missions habitées" },
          { id: 'jupiter', name: 'Jupiter', ra: 8, dec: 40, magnitude: -2.7, distance: 5.2, color: '#DEB887', description: "La plus grande planète du système solaire" },
          { id: 'saturn', name: 'Saturne', ra: 10, dec: 50, magnitude: 0.6, distance: 9.5, color: '#FFD700', description: "Célèbre pour ses anneaux spectaculaires" },
          { id: 'uranus', name: 'Uranus', ra: 12, dec: 60, magnitude: 5.4, distance: 19.2, color: '#00FFFF', description: "Une planète géante glacée" },
          { id: 'neptune', name: 'Neptune', ra: 14, dec: 70, magnitude: 7.8, distance: 30.1, color: '#0000FF', description: "La dernière planète du système solaire" },
          { id: 'sun', name: 'Soleil', ra: 0, dec: 0, magnitude: -26.7, distance: 0, color: '#FFD700', description: "L'étoile centrale de notre système solaire, source de lumière et de chaleur" }
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

  const filteredStars = (() => {
    let filtered = [...stars];

    // Appliquer le filtre sélectionné
    switch (selectedFilter) {
      case 'nearest':
        filtered = filtered.sort((a, b) => a.dist - b.dist).slice(0, 50);
        break;
      case 'brightest':
        filtered = filtered.sort((a, b) => a.mag - b.mag).slice(0, 50);
        break;
        case 'hottest':
          filtered = filtered.sort((a, b) => (a.ci ?? Infinity) - (b.ci ?? Infinity)).slice(0, 50);
          break;
      case 'biggest':
          filtered = filtered.sort((a, b) => b.mag - a.mag).slice(0, 50);
          break;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(star => 
        star.name?.toLowerCase().includes(query) ||
        star.constellation?.toLowerCase().includes(query)
      );
    }

    return filtered;
  })();

  const filteredPlanets = planets.filter(planet =>
    (!searchQuery || planet.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Chargement...</div>
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
      {showWelcomePopup && <WelcomeScreen onDismiss={() => setShowWelcomePopup(false)} />}
      
      <div className="fixed top-4 left-4 z-10 bg-white/90 p-4 rounded-lg shadow-lg w-64">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} />
          <h2 className="font-semibold">Filtres</h2>
        </div>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 p-2 rounded border border-gray-300"
            />
          </div>

          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value as 'nearest' | 'brightest' | 'hottest' | 'all')}
            className="w-full p-2 rounded border border-gray-300"
          >
            <option value="all">Toutes les étoiles</option>
            <option value="nearest">50 étoiles les plus proches</option>
            <option value="brightest">50 étoiles les plus brillantes</option>
            <option value="hottest">50 étoiles les plus chaudes</option>
            <option value="biggest">50 étoiles les plus grosses</option> 
          </select>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 z-10 flex gap-2">
        <button
          onClick={() => setScale(s => Math.min(s + 0.1, 2))}
          className="bg-white/90 p-2 rounded-lg shadow-lg hover:bg-white"
        >
          <ZoomIn size={24} />
        </button>
        <button
          onClick={() => setScale(s => Math.max(s - 0.1, 0.5))}
          className="bg-white/90 p-2 rounded-lg shadow-lg hover:bg-white"
        >
          <ZoomOut size={24} />
        </button>
      </div>

      <SkyMap
        stars={filteredStars}
        planets={filteredPlanets}
        selectedFilter={selectedFilter}
        scale={scale}
      />
    </div>
  );
}

export default App;