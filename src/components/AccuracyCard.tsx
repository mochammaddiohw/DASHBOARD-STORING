import { useState } from 'react';
import { CheckCircle2, ChevronRight, Info, AlertTriangle } from 'lucide-react';
import { ProcessAccuracy } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface AccuracyCardProps {
  overallAccuracy: number;
  processes: ProcessAccuracy[];
  onUpdateProcess: (id: string, updated: Partial<ProcessAccuracy>) => void;
}

export default function AccuracyCard({
  overallAccuracy,
  processes,
  onUpdateProcess,
}: AccuracyCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [hoveredProcessId, setHoveredProcessId] = useState<string | null>(null);

  // Calculate sum hits and misses
  const totalHit = processes.reduce((acc, p) => acc + p.hit, 0);
  const totalMiss = processes.reduce((acc, p) => acc + p.miss, 0);
  const calculatedAccuracy = totalHit + totalMiss > 0 ? (totalHit / (totalHit + totalMiss)) * 100 : 100;

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-100 p-5 flex flex-col h-full" id="accuracy-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <h2 className="text-sm font-bold text-slate-800 tracking-wide uppercase">
          3. MANAGE ACCURACY
        </h2>
        <div className="flex items-center gap-1.5 text-xs text-blue-600 font-bold bg-blue-50/50 px-2.5 py-1 rounded-lg border border-blue-100/50">
          <Info className="w-3.5 h-3.5" />
          <span>Real-time Audit</span>
        </div>
      </div>

      {/* Main Large Circular Gauge Dial */}
      <div className="flex flex-col items-center justify-center py-4 bg-slate-50/40 border border-slate-50 rounded-2xl mb-5">
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Outer clean track circular ring */}
          <svg className="w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#e2e8f0"
              strokeWidth="7"
            />
            {/* Accuracy ring arc */}
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke={calculatedAccuracy >= 99 ? '#22c55e' : '#eab308'}
              strokeWidth="7"
              strokeDasharray={251.2} // 2 * PI * r = 2 * 3.14159 * 40 ~= 251.2
              initial={{ strokeDashoffset: 251.2 }}
              animate={{ strokeDashoffset: 251.2 - (251.2 * calculatedAccuracy) / 100 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              strokeLinecap="round"
            />
          </svg>

          {/* Internal texts */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xl md:text-2xl font-black text-slate-800 font-mono tracking-tighter">
              {calculatedAccuracy.toFixed(2)}%
            </span>
            <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase leading-none mt-0.5">
              ACCURACY
            </span>
          </div>
        </div>

        {/* Target limit badge */}
        <div className="mt-4 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-extrabold text-slate-600 tracking-wide flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
          <span>TARGET &ge; 99%</span>
        </div>
      </div>

      {/* Subsection Accuracy Per Process */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-3 mb-3">
        <div className="flex items-center gap-1.5">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            3. ACCURACY PER PROCESS
          </h3>
          <span className="text-[10px] font-bold text-slate-400 font-serif lowercase italic">Detail</span>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-all cursor-pointer"
          id="btn-click-to-expansion"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
          <span>Click to {expanded ? 'collapse' : 'expansion'}</span>
          <ChevronRight className={`w-3 h-3 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`} />
        </button>
      </div>

      {/* Row of 3 mini circular gauges */}
      <div className="grid grid-cols-3 gap-2 py-1">
        {processes.map((proc) => {
          const total = proc.hit + proc.miss;
          const pct = total > 0 ? (proc.hit / total) * 100 : 100;
          
          return (
            <div
              key={proc.id}
              className="flex flex-col items-center p-2 rounded-xl border border-slate-50/80 bg-slate-50/20 hover:bg-slate-50 hover:border-slate-150 transition-all duration-200"
              onMouseEnter={() => setHoveredProcessId(proc.id)}
              onMouseLeave={() => setHoveredProcessId(null)}
            >
              {/* Short name */}
              <span className="text-[10px] font-extrabold text-slate-700 text-center tracking-wide min-h-[30px] flex items-center justify-center leading-tight">
                {proc.name}
              </span>

              {/* Mini Arc Gauge */}
              <div className="relative w-16 h-10 mt-1 flex items-end justify-center overflow-hidden">
                <svg className="w-14 h-7 overflow-visible" viewBox="0 0 100 50">
                  {/* Track */}
                  <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  {/* Progress Green fill */}
                  <motion.path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke={pct >= 99 ? '#10b981' : '#f59e0b'}
                    strokeWidth="8"
                    strokeDasharray={125.6} // Semi-circle is PI * r = 3.14 * 40 = 125.6
                    initial={{ strokeDashoffset: 125.6 }}
                    animate={{ strokeDashoffset: 125.6 - (125.6 * pct) / 100 }}
                    transition={{ duration: 0.8 }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute bottom-0 text-[10px] font-black text-slate-800 font-mono">
                  {pct.toFixed(2)}%
                </div>
              </div>

              {/* Hits and Misses Footer text */}
              <div className="text-[9px] font-bold text-slate-400 mt-2 text-center divide-x divide-slate-100 flex items-center justify-center w-full gap-1">
                <span className="text-emerald-600 block pl-1">Hit {proc.hit}</span>
                <span className={`block pl-1 ${proc.miss > 0 ? 'text-rose-500 font-black' : 'text-slate-400'}`}>
                  Miss {proc.miss}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Extra expanded panel displaying list detail audits */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 border border-slate-100 bg-slate-50/50 rounded-xl p-3 overflow-hidden"
          >
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">
              Daftar Deskripsi &amp; Proses Audit
            </h4>
            <div className="space-y-2 text-xs">
              {processes.map((p) => {
                const total = p.hit + p.miss;
                const pct = total > 0 ? (p.hit / total) * 100 : 100;
                return (
                  <div key={p.id} className="flex justify-between items-center bg-white border border-slate-100/80 rounded-lg p-2 shadow-xs">
                    <div>
                      <p className="font-bold text-slate-700">{p.name}</p>
                      <p className="text-[10px] text-slate-400 italic">
                        {p.id === 'picking' && 'Proses pengambilan stok dari bin'}
                        {p.id === 'putaway' && 'Proses peletakan (FLR -> Rack)'}
                        {p.id === 'move' && 'Proses pemindahan (Rack -> Rack)'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-slate-800">{pct.toFixed(2)}%</p>
                      <p className="text-[9px] font-bold text-slate-400">Total Audit: {total}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live hover information tooltip helper */}
      {hoveredProcessId && (
        <div className="mt-3 bg-blue-50/40 text-blue-800 border border-blue-100 p-2.5 rounded-lg text-[10px] font-medium transition-opacity duration-200">
          <strong>Detail Proses:</strong>{' '}
          {hoveredProcessId === 'picking' && 'Picking accuracy: mengukur keakuratan petugas gudang mengambil barang pesanan.'}
          {hoveredProcessId === 'putaway' && 'Putaway accuracy: memastikan barang dari receiving diletakkan ke slot rak penyimpanan yang tepat.'}
          {hoveredProcessId === 'move' && 'Move / Pressing accuracy: menjamin perpindahan antar rak ter-record sempurna tanpa deviasi sistem.'}
        </div>
      )}
    </div>
  );
}
