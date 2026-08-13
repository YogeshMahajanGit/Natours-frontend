import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toursApi } from '../api/toursApi';
import TourCard from '../components/tours/TourCard';
import TourFilters from '../components/tours/TourFilters';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { Navigation, MapPin, X, Compass, Loader2, Flame, Tag } from 'lucide-react';

const Tours = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tours, setTours] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [nearMeMode, setNearMeMode] = useState(false);
  const [nearMeDistance, setNearMeDistance] = useState(400);
  const [nearMeUnit, setNearMeUnit] = useState('mi');
  const [nearMeLoading, setNearMeLoading] = useState(false);
  const [nearMeBanner, setNearMeBanner] = useState(null);

  const difficulty = searchParams.get('difficulty') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sort = searchParams.get('sort') || '';
  const top5 = searchParams.get('top5') === 'true';

  const fetchTours = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNearMeBanner(null);
    try {
      if (top5) {
        const top5Data = await toursApi.getTop5Cheap();
        setTours(top5Data);
        setTotalResults(top5Data.length);
        setNearMeBanner('Showing Top 5 Best Value / Cheap Expeditions (route /tours/top-5-cheap)');
      } else {
        const params = {};
        if (difficulty) params.difficulty = difficulty;
        if (minPrice) params['price[gte]'] = minPrice;
        if (maxPrice) params['price[lte]'] = maxPrice;
        if (sort) params.sort = sort;

        const { tours: data, results } = await toursApi.getAllTours(params);
        setTours(data);
        setTotalResults(results);
      }
    } catch (err) {
      console.error('Failed to fetch tours:', err);
      setError('Could not load tours from the API. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [difficulty, minPrice, maxPrice, sort, top5]);

  useEffect(() => {
    if (!nearMeMode) {
      fetchTours();
    }
  }, [fetchTours, nearMeMode]);

  const handleFilterChange = (key, value) => {
    setNearMeMode(false);
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleReset = () => {
    setNearMeMode(false);
    setSearchParams({});
  };

  const handleFindToursNearMe = () => {
    setNearMeLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await executeNearMeSearch(latitude, longitude);
        },
        async (geoError) => {
          console.warn('Geolocation failed or denied, using default coordinates (US West Coast):', geoError);
          await executeNearMeSearch(34.0522, -118.2437, 'Defaulting to US West Coast (location access not granted)');
        }
      );
    } else {
      executeNearMeSearch(34.0522, -118.2437, 'Defaulting to US West Coast');
    }
  };

  const executeNearMeSearch = async (lat, lng, note = null) => {
    setLoading(true);
    setNearMeLoading(false);
    try {
      const results = await toursApi.getToursWithin(nearMeDistance, lat, lng, nearMeUnit);
      setTours(results);
      setTotalResults(results.length);
      setNearMeMode(true);
      setNearMeBanner(
        `Showing ${results.length} expeditions within ${nearMeDistance} ${nearMeUnit} of (${lat.toFixed(2)}, ${lng.toFixed(2)}) ${note ? `• ${note}` : ''}`
      );
    } catch (err) {
      console.error('Error fetching tours near me:', err);
      setError('Failed to fetch nearby tours.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="border-b-2 border-dashed border-[#D6CFBE] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[#A8541F] uppercase font-bold tracking-widest block mb-1">
            CATALOG & TRAILS
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1F3D2B]">
            {top5 ? 'Top 5 Cheap Expeditions' : 'All Expeditions'}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleFilterChange('top5', top5 ? '' : 'true')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs uppercase font-bold tracking-wider shadow transition-all ${
              top5
                ? 'bg-[#A8541F] text-white ring-2 ring-[#A8541F]/30'
                : 'bg-white border border-[#A8541F] text-[#A8541F] hover:bg-[#A8541F]/10'
            }`}
          >
            <Flame className="w-4 h-4 fill-current" />
            <span>Top 5 Cheap</span>
          </button>

          <button
            onClick={handleFindToursNearMe}
            disabled={nearMeLoading}
            className="inline-flex items-center gap-2 bg-[#1F3D2B] hover:bg-[#2E5940] text-white px-4 py-2 rounded-lg font-mono text-xs uppercase font-bold tracking-wider shadow transition-all hover:scale-105 disabled:opacity-50"
          >
            {nearMeLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Locating GPS...</span>
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4" />
                <span>Tours Near Me</span>
              </>
            )}
          </button>

          <div className="font-mono text-xs text-[#8E8A7E] bg-white px-4 py-2 rounded-lg border border-[#D6CFBE]">
            Showing <span className="font-bold text-[#1F3D2B]">{totalResults}</span> active expeditions
          </div>
        </div>
      </div>

      {/* Geolocation / Filter Active Banner */}
      {nearMeBanner && (
        <div className="bg-[#1F3D2B] text-white p-4 rounded-xl flex items-center justify-between gap-4 font-mono text-xs border border-[#A8541F] shadow-sm">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-300 shrink-0" />
            <span>{nearMeBanner}</span>
          </div>
          <button
            onClick={handleReset}
            className="p-1 hover:bg-[#2E5940] rounded text-amber-300 hover:text-white transition-colors"
            title="Clear Filter"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Grid: Filters + Tour List */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-4">
          <div className="sticky top-24 space-y-4">
            {/* Near Me Radius Selector Box */}
            <div className="bg-white border-2 border-dashed border-[#D6CFBE] rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-[#A8541F]">
                <MapPin className="w-4 h-4" />
                <h4 className="font-mono text-xs uppercase font-bold">Proximity Search</h4>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-[#8E8A7E]">
                  <span>Radius:</span>
                  <span className="font-bold text-[#1F3D2B]">{nearMeDistance} {nearMeUnit}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="2000"
                  step="50"
                  value={nearMeDistance}
                  onChange={(e) => setNearMeDistance(Number(e.target.value))}
                  className="w-full accent-[#A8541F]"
                />
                <button
                  onClick={handleFindToursNearMe}
                  className="w-full py-1.5 bg-[#1F3D2B] text-white font-mono text-xs uppercase rounded font-bold hover:bg-[#2E5940] transition-colors"
                >
                  Search Radius
                </button>
              </div>
            </div>

            <TourFilters
              filters={{ difficulty, minPrice, maxPrice, sort }}
              isTop5Active={top5}
              onFilterChange={handleFilterChange}
              onReset={handleReset}
            />
          </div>
        </div>

        {/* Tour Cards Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <LoadingSpinner text="Searching trail directory & coordinates..." />
          ) : error ? (
            <EmptyState
              title="Connection Error"
              description={error}
              actionText="Retry"
              onAction={fetchTours}
            />
          ) : tours.length === 0 ? (
            <EmptyState
              title="No Expeditions Match Your Search"
              description="Try broadening your distance radius or resetting difficulty filters to view available tours."
              actionText="Reset All Filters"
              onAction={handleReset}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.map((tour, idx) => (
                <div key={tour._id || tour.id || idx} className="relative">
                  {top5 && (
                    <div className="absolute -top-3 -left-3 z-20 bg-[#A8541F] text-white font-mono text-[11px] font-bold px-3 py-0.5 rounded-full shadow-lg border-2 border-white flex items-center gap-1">
                      <span>#{idx + 1} CHEAPEST</span>
                    </div>
                  )}
                  <TourCard tour={tour} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tours;
