import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass as CompassIcon, Shield, Trees, Map } from 'lucide-react';
import { toursApi } from '../api/toursApi';
import TourCard from '../components/tours/TourCard';
import TourStatsStrip from '../components/tours/TourStatsStrip';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AnimatedHero from '../components/home/AnimatedHero';

const Home = () => {
  const [featuredTours, setFeaturedTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const data = await toursApi.getAllTours();
        setFeaturedTours(data.tours || []);
      } catch (err) {
        console.error('Error fetching homepage tours:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  return (
    <div className="space-y-16 pb-12">
      {/* Animated Moving Canvas + Slideshow Hero */}
      <AnimatedHero />

      {/* Featured Expeditions Catalog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-mono text-[#A8541F] uppercase font-bold tracking-widest block mb-1">
              CURATED SELECTION
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F3D2B]">
              Most Popular Expeditions
            </h2>
          </div>
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase text-[#1F3D2B] font-bold hover:text-[#A8541F] transition-colors"
          >
            <span>View All {featuredTours.length > 0 ? `(${featuredTours.length})` : ''} Tours</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Fetching featured tours..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTours.slice(0, 6).map((tour) => (
              <TourCard key={tour._id || tour.id} tour={tour} />
            ))}
          </div>
        )}

        {/* Backend Tour Stats Aggregates */}
        <TourStatsStrip />
      </section>

      {/* Values & Features Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-serif text-3xl font-bold text-[#1F3D2B] mb-3">
            Why Adventurers Choose Natours
          </h2>
          <p className="text-sm text-[#1B1B18]/70">
            We provide safety, sustainability, and unmatched natural immersion on every expedition.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="ticket-stub rounded-xl p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#1F3D2B] text-amber-300 flex items-center justify-center mx-auto">
              <Trees className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-lg text-[#1F3D2B]">Explore Pure Nature</h4>
            <p className="text-xs text-[#1B1B18]/70 leading-relaxed">
              Trek through pristine national parks, glacier valleys, and untouched wilderness.
            </p>
          </div>

          <div className="ticket-stub rounded-xl p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#1F3D2B] text-amber-300 flex items-center justify-center mx-auto">
              <Shield className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-lg text-[#1F3D2B]">Certified Guides</h4>
            <p className="text-xs text-[#1B1B18]/70 leading-relaxed">
              Every expedition is led by experienced Wilderness First Responder certified guides.
            </p>
          </div>

          <div className="ticket-stub rounded-xl p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#1F3D2B] text-amber-300 flex items-center justify-center mx-auto">
              <Map className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-lg text-[#1F3D2B]">Small Groups</h4>
            <p className="text-xs text-[#1B1B18]/70 leading-relaxed">
              Strict group limits ensure authentic camaraderie and minimal environmental impact.
            </p>
          </div>

          <div className="ticket-stub rounded-xl p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#1F3D2B] text-amber-300 flex items-center justify-center mx-auto">
              <CompassIcon className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-lg text-[#1F3D2B]">Seamless Booking</h4>
            <p className="text-xs text-[#1B1B18]/70 leading-relaxed">
              Instant Razorpay payments, transparent pricing, and instant itinerary confirmation.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
