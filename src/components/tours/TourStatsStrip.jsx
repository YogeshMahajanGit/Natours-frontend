import React, { useEffect, useState } from 'react';
import { toursApi } from '../../api/toursApi';
import { Compass, TrendingUp, Award, DollarSign } from 'lucide-react';

const TourStatsStrip = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await toursApi.getTourStats();
        setStats(data);
      } catch (err) {
        console.error('Error fetching tour stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats.length) return null;

  return (
    <div className="my-10 p-6 bg-[#1F3D2B] text-white rounded-2xl shadow-lg border border-[#2E5940] topo-pattern">
      <div className="flex items-center gap-2 mb-4 border-b border-[#2E5940] pb-3">
        <TrendingUp className="w-5 h-5 text-amber-300" />
        <h3 className="font-mono text-sm uppercase tracking-widest text-amber-200 font-bold">
          Expedition Metrics & Aggregates
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={stat._id || idx} className="bg-[#2E5940]/80 backdrop-blur border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs uppercase tracking-wider text-amber-200 font-bold">
                {stat._id} Trails
              </span>
              <span className="text-[10px] font-mono bg-[#A8541F] text-white px-2 py-0.5 rounded-full">
                {stat.numTours} Tours
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/10 text-xs font-mono">
              <div>
                <span className="text-[#8E8A7E] text-[10px] block">AVG PRICE</span>
                <span className="font-bold text-white">${Math.round(stat.avgPrice || 0)}</span>
              </div>
              <div>
                <span className="text-[#8E8A7E] text-[10px] block">AVG RATING</span>
                <span className="font-bold text-amber-300">{(stat.avgRating || 0).toFixed(1)} ★</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TourStatsStrip;
