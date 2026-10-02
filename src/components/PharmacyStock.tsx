import React, { useState } from 'react';
import { Pharmacy, MedicineItem, UserRole } from '../types';
import { 
  Pill, 
  Search, 
  MapPin, 
  Phone, 
  TrendingDown, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  PackageCheck, 
  Plus, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface PharmacyStockProps {
  pharmacies: Pharmacy[];
  userRole: UserRole;
  reservedMeds: string[];
  onReserveMed: (medName: string) => void;
  onUpdateStock?: (pharmacyId: number, medId: string, newStatus: 'In Stock' | 'Low Stock' | 'Out of Stock') => void;
}

export const PharmacyStock: React.FC<PharmacyStockProps> = ({
  pharmacies,
  userRole,
  reservedMeds,
  onReserveMed,
  onUpdateStock,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [reservationTokens, setReservationTokens] = useState<Record<string, string>>({
    'Paracetamol 500mg': 'TOKEN-SETU-4412',
  });

  const categories = ['All', 'Analgesic & Antipyretic', 'Antibiotic', 'Anti-Diabetic', 'Electrolyte Solution', 'Anti-Allergic'];

  const handleReserve = (medName: string) => {
    if (!reservedMeds.includes(medName)) {
      onReserveMed(medName);
      const token = `SETU-PMBJP-${Math.floor(1000 + Math.random() * 9000)}`;
      setReservationTokens((prev) => ({ ...prev, [medName]: token }));
    }
  };

  // Filtered pharmacies
  const filteredPharmacies = pharmacies.map((pharm) => {
    const matchedMeds = pharm.meds.filter((m) => {
      const matchQuery =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.brandEquivalent.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === 'All' || m.category === selectedCategory;
      return matchQuery && matchCat;
    });
    return { ...pharm, meds: matchedMeds };
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-emerald-200">
              Pradhan Mantri Bharatiya Janaushadhi Pariyojana (PMBJP)
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            {userRole === 'pharmacy' ? 'Kendra Inventory Management' : 'Local Pharmacy Medicine Availability'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Check real-time medicine availability before walking to the Kendra. Reserve your essential generic doses with zero upfront fee.
          </p>
        </div>

        {/* Savings highlight badge */}
        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center space-x-3 text-xs">
          <TrendingDown className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <span className="font-extrabold text-emerald-900 block text-sm">Save 50% - 85%</span>
            <span className="text-emerald-700 text-[11px]">Equivalent generic molecules at Jan Aushadhi prices</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search generic medicine or brand name (e.g. Crocin, Augmentin, Paracetamol, ORS)..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm outline-none focus:border-teal-600 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px] shrink-0 mr-1">
            Categories:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg font-semibold shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-teal-700 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Pharmacies List */}
      <div className="space-y-6">
        {filteredPharmacies.map((pharm) => (
          <div
            key={pharm.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
          >
            {/* Pharmacy Store Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 to-teal-50/30 border-b border-slate-200 flex flex-wrap justify-between items-center gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900">{pharm.name}</h3>
                  <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">
                    {pharm.type}
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{pharm.address} ({pharm.distance})</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{pharm.contact}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs bg-white border border-slate-200 px-2.5 py-1 rounded-lg font-bold text-slate-700 shadow-2xs">
                  ⭐ {pharm.rating} Rating
                </span>
                {userRole === 'pharmacy' && (
                  <span className="text-xs bg-emerald-600 text-white font-bold px-3 py-1 rounded-lg">
                    Admin Operator Mode
                  </span>
                )}
              </div>
            </div>

            {/* Medicines List */}
            <div className="p-4 sm:p-5">
              {pharm.meds.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No medicines match "{searchQuery}" in this store.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {pharm.meds.map((med) => {
                    const isReserved = reservedMeds.includes(med.name);
                    const token = reservationTokens[med.name];

                    return (
                      <div
                        key={med.id}
                        className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                      >
                        {/* Medicine details */}
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-sm text-slate-900">{med.name}</span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                med.status === 'In Stock'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : med.status === 'Low Stock'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {med.status} ({med.stockCount} left)
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-slate-500 text-[11px]">
                            <span>Category: <strong>{med.category}</strong></span>
                            <span>•</span>
                            <span className="text-slate-600">
                              Commercial Brand Equivalent: <strong className="text-slate-700">{med.brandEquivalent}</strong>
                            </span>
                          </div>
                        </div>

                        {/* Price & Brand Comparison */}
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80 text-right">
                            <div className="flex items-center space-x-2">
                              <span className="text-slate-400 line-through text-[11px]">{med.brandPrice}</span>
                              <span className="font-extrabold text-sm text-emerald-700 font-mono">
                                {med.janAushadhiPrice}
                              </span>
                            </div>
                            <span className="text-[10px] text-emerald-600 font-bold block">
                              {med.savingsPercent}% PMBJP Savings
                            </span>
                          </div>

                          {/* Action Button */}
                          <div className="flex items-center space-x-2">
                            {med.status !== 'Out of Stock' ? (
                              <button
                                onClick={() => handleReserve(med.name)}
                                disabled={isReserved}
                                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center space-x-1.5 ${
                                  isReserved
                                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 cursor-default'
                                    : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
                                }`}
                              >
                                {isReserved ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Reserved ({token || 'Active'})</span>
                                  </>
                                ) : (
                                  <>
                                    <PackageCheck className="w-3.5 h-3.5" />
                                    <span>Reserve Stock</span>
                                  </>
                                )}
                              </button>
                            ) : (
                              <span className="text-rose-600 font-bold text-xs bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200">
                                Restocking in 24h
                              </span>
                            )}

                            {/* Pharmacist quick toggle */}
                            {userRole === 'pharmacy' && onUpdateStock && (
                              <select
                                aria-label="Update Stock Status"
                                value={med.status}
                                onChange={(e) => onUpdateStock(pharm.id, med.id, e.target.value as any)}
                                className="bg-slate-100 border border-slate-300 rounded-lg p-1 text-[11px] font-bold text-slate-700 outline-none cursor-pointer"
                              >
                                <option value="In Stock">In Stock</option>
                                <option value="Low Stock">Low Stock</option>
                                <option value="Out of Stock">Out of Stock</option>
                              </select>
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pharmacist Restock Trigger */}
            {userRole === 'pharmacy' && (
              <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-between items-center text-xs">
                <span className="text-slate-600">Need replenishment from District Warehouse Depot?</span>
                <button
                  onClick={() => alert(`Indent order request dispatched to District Medical Depot for ${pharm.name}.`)}
                  className="bg-teal-700 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-teal-800"
                >
                  Dispatch Restock Indent
                </button>
              </div>
            )}

          </div>
        ))}
      </div>

    </div>
  );
};
