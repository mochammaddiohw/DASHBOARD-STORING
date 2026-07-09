import { Package, FileText, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { InboundValidationState } from '../types';
import { motion } from 'motion/react';

interface InboundCardProps {
  data: InboundValidationState;
  onTrendClick?: () => void;
}

export default function InboundCard({ data, onTrendClick }: InboundCardProps) {
  // Calculate success rate dynamically
  const calculatedRate = data.totalLpnDivalidasi > 0 ? (data.lpnHit / data.totalLpnDivalidasi) * 100 : 100;
  const isTargetAchieved = calculatedRate >= 100.0; // exact or >=99%

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-100 p-5 flex flex-col h-full" id="inbound-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center gap-1">
          <h2 className="text-sm font-bold text-slate-800 tracking-wide uppercase flex items-center gap-1.5">
            4. VALIDASI INBOUND
            <span className="text-slate-400 font-extrabold">&gt;</span>
          </h2>
        </div>
        <button
          onClick={onTrendClick}
          className="px-3 py-1.5 border border-blue-400 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-50/50 cursor-pointer transition-colors duration-200 uppercase tracking-wide shadow-xs active:scale-95"
          id="btn-detail-area-trend"
        >
          DETAIL AREA &amp; TREND
        </button>
      </div>

      {/* Main Body Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 flex-grow items-stretch">
        
        {/* Left Side: 4 Mini Cards Grid */}
        <div className="sm:col-span-7 grid grid-cols-2 gap-3" id="inbound-grid-left">
          
          {/* TOTAL SKU */}
          <div className="flex items-center gap-3 bg-slate-50/50 border border-slate-100 p-3 rounded-xl hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-100 text-purple-600 shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-bold text-slate-400 leading-none mb-1">TOTAL SKU</span>
              <span className="text-base font-extrabold text-slate-800 font-mono leading-none" id="val-total-sku">
                {data.totalSku}
              </span>
            </div>
          </div>

          {/* TOTAL LPN DIVALIDASI */}
          <div className="flex items-center gap-3 bg-slate-50/50 border border-slate-100 p-3 rounded-xl hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-100 text-cyan-600 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-bold text-slate-400 leading-none mb-1 uppercase">Total LPN Divalidasi</span>
              <span className="text-base font-extrabold text-slate-800 font-mono leading-none" id="val-total-lpn-dival">
                {data.totalLpnDivalidasi}
              </span>
            </div>
          </div>

          {/* LPN HIT */}
          <div className="flex items-center gap-3 bg-slate-50/50 border border-slate-100 p-3 rounded-xl hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-bold text-slate-400 leading-none mb-1">LPN HIT</span>
              <span className="text-base font-extrabold text-slate-800 font-mono leading-none" id="val-lpn-hit">
                {data.lpnHit}
              </span>
            </div>
          </div>

          {/* LPN MISS */}
          <div className="flex items-center gap-3 bg-slate-50/50 border border-slate-100 p-3 rounded-xl hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-rose-100 text-rose-600 shrink-0">
              <XCircle className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-bold text-slate-400 leading-none mb-1">LPN MISS</span>
              <span className={`text-base font-extrabold font-mono leading-none ${data.lpnMiss > 0 ? 'text-rose-600 font-extrabold' : 'text-slate-800'}`} id="val-lpn-miss">
                {data.lpnMiss}
              </span>
            </div>
          </div>

        </div>

        {/* Right Side: Validation Success Rate Box */}
        <div className="sm:col-span-5 flex" id="validation-score-box">
          <div className="w-full border border-slate-150 rounded-2xl p-4 flex flex-col items-center justify-center bg-slate-50/20 hover:bg-slate-50/60 transition-colors duration-200 relative overflow-hidden">
            <span className="text-[10px] font-extrabold text-slate-400 tracking-wider text-center uppercase leading-none mb-2">
              VALIDASI SUCCESS RATE
            </span>
            
            <motion.span
              key={calculatedRate}
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-extrabold text-[#10b981] font-mono leading-none mb-3"
              id="val-success-rate-pct"
            >
              {calculatedRate % 1 === 0 ? calculatedRate.toFixed(0) : calculatedRate.toFixed(2)}%
            </motion.span>

            {/* Horizontal progress underline bar */}
            <div className="w-20 h-1.5 bg-slate-100 rounded-full mb-4 overflow-hidden border border-slate-200">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${calculatedRate}%` }}
                className="h-full bg-[#10b981] rounded-full"
                transition={{ duration: 0.6 }}
              />
            </div>

            {/* Green target badge */}
            <div className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${isTargetAchieved ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-amber-500 bg-amber-50 text-amber-700'}`}>
              {isTargetAchieved ? 'TARGET TERCAPAI' : 'DI BAWAH TARGET'}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
