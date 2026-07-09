import { AreaDetail } from '../types';

interface DetailsCardProps {
  details: AreaDetail[];
}

export default function DetailsCard({ details }: DetailsCardProps) {
  // Calculate Totals dynamically
  const totalWorkload = details.reduce((acc, curr) => acc + curr.workload, 0);
  const totalManpower = details.reduce((acc, curr) => acc + curr.manpower, 0);
  const totalCapacity = details.reduce((acc, curr) => acc + curr.capacity, 0);
  
  // Total Gap (Capacity - Workload)
  const totalGap = totalCapacity - totalWorkload;
  
  // Total Utilization
  const totalUtil = totalCapacity > 0 ? Math.round((totalWorkload / totalCapacity) * 100) : 0;
  
  // Total Status
  const totalStatus = totalGap >= 0 ? 'SURPLUS' : 'DEFICIT';

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden flex flex-col h-full" id="details-card">
      
      {/* Deep Navy/Blue bar header bar */}
      <div className="bg-[#0b2545] text-white px-5 py-3.5 flex items-center justify-between">
        <h2 className="text-sm font-bold tracking-wider uppercase">
          5. RINCIAN PER AREA
        </h2>
        <span className="text-[10px] font-bold text-slate-300 tracking-wide uppercase px-2 py-0.5 rounded bg-blue-900/40 border border-blue-800">
          Capacity Analysis
        </span>
      </div>

      {/* Table Content Container */}
      <div className="flex-grow overflow-x-auto" id="details-table-wrapper">
        <table className="w-full text-left text-xs min-w-[700px]">
          <thead>
            <tr className="bg-slate-50 text-slate-400 border-b border-slate-200">
              <th className="py-3 px-4 font-bold tracking-wider text-[10px] uppercase text-slate-500">AREA</th>
              <th className="py-3 px-4 font-bold tracking-wider text-[10px] uppercase text-slate-500 text-right">WORKLOAD (CASE ID)</th>
              <th className="py-3 px-4 font-bold tracking-wider text-[10px] uppercase text-slate-500 text-right">MANPOWER (TEAM)</th>
              <th className="py-3 px-4 font-bold tracking-wider text-[10px] uppercase text-slate-500 text-right">CAPACITY (CASE ID)</th>
              <th className="py-3 px-4 font-bold tracking-wider text-[10px] uppercase text-slate-500 text-right">GAP (CASE ID)</th>
              <th className="py-3 px-4 font-bold tracking-wider text-[10px] uppercase text-slate-500 text-right">UTILIZATION</th>
              <th className="py-3 px-4 font-bold tracking-wider text-[10px] uppercase text-slate-500 text-center">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150 font-semibold text-slate-700">
            {details.map((row) => {
              const gap = row.capacity - row.workload;
              const utilization = row.capacity > 0 ? Math.round((row.workload / row.capacity) * 100) : 0;
              const isOver = utilization > 100;
              
              return (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                  {/* AREA */}
                  <td className="py-3 px-4 text-slate-900 font-extrabold">{row.name}</td>
                  
                  {/* WORKLOAD */}
                  <td className="py-3 px-4 text-right font-mono text-slate-800">
                    {row.workload.toLocaleString('id-ID')}
                  </td>
                  
                  {/* MANPOWER */}
                  <td className="py-3 px-4 text-right font-mono text-slate-800">
                    {row.manpower}
                  </td>
                  
                  {/* CAPACITY */}
                  <td className="py-3 px-4 text-right font-mono text-slate-800">
                    {row.capacity.toLocaleString('id-ID')}
                  </td>
                  
                  {/* GAP */}
                  <td className={`py-3 px-4 text-right font-mono font-bold ${gap >= 0 ? 'text-[#10b981]' : 'text-rose-500'}`}>
                    {gap >= 0 ? gap.toLocaleString('id-ID') : gap.toLocaleString('id-ID')}
                  </td>
                  
                  {/* UTILIZATION */}
                  <td className={`py-3 px-4 text-right font-mono font-bold ${isOver ? 'text-rose-500' : 'text-[#10b981]'}`}>
                    {utilization}%
                  </td>
                  
                  {/* STATUS */}
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-wide ${isOver ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isOver ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                      {isOver ? 'OVER CAPACITY' : 'UNDER CAPACITY'}
                    </span>
                  </td>
                </tr>
              );
            })}

            {/* Total Row */}
            <tr className="bg-slate-100/80 font-bold border-t-2 border-slate-200">
              <td className="py-3.5 px-4 text-slate-900 font-extrabold text-xs uppercase">TOTAL</td>
              <td className="py-3.5 px-4 text-right text-slate-900 font-mono font-extrabold text-xs">{totalWorkload.toLocaleString('id-ID')}</td>
              <td className="py-3.5 px-4 text-right text-slate-900 font-mono font-extrabold text-xs">{totalManpower}</td>
              <td className="py-3.5 px-4 text-right text-slate-900 font-mono font-extrabold text-xs">{totalCapacity.toLocaleString('id-ID')}</td>
              <td className={`py-3.5 px-4 text-right font-mono font-extrabold text-xs ${totalGap >= 0 ? 'text-[#10b981]' : 'text-rose-500'}`}>
                {totalGap.toLocaleString('id-ID')}
              </td>
              <td className={`py-3.5 px-4 text-right font-mono font-extrabold text-xs ${totalUtil > 100 ? 'text-rose-500' : 'text-[#10b981]'}`}>
                {totalUtil}%
              </td>
              <td className="py-3.5 px-4 text-center">
                <span className={`inline-flex items-center justify-center px-4 py-1 rounded-md text-xs font-black tracking-widest ${totalStatus === 'SURPLUS' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-rose-100 text-rose-800 border border-rose-200'}`}>
                  {totalStatus}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
