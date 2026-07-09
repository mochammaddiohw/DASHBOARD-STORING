import { useState, useEffect } from 'react';
import { Sliders, HelpCircle, Heart, CheckCircle, Info } from 'lucide-react';
import {
  OccupancyArea,
  PickZoneData,
  ProcessAccuracy,
  InboundValidationState,
  AreaDetail,
  WarehouseOption,
  PeriodeOption,
} from './types';
import Header from './components/Header';
import OccupancyCard from './components/OccupancyCard';
import CaseIdCard from './components/CaseIdCard';
import AccuracyCard from './components/AccuracyCard';
import InboundCard from './components/InboundCard';
import DetailsCard from './components/DetailsCard';
import Simulator from './components/Simulator';

// WAREHOUSE OPTIONS
const WAREHOUSES: WarehouseOption[] = [
  { id: 'ndc_sidoarjo', name: 'NDC SIDOARJO' },
  { id: 'ndc_jakarta', name: 'NDC JAKARTA' },
  { id: 'ndc_surabaya', name: 'NDC SURABAYA' },
  { id: 'whs_bandung', name: 'WHS BANDUNG' },
];

const PERIODES: PeriodeOption[] = [
  { id: 'today', name: 'Hari Ini (3 Juni 2026)' },
  { id: 'yesterday', name: 'Kemarin (2 Juni 2026)' },
  { id: 'this_week', name: 'Minggu Ini (Mei - Juni)' },
  { id: 'this_month', name: 'Bulan Ini (Juni 2026)' },
];

// ORIGINAL SCREENSHOT DEFAULT DATASETS
const ORIGINAL_DATA = {
  areas: [
    { id: 'area_1', name: 'AREA 1', capacity: 12728, used: 6763, emptyCont: 99, occupancy: 53.13 },
    { id: 'area_2', name: 'AREA 2', capacity: 19820, used: 12014, emptyCont: 117, occupancy: 63.17 },
    { id: 'area_3', name: 'AREA 3', capacity: 27866, used: 19462, emptyCont: 140, occupancy: 69.84 },
  ] as OccupancyArea[],
  pickZones: [
    { id: 'acc_group', name: 'ACC GROUP', allTimeAvg: 51, pctPickZone: 53, pctBuffer: 47 },
    { id: 'non_acc', name: 'NON ACC', allTimeAvg: 53, pctPickZone: 62, pctBuffer: 38 },
    { id: 'area_2', name: 'AREA 2', allTimeAvg: 58, pctPickZone: 49, pctBuffer: 51 },
    { id: 'overall', name: 'OVERALL PZ TODAY', allTimeAvg: 55, pctPickZone: 55, pctBuffer: 45 },
  ] as PickZoneData[],
  processes: [
    { id: 'picking', name: 'Picking', hit: 696, miss: 0 },
    { id: 'putaway', name: 'Putaway\n(FLR -> Rack)', hit: 185, miss: 0 },
    { id: 'move', name: 'Move / Pressing\n(Rack -> Rack)', hit: 212, miss: 0 },
  ] as ProcessAccuracy[],
  inbound: {
    totalSku: 55,
    totalLpnDivalidasi: 244,
    lpnHit: 244,
    lpnMiss: 0,
  } as InboundValidationState,
  details: [
    { id: 'area_1', name: 'AREA 1', workload: 664, manpower: 3, capacity: 900 },
    { id: 'area_2', name: 'AREA 2', workload: 946, manpower: 3, capacity: 900 },
    { id: 'area_3', name: 'AREA 3', workload: 414, manpower: 1, capacity: 275 },
  ] as AreaDetail[],
};

