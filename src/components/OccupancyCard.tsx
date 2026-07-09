import { useState } from 'react';
import { 
  Eye, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  X, 
  Search, 
  ArrowUpDown, 
  Info, 
  FileSpreadsheet,
  Check,
  Building
} from 'lucide-react';
import { OccupancyArea } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface OccupancyCardProps {
  areas: OccupancyArea[];
  totalCapacity: number;
  totalUsed: number;
  totalEmptyCont: number;
  overallOccupancy: number;
  onUpdateArea: (id: string, updated: Partial<OccupancyArea>) => void;
  deptData?: Record<string, DeptDetail[]>;
}

// Department details display helper matching columns in sheet
interface DeptDetail {
  deptName: string;
  category: string;
  cbmLoc?: number;
  used: number;
  occupancy: number;
}

// Beautiful Indonesian style number formatter (dots for thousands, commas for decimals)
function formatIndoCubic(num: number): string {
  if (num === undefined || num === null || isNaN(num)) return '0,00';
  return num.toLocaleString('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

const DEPT_DATA: Record<string, DeptDetail[]> = {
  'area_1': [
    { deptName: 'R110BK', category: 'Home Decor', cbmLoc: 1365.20, used: 933.00, occupancy: 68.34 },
    { deptName: 'R110BM', category: 'Home Organizer', cbmLoc: 1365.20, used: 506.00, occupancy: 37.06 },
    { deptName: 'R110BD', category: 'Dining', cbmLoc: 8256.80, used: 1837.00, occupancy: 22.25 },
    { deptName: 'R110BF', category: 'Bedroom', cbmLoc: 16513.60, used: 1815.00, occupancy: 10.99 },
    { deptName: 'R110AM', category: 'Home Accessories', cbmLoc: 1365.20, used: 147.00, occupancy: 10.77 },
    { deptName: 'R110BE', category: 'Kitchen', cbmLoc: 2730.50, used: 242.00, occupancy: 8.86 },
    { deptName: 'R110BJ', category: 'Textile Bedding', cbmLoc: 4128.40, used: 358.00, occupancy: 8.67 },
    { deptName: 'R110BN', category: 'Homeware', cbmLoc: 1365.20, used: 113.00, occupancy: 8.28 },
    { deptName: 'R110BI', category: 'Kids Space', cbmLoc: 8256.80, used: 626.00, occupancy: 7.58 },
    { deptName: 'R110BP', category: 'Bathroom', cbmLoc: 2730.50, used: 111.00, occupancy: 4.07 },
    { deptName: 'R110BQ', category: 'Storage Accessories', cbmLoc: 1365.20, used: 45.00, occupancy: 3.30 },
    { deptName: 'R110BR', category: 'Garden Essentials', cbmLoc: 1463.40, used: 30.00, occupancy: 2.05 }
  ],
  'area_2': [
    { deptName: 'R110BQ', category: 'Office Seating', cbmLoc: 5559.10, used: 4884.00, occupancy: 87.9 },
    { deptName: 'R110BR', category: 'Commercial & Business', cbmLoc: 5645.20, used: 4296.00, occupancy: 76.1 },
    { deptName: 'R110BP', category: 'Office', cbmLoc: 2839.40, used: 1239.00, occupancy: 43.6 },
    { deptName: 'R110CI', category: 'Ruang Kerja & Belajar', cbmLoc: 302.00, used: 121.00, occupancy: 40.2 },
    { deptName: 'R110BB', category: 'Table & Cabinet', cbmLoc: 2839.40, used: 1134.00, occupancy: 39.9 },
    { deptName: 'R110CE', category: 'Ruang Makan & Dapur', cbmLoc: 302.00, used: 111.00, occupancy: 36.8 },
    { deptName: 'R110CD', category: 'Ruang Tamu & Penyimpanan', cbmLoc: 323.40, used: 111.00, occupancy: 34.3 },
    { deptName: 'R110CG', category: 'Ruang Tidur', cbmLoc: 302.40, used: 86.00, occupancy: 28.6 },
    { deptName: 'R110CF', category: 'Peralatan Makan & Dapur', cbmLoc: 302.00, used: 15.00, occupancy: 5.1 },
    { deptName: 'R110CH', category: 'Perlengkapan Rumah', cbmLoc: 302.40, used: 13.00, occupancy: 4.4 },
    { deptName: 'R110CC', category: 'Lain-lain / Dekorasi Pendukung', cbmLoc: 302.40, used: 4.00, occupancy: 1.3 }
  ],
  'area_3': [
    { deptName: 'R110EF', category: 'Major Domestic Appliances', cbmLoc: 508.00, used: 804.00, occupancy: 158.2 },
    { deptName: 'R110BA', category: 'Sofa & Chair', cbmLoc: 7326.70, used: 6826.00, occupancy: 93.2 },
    { deptName: 'R110DC', category: 'KELS - Health Care', cbmLoc: 113.70, used: 97.00, occupancy: 85.6 },
    { deptName: 'R110BG', category: 'Mattress', cbmLoc: 8652.00, used: 5778.00, occupancy: 66.8 },
    { deptName: 'R110BC', category: 'Home Classic', cbmLoc: 8225.00, used: 5200.00, occupancy: 63.2 },
    { deptName: 'R110CA', category: 'Sofa', cbmLoc: 829.40, used: 397.00, occupancy: 47.9 },
    { deptName: 'R110CC', category: 'Kasur', cbmLoc: 829.40, used: 228.00, occupancy: 27.5 },
    { deptName: 'R110DA', category: 'KELS - Major Domestic Appliances', cbmLoc: 118.30, used: 28.00, occupancy: 24.1 },
    { deptName: 'R110DB', category: 'KELS - Small Domestic Appliances', cbmLoc: 113.70, used: 26.00, occupancy: 22.5 },
    { deptName: 'R110EA', category: 'Audio Visual', cbmLoc: 508.40, used: 53.00, occupancy: 10.4 },
    { deptName: 'R110EB', category: 'Air Treatment', cbmLoc: 320.91, used: 15.00, occupancy: 4.7 },
    { deptName: 'R110EC', category: 'Personal Care Electronics', cbmLoc: 320.91, used: 10.00, occupancy: 3.1 }
  ]
};

type SortField = 'deptName' | 'category' | 'cbmLoc' | 'used' | 'occupancy';
type SortDirection = 'asc' | 'desc';

export default function OccupancyCard({
  areas,
  totalCapacity,
  totalUsed,
  totalEmptyCont,
  overallOccupancy,
  onUpdateArea,
  deptData,
}: OccupancyCardProps) {
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  
  // Modal states for the spectacular "Detail Department" overlay
  const [modalAreaId, setModalAreaId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('occupancy');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [csvSuccess, setCsvSuccess] = useState(false);

  const angle = -90 + (overallOccupancy * 1.8);

  const toggleAreaExpand = (id: string) => {
    if (selectedAreaId === id) {
      setSelectedAreaId(null);
    } else {
      setSelectedAreaId(id);
    }
  };

  // Setup references for modal calculations
  const modalArea = areas.find(a => a.id === modalAreaId);
  const rawModalItems = modalAreaId 
    ? ((deptData && deptData[modalAreaId] && deptData[modalAreaId].length > 0) 
        ? deptData[modalAreaId] 
        : DEPT_DATA[modalAreaId] || []) 
    : [];

  // Filter & Search inside departmental list
  const filteredModalItems = rawModalItems.filter(item => {
    const q = searchQuery.toLowerCase();
    return (
      item.deptName.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  // Multidirectional sort
  const sortedModalItems = [...filteredModalItems].sort((a, b) => {
    let valA: string | number = '';
    let valB: string | number = '';

    if (sortField === 'cbmLoc') {
      valA = a.cbmLoc ?? (a.used / ((a.occupancy || 1) / 100));
      valB = b.cbmLoc ?? (b.used / ((b.occupancy || 1) / 100));
    } else if (sortField === 'used') {
      valA = a.used;
      valB = b.used;
    } else if (sortField === 'deptName') {
      valA = a.deptName;
      valB = b.deptName;
    } else if (sortField === 'category') {
      valA = a.category;
      valB = b.category;
    } else {
      valA = a.occupancy;
      valB = b.occupancy;
    }

    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortDirection === 'asc' 
        ? valA.localeCompare(valB) 
        : valB.localeCompare(valA);
    } else {
      return sortDirection === 'asc'
        ? (valA as number) - (valB as number)
        : (valB as number) - (valA as number);
    }
  });

  // Calculate dynamic sums for modal KPI cards
  const modalTotalKategori = rawModalItems.length;
  const modalTotalCbmLoc = rawModalItems.reduce((acc, item) => {
    const val = item.cbmLoc ?? (item.used / ((item.occupancy || 1) / 100));
    return acc + val;
  }, 0);
  const modalTotalStock = rawModalItems.reduce((acc, item) => acc + item.used, 0);
  const modalOccupancyRate = modalTotalCbmLoc > 0 ? (modalTotalStock / modalTotalCbmLoc) * 100 : 0;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection(field === 'deptName' || field === 'category' ? 'asc' : 'desc');
    }
  };

  const handleDownloadCSV = () => {
    if (!modalArea) return;
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "DEPT,DESCRIPTION,CBM LOC,STOCK,OCCUPANCY %\n";
    
    sortedModalItems.forEach(item => {
      const cbmVal = item.cbmLoc ?? (item.used / ((item.occupancy || 1) / 100));
      csvContent += `"${item.deptName}","${item.category}",${cbmVal.toFixed(2)},${item.used.toFixed(2)},${item.occupancy.toFixed(2)}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${modalArea.name.replace(/\s+/g, '_')}_Department_Detail.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Provide immediate visual feedback on the button
    setCsvSuccess(true);
    setTimeout(() => setCsvSuccess(false), 2000);
  };

  // Progress color based on occupancy levels
  const getProgressColor = (occ: number) => {
    if (occ >= 90) return 'bg-[#ef4444]'; // Red for >= 90% (like R110EF: 158.2% and R110BA: 93.2%)
    if (occ >= 70) return 'bg-[#f59e0b]'; // Amber/warning for 70% to 90% (like R110BQ: 87.9%, R110BR: 76.1%, R110DC: 85.6%)
    if (occ >= 5) return 'bg-[#10b981]';  // Emerald for general optimal range
    return 'bg-[#2dd4bf]';               // Teal for very low occupancy
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-100 p-5 flex flex-col h-full" id="occupancy-card">
      {/* Header of the card */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <h2 className="text-sm font-bold text-slate-800 tracking-wide uppercase flex items-center gap-2">
          1. OCCUPANCY AREA - CUBIC
        </h2>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Live Sheet</span>
        </div>
      </div>

      {/* Grid of Gauge + Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center mb-5">
        {/* Needle Gauge representation */}
        <div className="sm:col-span-6 flex flex-col items-center justify-center relative bg-slate-50/50 py-3 rounded-xl border border-slate-50">
          <div className="relative w-44 h-24 flex items-end justify-center overflow-hidden">
            <svg className="w-40 h-20 overflow-visible" viewBox="0 0 100 50">
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="35%" stopColor="#f97316" />
                  <stop offset="70%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
              </defs>

              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="10"
                strokeLinecap="round"
              />

              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth="10"
                strokeLinecap="round"
              />

              <circle cx="50" cy="50" r="5.5" fill="#0f172a" />
              <circle cx="50" cy="50" r="2.5" fill="#ffffff" />

              <g transform={`translate(50, 50) rotate(${angle})`}>
                <polygon
                  points="0,1.5 -1.5,0 0,-44 1.5,0"
                  fill="#0f172a"
                  strokeWidth="0.5"
                  stroke="#ffffff"
                />
              </g>
            </svg>

            <div className="absolute bottom-1 flex flex-col items-center justify-center">
              <span className="text-xl md:text-2xl font-black text-slate-800 tracking-tight leading-none bg-slate-50 px-1 rounded">
                {overallOccupancy.toFixed(2)}%
              </span>
              <span className="text-[9px] font-bold text-slate-400 tracking-wider mt-0.5 leading-none">
                UTILIZATION
              </span>
            </div>
          </div>
          <div className="w-full flex justify-between px-6 text-[9px] font-bold text-slate-400 mt-1">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="sm:col-span-6 grid grid-cols-2 gap-x-4 gap-y-3 px-1">
          <div className="flex flex-col border-l-2 border-slate-200 pl-2">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider">CAPACITY</span>
            <span className="text-base font-extrabold text-slate-700 font-mono">
              {totalCapacity.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="flex flex-col border-l-2 border-slate-200 pl-2">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider">USED</span>
            <span className="text-base font-extrabold text-slate-700 font-mono">
              {totalUsed.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="flex flex-col border-l-2 border-amber-500 pl-2">
            <span className="text-[10px] font-bold text-amber-600/90 tracking-wider">EMPTY</span>
            <span className="text-base font-extrabold text-amber-600 font-mono">
              {totalEmptyCont.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="flex flex-col border-l-2 border-slate-200 pl-2">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider">CONV CONT 40FT</span>
            <span className="text-base font-extrabold text-slate-700 font-mono">
              {Math.max(1, Math.round(totalCapacity / 62.29))}
            </span>
          </div>
        </div>
      </div>

      {/* Area Cubic Table */}
      <div className="flex-grow overflow-hidden rounded-lg border border-slate-200 shadow-sm" id="occupancy-table">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#0b2545] text-white">
              <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-[10px]">AREA</th>
              <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-[10px] text-right">CAPACITY</th>
              <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-[10px] text-right">USED</th>
              <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-[10px] text-right">EMPTY (40FT)</th>
              <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-[10px] text-right">OCCUPANCY</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {areas.map((area) => {
              const isExpanded = selectedAreaId === area.id;
              return (
                <tr
                  key={area.id}
                  onClick={() => toggleAreaExpand(area.id)}
                  className={`hover:bg-slate-50 cursor-pointer transition-colors duration-150 ${isExpanded ? 'bg-slate-50/70 border-l-4 border-blue-500' : ''}`}
                >
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5 justify-between pr-2">
                      <span className="font-bold text-slate-800">{area.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalAreaId(area.id);
                        }}
                        className="inline-flex items-center gap-1 text-[8.5px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wide border border-blue-100 hover:bg-blue-600 hover:text-white transition-all cursor-pointer active:scale-95"
                        id={`btn-detail-${area.id}`}
                      >
                        <Eye className="w-2.5 h-2.5" /> DETAIL
                      </button>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-600 font-mono">
                    {area.capacity.toLocaleString('id-ID')}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-600 font-mono">
                    {area.used.toLocaleString('id-ID')}
                  </td>
                  <td className="py-2.5 px-3 text-right text-amber-600 font-mono font-bold">
                    {area.emptyCont} <span className="text-[10px] text-amber-500 font-normal">cont</span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-extrabold text-slate-800 font-mono">
                    {area.occupancy.toFixed(2)}%
                  </td>
                </tr>
              );
            })}
            
            {/* Total Row */}
            <tr className="bg-slate-50 font-bold border-t-2 border-slate-200">
              <td className="py-3 px-3 text-slate-900 font-extrabold">TOTAL</td>
              <td className="py-3 px-3 text-right text-slate-900 font-mono">{totalCapacity.toLocaleString('id-ID')}</td>
              <td className="py-3 px-3 text-right text-slate-900 font-mono">{totalUsed.toLocaleString('id-ID')}</td>
              <td className="py-3 px-3 text-right text-amber-600 font-mono">{totalEmptyCont} <span className="text-[10px] font-normal text-amber-500">cont</span></td>
              <td className="py-3 px-3 text-right text-slate-900 font-mono font-extrabold">{overallOccupancy.toFixed(2)}%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bottom sliding interactive drawer */}
      <AnimatePresence>
        {selectedAreaId && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 bg-blue-50/40 border border-blue-100/50 rounded-lg p-3 overflow-hidden text-xs"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-blue-800 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Rincian Departemen - {areas.find(a => a.id === selectedAreaId)?.name}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setModalAreaId(selectedAreaId)}
                  className="text-blue-600 hover:text-blue-800 hover:underline font-bold text-[10px] uppercase cursor-pointer"
                >
                  Buka Detail Fullscreen
                </button>
                <span className="text-slate-300">|</span>
                <button
                  onClick={() => setSelectedAreaId(null)}
                  className="text-slate-400 hover:text-slate-600 font-extrabold text-[10px] uppercase cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {((deptData || DEPT_DATA)[selectedAreaId] || []).slice(0, 5).map((dept, i) => {
                const itemCbm = dept.cbmLoc ?? (dept.used / ((dept.occupancy || 1) / 100));
                return (
                  <div key={i} className="flex justify-between items-center bg-white p-2 rounded border border-slate-100 hover:border-blue-200 transition-colors">
                    <div>
                      <p className="font-bold text-slate-700">{dept.deptName}</p>
                      <p className="text-[10px] text-slate-400">{dept.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-slate-800">{formatIndoCubic(dept.used)} cbm / {formatIndoCubic(itemCbm)} Loc</p>
                      <p className="text-[10px] font-bold text-blue-600">{dept.occupancy.toFixed(1)}% occupancy</p>
                    </div>
                  </div>
                );
              })}
              {((deptData || DEPT_DATA)[selectedAreaId] || []).length > 5 && (
                <div className="text-center pt-1.5">
                  <button 
                    onClick={() => setModalAreaId(selectedAreaId)}
                    className="text-[10px] font-bold text-blue-500 hover:text-blue-700 cursor-pointer"
                  >
                    Tampilkan {((deptData || DEPT_DATA)[selectedAreaId] || []).length - 5} departemen lainnya...
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SPECTACULAR DEPARTMENT DETAIL OVERLAY MODAL (MATCHING SECONDS SCREENSHOT) */}
      <AnimatePresence>
        {modalAreaId && modalArea && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fadeIn">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ ease: "easeOut", duration: 0.2 }}
              className="bg-[#f8fafc] rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-100"
              id="department-detail-modal"
            >
              {/* MODAL HEADER */}
              <div className="bg-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 text-blue-600 p-2.5 rounded-xl border border-blue-100 flex items-center justify-center">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-slate-800 font-sans tracking-tight">
                        {modalArea.name} - Detail Department
                      </h3>
                      <span className="inline-block bg-slate-100 text-slate-600 text-[9px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full border border-slate-200">
                        CUBIC VIEW
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                      Detail pembagian kapasitas cubic (CBM Loc), stock aktual, dan tingkat kepadatan department.
                    </p>
                  </div>
                </div>

                {/* TUTUP BUTTON */}
                <button
                  onClick={() => {
                    setModalAreaId(null);
                    setSearchQuery('');
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors font-bold text-xs shadow-sm bg-white cursor-pointer active:scale-95"
                >
                  <X className="w-3.5 h-3.5 text-slate-400" />
                  <span>Tutup</span>
                </button>
              </div>

              {/* 4 DYNAMIC STATS CARDS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-5 sm:px-6 py-4 bg-slate-50 shrink-0 select-none border-b border-slate-100">
                
                {/* CARD 1: TOTAL KATEGORI */}
                <div className="bg-white border border-slate-100 rounded-xl p-3 sm:p-4 shadow-sm flex flex-col justify-between h-20 sm:h-24">
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    TOTAL KATEGORI
                  </span>
                  <span className="text-lg sm:text-xl font-extrabold text-slate-800 font-sans leading-none">
                    {modalTotalKategori} DEPT
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium leading-none">
                    Membagi area penyimpanan
                  </span>
                </div>

                {/* CARD 2: TOTAL CBM LOC */}
                <div className="bg-white border border-slate-100 rounded-xl p-3 sm:p-4 shadow-sm flex flex-col justify-between h-20 sm:h-24">
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    TOTAL CBM LOC
                  </span>
                  <span className="text-lg sm:text-l font-extrabold text-slate-800 font-mono tracking-tight leading-none">
                    {formatIndoCubic(modalTotalCbmLoc)}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium leading-none">
                    Kapasitas kubik tersedia
                  </span>
                </div>

                {/* CARD 3: STOCK AKTUAL */}
                <div className="bg-white border border-slate-100 rounded-xl p-3 sm:p-4 shadow-sm flex flex-col justify-between h-20 sm:h-24">
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    STOCK AKTUAL
                  </span>
                  <span className="text-lg sm:text-l font-extrabold text-slate-800 font-mono tracking-tight leading-none">
                    {formatIndoCubic(modalTotalStock)}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium leading-none">
                    Volume kubik terpakai
                  </span>
                </div>

                {/* CARD 4: OCCUPANCY RATE WITH PROGRESS SLIDER */}
                <div className="bg-white border border-slate-100 rounded-xl p-3 sm:p-4 shadow-sm flex flex-col justify-between h-20 sm:h-24">
                  <div className="flex items-center justify-between leading-none">
                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      OCCUPANCY RATE
                    </span>
                    <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded border ${
                      modalOccupancyRate >= 80 ? 'bg-red-50 text-red-600 border-red-100' :
                      modalOccupancyRate >= 55 ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}>
                      {modalOccupancyRate >= 80 ? 'FULL' : modalOccupancyRate >= 55 ? 'WARN' : 'OPTIMAL'}
                    </span>
                  </div>
                  <div>
                    <span className="text-lg sm:text-xl font-bold text-slate-800 font-sans tracking-tight leading-none">
                      {modalOccupancyRate.toFixed(2)}%
                    </span>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden flex">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${getProgressColor(modalOccupancyRate)}`}
                        style={{ width: `${Math.min(100, modalOccupancyRate)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

              </div>

              {/* SEARCH INPUT BAR + CSV EXPORTER */}
              <div className="bg-white px-5 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-100 shrink-0">
                <div className="relative w-full sm:max-w-xs">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari DEPT atau Deskripsi..."
                    className="pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 text-xs w-full text-slate-600 font-medium bg-slate-50/50"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-[10px] font-bold text-slate-400 hover:text-slate-600"
                    >
                      CLEAR
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Menampilkan <span className="font-bold text-slate-700">{sortedModalItems.length}</span> dari <span className="font-bold text-slate-700">{rawModalItems.length}</span> dept
                  </span>
                  
                  <button
                    onClick={handleDownloadCSV}
                    disabled={sortedModalItems.length === 0}
                    className={`text-xs py-2 px-3 font-extrabold flex items-center gap-1.5 transition duration-150 cursor-pointer active:scale-95 shadow-sm rounded-lg border ${
                      csvSuccess 
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-emerald-50 hover:bg-emerald-100/90 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {csvSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>CSV Saved!</span>
                      </>
                    ) : (
                      <>
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        <span>Download CSV</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* LIST TABLE CONTROLLER */}
              <div className="flex-grow overflow-y-auto px-5 sm:px-6 bg-white shrink">
                <table className="w-full text-left text-xs border-collapse divide-y divide-slate-100">
                  <thead className="sticky top-0 bg-white z-10">
                    <tr className="text-slate-400 font-semibold text-[10px] uppercase">
                      <th 
                        onClick={() => handleSort('deptName')}
                        className="py-3 cursor-pointer hover:text-slate-700 select-none w-1/5"
                      >
                        <div className="flex items-center gap-1 font-bold">
                          <span>DEPT</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-300 shrink-0" />
                          {sortField === 'deptName' && (
                            <span className="text-[8px] text-blue-500 font-extrabold">{sortDirection.toUpperCase()}</span>
                          )}
                        </div>
                      </th>
                      <th 
                        onClick={() => handleSort('category')}
                        className="py-3 cursor-pointer hover:text-slate-700 select-none w-2/5"
                      >
                        <div className="flex items-center gap-1 font-bold">
                          <span>DESCRIPTION</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-300 shrink-0" />
                          {sortField === 'category' && (
                            <span className="text-[8px] text-blue-500 font-extrabold">{sortDirection.toUpperCase()}</span>
                          )}
                        </div>
                      </th>
                      <th 
                        onClick={() => handleSort('cbmLoc')}
                        className="py-3 text-right cursor-pointer hover:text-slate-700 select-none w-1/6 pr-3"
                      >
                        <div className="flex items-center gap-1 justify-end font-bold">
                          <span>CBM LOC</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-300 shrink-0" />
                          {sortField === 'cbmLoc' && (
                            <span className="text-[8px] text-blue-500 font-extrabold">{sortDirection.toUpperCase()}</span>
                          )}
                        </div>
                      </th>
                      <th 
                        onClick={() => handleSort('used')}
                        className="py-3 text-right cursor-pointer hover:text-slate-700 select-none w-1/6 pr-3"
                      >
                        <div className="flex items-center gap-1 justify-end font-bold">
                          <span>STOCK</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-300 shrink-0" />
                          {sortField === 'used' && (
                            <span className="text-[8px] text-blue-500 font-extrabold">{sortDirection.toUpperCase()}</span>
                          )}
                        </div>
                      </th>
                      <th 
                        onClick={() => handleSort('occupancy')}
                        className="py-3 cursor-pointer hover:text-slate-700 select-none w-1/5 pl-3"
                      >
                        <div className="flex items-center gap-1 font-bold">
                          <span>OCCUPANCY %</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-300 shrink-0" />
                          {sortField === 'occupancy' && (
                            <span className="text-[8px] text-blue-500 font-extrabold">{sortDirection.toUpperCase()}</span>
                          )}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  
                  <tbody className="divide-y divide-slate-100/50 font-medium">
                    {sortedModalItems.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400 font-semibold font-sans">
                          Tidak ditemukan department / kategori dengan kata kunci "{searchQuery}"
                        </td>
                      </tr>
                    ) : (
                      sortedModalItems.map((item, index) => {
                        const itemCbm = item.cbmLoc ?? (item.used / ((item.occupancy || 1) / 100));
                        return (
                          <tr 
                            key={index} 
                            className="hover:bg-slate-50/70 transition-colors duration-100 text-[#1e293b]"
                          >
                            {/* DEPT BADGE PILL */}
                            <td className="py-3.5 pr-2">
                              <span className="bg-slate-100 text-slate-700 text-[10px] sm:text-[11px] font-extrabold font-mono uppercase px-2 py-1 rounded tracking-wider border border-slate-200/50">
                                {item.deptName}
                              </span>
                            </td>

                            {/* DESCRIPTION */}
                            <td className="py-3.5 pr-2 font-bold text-slate-700 text-xs sm:text-[12.5px] font-sans">
                              {item.category}
                            </td>

                            {/* CBM LOC */}
                            <td className="py-3.5 text-right font-mono text-[12px] text-slate-500 font-medium pr-3 select-all">
                              {formatIndoCubic(itemCbm)}
                            </td>

                            {/* STOCK */}
                            <td className="py-3.5 text-right font-mono text-[12.5px] text-slate-800 font-extrabold pr-3 select-all">
                              {formatIndoCubic(item.used)}
                            </td>

                            {/* PROGRESS + PERCENTAGE */}
                            <td className="py-3.5 pl-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-14 sm:w-16 bg-slate-100 h-2 rounded-full overflow-hidden shrink-0 mt-0.5">
                                  <div 
                                    className={`h-full rounded-full transition-all duration-300 ${getProgressColor(item.occupancy)}`}
                                    style={{ width: `${Math.min(100, item.occupancy)}%` }}
                                  ></div>
                                </div>
                                <span className="font-extrabold font-mono text-[11px] text-slate-700 min-w-[40px]">
                                  {item.occupancy.toFixed(1)}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* FOOTER NOTICE AREA */}
              <div className="bg-slate-50 px-5 sm:px-6 py-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[10px] sm:text-[11px] text-slate-400 font-medium font-sans shrink-0 gap-2 select-none">
                <div className="flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-blue-500" />
                  <span>CBM Loc (Kapasitas Lokasi) & Stock dihitung dinamis dalam m³ sesuai luas area.</span>
                </div>
                <div className="font-semibold text-slate-400">
                  Metode kalkulasi optimal & clean | Sidoarjo NDC
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footnote tips */}
      <div className="mt-3 text-center text-[11px] font-medium text-amber-700 bg-amber-50 py-1.5 px-3 rounded-lg border border-amber-100/50 flex items-center justify-center gap-1 select-none">
        <span>💡</span>
        <span>Tips: Klik <span className="font-bold underline text-blue-700 bg-blue-50 px-1 rounded">DETAIL</span> untuk melihat pembagian kapasitas cubic per departemen.</span>
      </div>
    </div>
  );
}
