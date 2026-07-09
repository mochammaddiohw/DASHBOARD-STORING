import { useState } from 'react';
import { Sliders, X, RefreshCw, Sparkles, Check, ChevronDown, Award } from 'lucide-react';
import { OccupancyArea, PickZoneData, ProcessAccuracy, InboundValidationState, AreaDetail } from '../types';

interface SimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  // State variables & setters
  areas: OccupancyArea[];
  setAreas: (a: OccupancyArea[]) => void;
  pickZones: PickZoneData[];
  setPickZones: (pz: PickZoneData[]) => void;
  processes: ProcessAccuracy[];
  setProcesses: (pa: ProcessAccuracy[]) => void;
  inbound: InboundValidationState;
  setInbound: (i: InboundValidationState) => void;
  details: AreaDetail[];
  setDetails: (ad: AreaDetail[]) => void;
  // Apply preset callback
  applyPreset: (presetName: string) => void;
}

export default function Simulator({
  isOpen,
  onClose,
  areas,
  setAreas,
  pickZones,
  setPickZones,
  processes,
  setProcesses,
  inbound,
  setInbound,
  details,
  setDetails,
  applyPreset,
}: SimulatorProps) {
  const [activeTab, setActiveTab] = useState<'presets' | 'occupancy' | 'accuracy' | 'inbound' | 'rincian'>('presets');

  if (!isOpen) return null;

  // Manual numeric handlers
  const handleUpdateAreaUsed = (id: string, val: number) => {
    const updated = areas.map((a) => {
      if (a.id === id) {
        const capacity = a.capacity;
        const used = Math.min(val, capacity);
        const emptyCont = Math.max(0, Math.round((capacity - used) / 60)); // calculate empty containers approx.
        const occupancy = (used / capacity) * 100;
        return { ...a, used, emptyCont, occupancy };
      }
      return a;
    });
    setAreas(updated);
  };

  const handleUpdateAccuracy = (id: string, field: 'hit' | 'miss', val: number) => {
    const updated = processes.map((p) => {
      if (p.id === id) {
        return { ...p, [field]: Math.max(0, val) };
      }
      return p;
    });
    setProcesses(updated);
  };

  const handleUpdateInbound = (field: keyof InboundValidationState, val: number) => {
    const updated = { ...inbound, [field]: Math.max(0, val) };
    // adjust validation matches
    if (field === 'lpnHit') {
      updated.totalLpnDivalidasi = updated.lpnHit + updated.lpnMiss;
    } else if (field === 'lpnMiss') {
      updated.totalLpnDivalidasi = updated.lpnHit + updated.lpnMiss;
    } else if (field === 'totalLpnDivalidasi') {
      updated.lpnHit = Math.min(updated.lpnHit, val);
      updated.lpnMiss = val - updated.lpnHit;
    }
    setInbound(updated);
  };

  const handleUpdateDetailWorkload = (id: string, val: number) => {
    const updated = details.map((d) => {
      if (d.id === id) {
        return { ...d, workload: Math.max(0, val) };
      }
      return d;
    });
    setDetails(updated);
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div className="fixed inset-0 bg-slate-900/60 z-40 backdrop-blur-xs transition-opacity duration-200" onClick={onClose} />

      {/* Sidebar container */}
      <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200 animate-slide-in overflow-hidden" id="simulator-drawer">
        
        {/* Header */}
        <div className="bg-[#0b2545] text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="font-bold text-sm tracking-wide text-white uppercase">Operational Simulator</h3>
              <p className="text-[10px] text-slate-300">Simulate other dataset states easily</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vertical quick-selector tabs */}
        <div className="flex bg-slate-100 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider shrink-0">
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-2.5 text-center transition-colors border-b-2 cursor-pointer ${activeTab === 'presets' ? 'text-blue-600 border-blue-600 bg-white' : 'text-slate-500 border-transparent hover:bg-slate-200'}`}
          >
            Presets
          </button>
          <button
            onClick={() => setActiveTab('occupancy')}
            className={`flex-1 py-2.5 text-center transition-colors border-b-2 cursor-pointer ${activeTab === 'occupancy' ? 'text-blue-600 border-blue-600 bg-white' : 'text-slate-500 border-transparent hover:bg-slate-200'}`}
          >
            Cubic Occ
          </button>
          <button
            onClick={() => setActiveTab('accuracy')}
            className={`flex-1 py-2.5 text-center transition-colors border-b-2 cursor-pointer ${activeTab === 'accuracy' ? 'text-blue-600 border-blue-600 bg-white' : 'text-slate-500 border-transparent hover:bg-slate-200'}`}
          >
            Accuracies
          </button>
          <button
            onClick={() => setActiveTab('inbound')}
            className={`flex-1 py-2.5 text-center transition-colors border-b-2 cursor-pointer ${activeTab === 'inbound' ? 'text-blue-600 border-blue-600 bg-white' : 'text-slate-500 border-transparent hover:bg-slate-200'}`}
          >
            Inbound
          </button>
        </div>

        {/* Scrollable inputs body wrapper */}
        <div className="flex-grow overflow-y-auto p-4 space-y-4 text-xs">
          
          {/* TAB: PRESETS */}
          {activeTab === 'presets' && (
            <div className="space-y-3">
              <span className="font-extrabold text-slate-400 text-[9px] uppercase tracking-wider block">Select Preset Scene</span>
              
              {/* Preset 1: Original */}
              <button
                onClick={() => applyPreset('original')}
                className="w-full border border-blue-200 bg-blue-50/50 hover:bg-blue-50 p-3 rounded-xl text-left transition-all active:scale-98 flex items-start gap-3 cursor-pointer"
              >
                <Award className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-black text-slate-800">Screenshot Original (100% Perfect)</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Loads the exact data from the screenshot setup. 100% success rates, 64% occupancy, zero errors.</p>
                </div>
              </button>

              {/* Preset 2: Peak High workload */}
              <button
                onClick={() => applyPreset('peak')}
                className="w-full border border-slate-200 bg-slate-50 hover:bg-slate-100 p-3 rounded-xl text-left transition-all active:scale-98 flex items-start gap-3 cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-black text-slate-800">Peak Overload (Critical Levels)</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Flooded workload in Area 1 &amp; 2. Slashes capacities, causing Red Alert overflow warnings.</p>
                </div>
              </button>

              {/* Preset 3: Slight errors / Deviancy */}
              <button
                onClick={() => applyPreset('errors')}
                className="w-full border border-slate-200 bg-slate-50 hover:bg-slate-100 p-3 rounded-xl text-left transition-all active:scale-98 flex items-start gap-3 cursor-pointer"
              >
                <div className="w-5 h-5 bg-rose-100 rounded-full flex items-center justify-center shrink-0 text-rose-500 text-[10px] font-black">X</div>
                <div>
                  <p className="font-black text-slate-800">Operational Deviancy (Miss Audit)</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Generates random auditing misses on picking/putaway. Moves success rate down below target.</p>
                </div>
              </button>
            </div>
          )}

          {/* TAB: OCCUPANCY CUBIC */}
          {activeTab === 'occupancy' && (
            <div className="space-y-4">
              <span className="font-extrabold text-slate-400 text-[9px] uppercase tracking-wider block">Used Volume Level (cbm)</span>
              {areas.map((a) => (
                <div key={a.id} className="space-y-1.5 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex justify-between font-bold">
                    <span>{a.name}</span>
                    <span className="text-slate-500 font-mono">Max: {a.capacity.toLocaleString()} cbm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="1000"
                      max={a.capacity}
                      value={a.used}
                      onChange={(e) => handleUpdateAreaUsed(a.id, parseInt(e.target.value))}
                      className="flex-grow"
                    />
                    <span className="font-bold w-16 text-right font-mono text-blue-600">
                      {a.used.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: ACCURACIES */}
          {activeTab === 'accuracy' && (
            <div className="space-y-4">
              <span className="font-extrabold text-slate-400 text-[9px] uppercase tracking-wider block">Audits Hits &amp; Misses</span>
              {processes.map((p) => (
                <div key={p.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-3">
                  <p className="font-black text-slate-700">{p.name}</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block mb-1">HITS</span>
                      <input
                        type="number"
                        value={p.hit}
                        onChange={(e) => handleUpdateAccuracy(p.id, 'hit', parseInt(e.target.value) || 0)}
                        className="w-full border border-slate-200 rounded px-2 py-1 text-center font-mono focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block mb-1">MISSES</span>
                      <input
                        type="number"
                        value={p.miss}
                        onChange={(e) => handleUpdateAccuracy(p.id, 'miss', parseInt(e.target.value) || 0)}
                        className="w-full border border-slate-200 rounded px-2 py-1 text-center font-mono focus:border-blue-500 outline-none focus:ring-1 focus:ring-rose-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: INBOUND VALIDATIONS */}
          {activeTab === 'inbound' && (
            <div className="space-y-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="font-extrabold text-slate-400 text-[9px] uppercase tracking-wider block mb-2">Inbound Key Metrics</span>
              
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block mb-1">TOTAL SKU</span>
                  <input
                    type="number"
                    value={inbound.totalSku}
                    onChange={(e) => handleUpdateInbound('totalSku', parseInt(e.target.value) || 0)}
                    className="w-full border border-slate-200 bg-white rounded px-3 py-1 font-mono focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-500 block mb-1">LPN HIT</span>
                  <input
                    type="number"
                    value={inbound.lpnHit}
                    onChange={(e) => handleUpdateInbound('lpnHit', parseInt(e.target.value) || 0)}
                    className="w-full border border-slate-200 bg-white rounded px-3 py-1 font-mono focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-500 block mb-1">LPN MISS</span>
                  <input
                    type="number"
                    value={inbound.lpnMiss}
                    onChange={(e) => handleUpdateInbound('lpnMiss', parseInt(e.target.value) || 0)}
                    className="w-full border border-slate-200 bg-white rounded px-3 py-1 font-mono focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="bg-slate-200/50 p-2 text-[10px] rounded text-slate-600 font-medium">
                  *Total LPN Divalidasi will be calculated as Hit + Miss automatically for complete audit integrity.
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Action Bottom Footer */}
        <div className="bg-slate-100 p-3 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            onClick={() => applyPreset('original')}
            className="flex items-center gap-1 text-[10px] font-bold text-slate-600 hover:text-slate-800 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset original</span>
          </button>
          
          <button
            onClick={onClose}
            className="bg-[#0b2545] hover:bg-blue-900 transition-colors text-white py-1.5 px-4 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer"
          >
            Apply &amp; close
          </button>
        </div>

      </div>
    </>
  );
}