// ALTERNATIVE SCENE PRESETS FOR DYNAMIC TOGGLING ENHANCEMENT
const PRESETS: Record<string, typeof ORIGINAL_DATA> = {
  original: ORIGINAL_DATA,
  peak: {
    areas: [
      { id: 'area_1', name: 'AREA 1', capacity: 12728, used: 11900, emptyCont: 12, occupancy: 93.49 },
      { id: 'area_2', name: 'AREA 2', capacity: 19820, used: 18500, emptyCont: 21, occupancy: 93.34 },
      { id: 'area_3', name: 'AREA 3', capacity: 27866, used: 25000, emptyCont: 38, occupancy: 89.71 },
    ],
    pickZones: [
      { id: 'acc_group', name: 'ACC GROUP', allTimeAvg: 51, pctPickZone: 70, pctBuffer: 30 },
      { id: 'non_acc', name: 'NON ACC', allTimeAvg: 53, pctPickZone: 85, pctBuffer: 15 },
      { id: 'area_2', name: 'AREA 2', allTimeAvg: 58, pctPickZone: 75, pctBuffer: 25 },
      { id: 'overall', name: 'OVERALL PZ TODAY', allTimeAvg: 55, pctPickZone: 78, pctBuffer: 22 },
    ],
    processes: [
      { id: 'picking', name: 'Picking', hit: 1200, miss: 15 },
      { id: 'putaway', name: 'Putaway\n(FLR -> Rack)', hit: 550, miss: 4 },
      { id: 'move', name: 'Move / Pressing\n(Rack -> Rack)', hit: 480, miss: 8 },
    ],
    inbound: {
      totalSku: 120,
      totalLpnDivalidasi: 680,
      lpnHit: 650,
      lpnMiss: 30,
    },
    details: [
      { id: 'area_1', name: 'AREA 1', workload: 1150, manpower: 4, capacity: 900 },
      { id: 'area_2', name: 'AREA 2', workload: 1210, manpower: 4, capacity: 900 },
      { id: 'area_3', name: 'AREA 3', workload: 490, manpower: 2, capacity: 275 },
    ],
  },
  errors: {
    areas: [
      { id: 'area_1', name: 'AREA 1', capacity: 12728, used: 4500, emptyCont: 150, occupancy: 35.35 },
      { id: 'area_2', name: 'AREA 2', capacity: 19820, used: 9500, emptyCont: 180, occupancy: 47.93 },
      { id: 'area_3', name: 'AREA 3', capacity: 27866, used: 12000, emptyCont: 260, occupancy: 43.06 },
    ],
    pickZones: [
      { id: 'acc_group', name: 'ACC GROUP', allTimeAvg: 51, pctPickZone: 41, pctBuffer: 59 },
      { id: 'non_acc', name: 'NON ACC', allTimeAvg: 53, pctPickZone: 38, pctBuffer: 62 },
      { id: 'area_2', name: 'AREA 2', allTimeAvg: 58, pctPickZone: 31, pctBuffer: 69 },
      { id: 'overall', name: 'OVERALL PZ TODAY', allTimeAvg: 55, pctPickZone: 36, pctBuffer: 64 },
    ],
    processes: [
      { id: 'picking', name: 'Picking', hit: 650, miss: 46 },
      { id: 'putaway', name: 'Putaway\n(FLR -> Rack)', hit: 150, miss: 35 },
      { id: 'move', name: 'Move / Pressing\n(Rack -> Rack)', hit: 190, miss: 22 },
    ],
    inbound: {
      totalSku: 45,
      totalLpnDivalidasi: 300,
      lpnHit: 255,
      lpnMiss: 45,
    },
    details: [
      { id: 'area_1', name: 'AREA 1', workload: 460, manpower: 2, capacity: 900 },
      { id: 'area_2', name: 'AREA 2', workload: 520, manpower: 2, capacity: 900 },
      { id: 'area_3', name: 'AREA 3', workload: 190, manpower: 1, capacity: 275 },
    ],
  },
};

interface SheetRow {
  tanggal: string;
  dept: string;
  desc: string;
  cbmLoc: number;
  stock: number;
  area: string;
}

// Robust CSV parser supporting quotes and standard line splitting
function parseCSV(text: string): string[][] {
  const lines: string[][] = [];
  let row: string[] = [];
  let inQuotes = false;
  let currentValue = "";

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentValue += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(currentValue.trim());
      currentValue = "";
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      row.push(currentValue.trim());
      if (row.length > 0 && row.some(val => val !== "")) {
        lines.push(row);
      }
      row = [];
      currentValue = "";
    } else {
      currentValue += char;
    }
  }
  if (currentValue || row.length > 0) {
    row.push(currentValue.trim());
    if (row.some(val => val !== "")) {
      lines.push(row);
    }
  }
  return lines;
}

