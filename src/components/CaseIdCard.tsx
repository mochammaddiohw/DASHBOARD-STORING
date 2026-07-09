import { PickZoneData } from '../types';
import { motion } from 'motion/react';

interface CaseIdCardProps {
  totalCaseId: number;
  manPower: number;
  avgPickZone: number;
  pickZones: PickZoneData[];
}

export default function CaseIdCard({
  totalCaseId,
  manPower,
  avgPickZone,
  pickZones,
}: CaseIdCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-100 p-5 flex flex-col h-full" id="case-id-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <h2 className="text-sm font-bold text-slate-800 tracking-wide uppercase">
          2. CASE ID &amp; PICK ZONE
        </h2>
        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold tracking-wider uppercase border border-slate-200" id="badge-workload">
          WORKLOAD
        </span>
      </div>

      {/* Top key indicators row with light borders */}
      <div className="grid grid-cols-3 gap-1 bg-slate-50 border border-slate-100 rounded-xl p-3 text-center mb-5 divide-x divide-slate-200">
        <div>
          <span className="text-[9px] font-extrabold text-slate-400 tracking-wide block uppercase leading-none mb-1">
            TOTAL CASE ID
          </span>
          <span className="text-xl font-extrabold text-slate-800 block font-mono" id="val-total-case-id">
            {totalCaseId.toLocaleString('id-ID')}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            Today's Workload
          </span>
        </div>

        <div>
          <span className="text-[9px] font-extrabold text-slate-400 tracking-wide block uppercase leading-none mb-1">
            MAN POWER (TEAM)
          </span>
          <span className="text-xl font-extrabold text-slate-800 block font-mono" id="val-manpower">
            {manPower}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            Kapasitas: 2.075
          </span>
        </div>

        <div>
          <span className="text-[9px] font-extrabold text-slate-400 tracking-wide block uppercase leading-none mb-1">
            AVG PICK ZONE
          </span>
          <span className="text-xl font-extrabold text-emerald-600 block font-mono" id="val-avg-pickzone">
            {avgPickZone}%
          </span>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
            overall pick zone today
          </span>
        </div>
      </div>

      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          2. PICK ZONE AVAILABILITY
        </h3>
        {/* Legends */}
        <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-blue-600 rounded-sm shrink-0"></span>
            <span>Biru: Pick zone % (Lvl 1-2)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-slate-300 rounded-sm shrink-0"></span>
            <span>Abu: Buffer zone % (Lvl 3-9)</span>
          </div>
        </div>
      </div>

      {/* Horizontal Stacked Bars */}
      <div className="space-y-4 flex-grow flex flex-col justify-around py-1">
        {pickZones.map((pz) => (
          <div key={pz.id} className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-700 tracking-wider">
                {pz.name}
              </span>
              <span className="inline-flex items-center bg-emerald-50 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                ALL-TIME AVG: {pz.allTimeAvg}%
              </span>
            </div>

            {/* Stacked bar wrapper */}
            <div className="relative w-full h-8 bg-slate-100 rounded-lg overflow-hidden flex shadow-inner border border-slate-100">
              {/* Pick Zone (Blue Part) */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pz.pctPickZone}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="bg-blue-600 h-full flex items-center justify-center text-white text-xs font-black font-mono shadow-sm"
              >
                {pz.pctPickZone}% {pz.id === 'overall' && '(Pick Zone)'}
              </motion.div>

              {/* Buffer Zone (Gray Part) */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pz.pctBuffer}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="bg-slate-300 h-full flex items-center justify-center text-slate-600 text-xs font-black font-mono"
              >
                {pz.pctBuffer}% {pz.id === 'overall' && '(Buffer)'}
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