// Safer dynamic number parsing for Indonesian/English comma & dot separators
function parseNumber(val: string): number {
  if (!val) return 0;
  let cleaned = val.replace(/\s/g, '');
  if (cleaned.includes(',') && !cleaned.includes('.')) {
    const parts = cleaned.split(',');
    if (parts[1] && parts[1].length === 2) {
      cleaned = cleaned.replace(',', '.');
    } else {
      cleaned = cleaned.replace(/,/g, '');
    }
  } else if (cleaned.includes('.') && cleaned.includes(',')) {
    const dotIndex = cleaned.indexOf('.');
    const commaIndex = cleaned.indexOf(',');
    if (dotIndex < commaIndex) {
      cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    } else {
      cleaned = cleaned.replace(/,/g, '');
    }
  } else if (cleaned.includes('.')) {
    const parts = cleaned.split('.');
    if (parts.length === 2 && parts[1].length === 3) {
      cleaned = cleaned.replace(/\./g, '');
    } else if (parts.length > 2) {
      cleaned = cleaned.replace(/\./g, '');
    }
  }
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

// Clean date comparison parser supporting Indonesian/English/ISO dates
function parseSheetDate(rawDate: string): Date | null {
  if (!rawDate) return null;
  const cleaned = rawDate.trim().toLowerCase();
  
  let d = new Date(cleaned);
  if (!isNaN(d.getTime())) return d;

  const monthsIndo: Record<string, number> = {
    'januari': 0, 'jan': 0, 'februari': 1, 'feb': 1, 'maret': 2, 'mar': 2,
    'april': 3, 'apr': 3, 'mei': 4, 'juni': 5, 'jun': 5, 'juli': 6, 'jul': 6,
    'agustus': 7, 'agu': 7, 'agt': 7, 'september': 8, 'sep': 8, 'oktober': 9, 'okt': 9,
    'november': 10, 'nov': 10, 'desember': 11, 'des': 11
  };

  const tokens = cleaned.split(/[\s\-\/]+/);
  if (tokens.length === 3) {
    let month = -1;
    if (monthsIndo[tokens[1]] !== undefined) {
      month = monthsIndo[tokens[1]];
    } else {
      const parsedMonth = parseInt(tokens[1]);
      if (!isNaN(parsedMonth)) {
        month = parsedMonth - 1;
      }
    }

    let day = parseInt(tokens[0]);
    let year = parseInt(tokens[2]);

    if (tokens[0].length === 4) {
      year = parseInt(tokens[0]);
      day = parseInt(tokens[2]);
      if (monthsIndo[tokens[1]] !== undefined) {
        month = monthsIndo[tokens[1]];
      } else {
        month = parseInt(tokens[1]) - 1;
      }
    }

    if (!isNaN(day) && month >= 0 && month < 12 && !isNaN(year)) {
      if (year < 100) year += 2000;
      return new Date(year, month, day);
    }
  }
  return null;
}

function getPeriodTargetDate(periodId: string): Date {
  const baseDate = new Date(2026, 5, 3); // June 3, 2026 is today
  if (periodId === 'yesterday') {
    return new Date(2026, 5, 2); // June 2, 2026 is yesterday
  }
  return baseDate;
}

export default function App() {
  // Filter states
  const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseOption>(WAREHOUSES[0]);
  const [selectedPeriode, setSelectedPeriode] = useState<PeriodeOption>(PERIODES[0]);

  // Main Dashboard states initialized from screenshot parameters
  const [areas, setAreas] = useState<OccupancyArea[]>(JSON.parse(JSON.stringify(ORIGINAL_DATA.areas)));
  const [pickZones, setPickZones] = useState<PickZoneData[]>(JSON.parse(JSON.stringify(ORIGINAL_DATA.pickZones)));
  const [processes, setProcesses] = useState<ProcessAccuracy[]>(JSON.parse(JSON.stringify(ORIGINAL_DATA.processes)));
  const [inbound, setInbound] = useState<InboundValidationState>(JSON.parse(JSON.stringify(ORIGINAL_DATA.inbound)));
  const [details, setDetails] = useState<AreaDetail[]>(JSON.parse(JSON.stringify(ORIGINAL_DATA.details)));

  // Live Spreadsheet States
  const [sheetRows, setSheetRows] = useState<SheetRow[]>([]);
  const [loadingSheet, setLoadingSheet] = useState(false);
  const [sheetError, setSheetError] = useState<string | null>(null);
  const [dynamicDeptData, setDynamicDeptData] = useState<Record<string, any[]> | undefined>(undefined);

  // Simulator Drawer control
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch Excel Live Spreadsheet on mount or demand
  const fetchSpreadsheetData = async (forceToast = false) => {
    setLoadingSheet(true);
    setSheetError(null);
    try {
      const response = await fetch(
        'https://docs.google.com/spreadsheets/d/1KtPny0-dAFPCHxXM4hh4HPaoEiPGE0lWRkZw1pqs4TE/export?format=csv&sheet=MASTER%20DASHBOARD'
      );
      if (!response.ok) {
        throw new Error('Gagal mendownload data spreadsheet public.');
      }
      const csvText = await response.text();
      const rawRows = parseCSV(csvText);

      if (rawRows.length <= 1) {
        throw new Error('Spreadsheet kosong atau tidak memiliki baris data.');
      }

      const parsedRows: SheetRow[] = [];
      for (let i = 1; i < rawRows.length; i++) {
        const row = rawRows[i];
        if (row.length < 6) continue;

        const tanggal = row[0] ? row[0].trim() : '';
        const dept = row[1] ? row[1].trim() : '';
        const desc = row[2] ? row[2].trim() : '';
        const cbmLocRaw = row[3] ? row[3].trim() : '0';
        const stockRaw = row[4] ? row[4].trim() : '0';
        const area = row[5] ? row[5].trim() : '';

        if (!area || !dept) continue;

        parsedRows.push({
          tanggal,
          dept,
          desc,
          cbmLoc: parseNumber(cbmLocRaw),
          stock: parseNumber(stockRaw),
          area,
        });
      }

      setSheetRows(parsedRows);
      
      // Update states dynamically
      applySheetDataToDashboard(parsedRows, selectedPeriode.id);
      
      if (forceToast) {
        showToast("🔔 Live spreadsheet data synchronized successfully!");
      }
    } catch (err: any) {
      console.error(err);
      setSheetError(err.message || 'Error occurred while loading live data.');
      showToast("❌ Gagal sinkronisasi Live Sheet. Menggunakan dataset default.");
    } finally {
      setLoadingSheet(false);
    }
  };

  const applySheetDataToDashboard = (rows: SheetRow[], periodId: string) => {
    if (rows.length === 0) return;

    const targetDate = getPeriodTargetDate(periodId);
    let matchedRows = rows.filter(r => {
      const rd = parseSheetDate(r.tanggal);
      if (!rd) return false;
      return rd.getDate() === targetDate.getDate() &&
             rd.getMonth() === targetDate.getMonth() &&
             rd.getFullYear() === targetDate.getFullYear();
    });

    if (matchedRows.length === 0) {
      let latestDate: Date | null = null;
      rows.forEach(r => {
        const rd = parseSheetDate(r.tanggal);
        if (rd) {
          if (!latestDate || rd.getTime() > latestDate.getTime()) {
            latestDate = rd;
          }
        }
      });

      if (latestDate) {
        matchedRows = rows.filter(r => {
          const rd = parseSheetDate(r.tanggal);
          if (!rd) return false;
          return rd.getTime() === latestDate!.getTime();
        });
      } else {
        matchedRows = rows;
      }
    }

    const updatedAreas = ORIGINAL_DATA.areas.map(area => {
      const areaName = area.name.toUpperCase().trim();
      const areaRows = matchedRows.filter(r => r.area.toUpperCase().replace(/\s+/g, '') === areaName.replace(/\s+/g, ''));
      
      const capacity = areaRows.reduce((sum, r) => sum + r.cbmLoc, 0);
      const used = areaRows.reduce((sum, r) => sum + r.stock, 0);
      
      if (areaRows.length === 0) {
        return area;
      }

      const occupancy = capacity > 0 ? (used / capacity) * 100 : 0;
      const emptyCont = Math.max(0, Math.round((capacity - used) / 62.29));

      return {
        ...area,
        capacity,
        used,
        occupancy,
        emptyCont
      };
    });

    setAreas(updatedAreas);

    // Build sub department details mapping
    const deptMap: Record<string, any[]> = {
      'area_1': [],
      'area_2': [],
      'area_3': []
    };

    matchedRows.forEach(row => {
      const areaNorm = row.area.toUpperCase().replace(/\s+/g, '');
      let areaId = '';
      if (areaNorm === 'AREA1') areaId = 'area_1';
      else if (areaNorm === 'AREA2') areaId = 'area_2';
      else if (areaNorm === 'AREA3') areaId = 'area_3';

      if (areaId) {
        deptMap[areaId].push({
          deptName: row.dept,
          category: row.desc,
          cbmLoc: row.cbmLoc,
          used: row.stock,
          occupancy: row.cbmLoc > 0 ? parseFloat(((row.stock / row.cbmLoc) * 100).toFixed(2)) : 0
        });
      }
    });

    setDynamicDeptData(deptMap);
  };

  // Trigger spreadsheet sync on first load
  useEffect(() => {
    fetchSpreadsheetData(false);
  }, []);

  // Update dynamic calculations on filter change
  useEffect(() => {
    if (sheetRows.length > 0 && selectedWarehouse.id === 'ndc_sidoarjo') {
      applySheetDataToDashboard(sheetRows, selectedPeriode.id);
    }
  }, [selectedPeriode, selectedWarehouse, sheetRows]);

  // Apply a dataset preset
  const applyPreset = (presetName: string) => {
    const data = PRESETS[presetName] || ORIGINAL_DATA;
    setAreas(JSON.parse(JSON.stringify(data.areas)));
    setPickZones(JSON.parse(JSON.stringify(data.pickZones)));
    setProcesses(JSON.parse(JSON.stringify(data.processes)));
    setInbound(JSON.parse(JSON.stringify(data.inbound)));
    setDetails(JSON.parse(JSON.stringify(data.details)));
    setDynamicDeptData(undefined); // fallback to static original mock details in lists

    showToast(`Preset "${presetName.toUpperCase()}" loaded successfully!`);
  };

  const handleResetAllData = () => {
    setSelectedWarehouse(WAREHOUSES[0]);
    setSelectedPeriode(PERIODES[0]);
    fetchSpreadsheetData(true);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Dynamically calculate high-level rollups to feed visual controls accurately
  const totalCapacity = areas.reduce((acc, curr) => acc + curr.capacity, 0);
  const totalUsed = areas.reduce((acc, curr) => acc + curr.used, 0);
  const totalEmptyCont = areas.reduce((acc, curr) => acc + curr.emptyCont, 0);
  
  // Calculate exact overall occupancy limit
  const overallOccupancy = totalCapacity > 0 ? (totalUsed / totalCapacity) * 100 : 0;

  // Track accuracy rates calculated dynamically
  const totalAccuracyHits = processes.reduce((acc, p) => acc + p.hit, 0);
  const totalAccuracyMisses = processes.reduce((acc, p) => acc + p.miss, 0);
  const overallAccuracy =
    totalAccuracyHits + totalAccuracyMisses > 0
      ? (totalAccuracyHits / (totalAccuracyHits + totalAccuracyMisses)) * 100
      : 100.0;

  // Synchronization hook: update Total Row on Area Detail changes to keep overall workload aligned
  useEffect(() => {
    const summedDetailsWorkload = details.reduce((acc, curr) => acc + curr.workload, 0);
    const summedManpower = details.reduce((acc, curr) => acc + curr.manpower, 0);
  }, [details]);

  function sumDetailsRatio(workload: number, capacity: number) {
    return capacity > 0 ? Math.round((workload / capacity) * 100) : 0;
  }

  // Handle warehouse changes with appropriate data scaling preset simulation
  const handleWarehouseChange = (wh: WarehouseOption) => {
    setSelectedWarehouse(wh);
    if (wh.id === 'ndc_jakarta') {
      applyPreset('peak');
    } else if (wh.id === 'whs_bandung') {
      applyPreset('errors');
    } else if (wh.id === 'ndc_sidoarjo') {
      if (sheetRows.length > 0) {
        applySheetDataToDashboard(sheetRows, selectedPeriode.id);
        showToast("Live Google Sheets data applied for NDC SIDOARJO.");
      } else {
        applyPreset('original');
      }
    }
  };

  const handlePeriodeChange = (period: PeriodeOption) => {
    setSelectedPeriode(period);
    if (period.id === 'yesterday') {
      const slightlyLowerInbound = { ...inbound, lpnHit: Math.max(10, inbound.lpnHit - 20) };
      setInbound(slightlyLowerInbound);
      showToast("Historical data loaded for Yesterday.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f7fa] text-slate-800 font-sans relative pb-16 flex flex-col justify-between" id="app-viewport">
      
      {/* Dynamic Toast feedback */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-900 border border-blue-500 hover:bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2.5 text-xs font-semibold animate-bounce font-sans">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container Wrapper */}
      <div className="w-full max-w-[1400px] mx-auto px-4 py-4 md:py-6 space-y-4 md:space-y-6 flex-grow">
        
        {/* Header containing Filters */}
        <Header
          selectedWarehouse={selectedWarehouse}
          selectedPeriode={selectedPeriode}
          warehouses={WAREHOUSES}
          periodes={PERIODES}
          onWarehouseChange={handleWarehouseChange}
          onPeriodeChange={handlePeriodeChange}
          onReset={handleResetAllData}
          onSyncSheet={() => fetchSpreadsheetData(true)}
          loadingSheet={loadingSheet}
        />

        {/* TOP ROW GRID (3 COLUMNS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-stretch" id="gridrow-top">
          
          {/* Card 1: Occupancy Area Cubic (col-span 4) */}
          <div className="lg:col-span-4 flex flex-col h-full">
            <OccupancyCard
              areas={areas}
              totalCapacity={totalCapacity}
              totalUsed={totalUsed}
              totalEmptyCont={totalEmptyCont}
              overallOccupancy={overallOccupancy}
              onUpdateArea={(id, updated) => {
                const step = areas.map(a => a.id === id ? { ...a, ...updated } : a);
                setAreas(step);
              }}
              deptData={dynamicDeptData}
            />
          </div>

          {/* Card 2: Case ID & Pick zone (col-span 4) */}
          <div className="lg:col-span-4 flex flex-col h-full">
            <CaseIdCard
              totalCaseId={details.reduce((a, b) => a + b.workload, 0)} // dynamic workload link
              manPower={details.reduce((a, b) => a + b.manpower, 0)}     // dynamic team link
              avgPickZone={Math.round(pickZones.find(p => p.id === 'overall')?.pctPickZone || 55)}
              pickZones={pickZones}
            />
          </div>

          {/* Card 3: Manage Accuracy (col-span 4) */}
          <div className="lg:col-span-4 flex flex-col h-full">
            <AccuracyCard
              overallAccuracy={overallAccuracy}
              processes={processes}
              onUpdateProcess={(id, updated) => {
                const step = processes.map(p => p.id === id ? { ...p, ...updated } : p);
                setProcesses(step);
              }}
            />
          </div>

        </div>

        {/* BOTTOM ROW GRID (2 COLUMNS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-stretch" id="gridrow-bottom">
          
          {/* Card 4: Validasi Inbound (col-span 5) */}
          <div className="lg:col-span-12 xl:col-span-5 flex flex-col">
            <InboundCard
              data={inbound}
              onTrendClick={() => {
                setSimulatorOpen(true);
                showToast("Operations Simulator Drawer opened on the right!");
              }}
            />
          </div>

          {/* Card 5: Rincian per Area table (col-span 7) */}
          <div className="lg:col-span-12 xl:col-span-7 flex flex-col">
            <DetailsCard details={details} />
          </div>

        </div>

      </div>

      {/* Persistent Operations Simulator Panel Floating Button */}
      <div className="fixed bottom-6 right-6 z-30 flex items-center gap-1.5 pt-1">
        <button
          onClick={() => setSimulatorOpen(true)}
          className="flex items-center gap-2 bg-[#0b2545] hover:bg-blue-900 border border-blue-500/30 text-white font-bold py-3 px-5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 text-xs tracking-wider cursor-pointer font-sans"
          id="btn-fab-simulator"
        >
          <Sliders className="w-4 h-4 text-blue-400" />
          <span>SIMULATE DATA</span>
        </button>
      </div>

      {/* Simulator Side Drawer Component */}
      <Simulator
        isOpen={simulatorOpen}
        onClose={() => setSimulatorOpen(false)}
        areas={areas}
        setAreas={setAreas}
        pickZones={pickZones}
        setPickZones={setPickZones}
        processes={processes}
        setProcesses={setProcesses}
        inbound={inbound}
        setInbound={setInbound}
        details={details}
        setDetails={setDetails}
        applyPreset={applyPreset}
      />

      {/* Footer copyright block */}
      <footer className="w-full text-center py-4 bg-slate-100 border-t border-slate-200 text-slate-400 text-xs font-medium">
        <div className="max-w-[1400px] mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="flex items-center gap-1">
            <span>© 2026 Storing Dashboard</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-400">Warehouse Performance Metrics System</span>
          </p>
          <p className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
            <span>NDC SIDOARJO (Java Regional Center)</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
