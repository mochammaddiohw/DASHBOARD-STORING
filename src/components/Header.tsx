import { useState } from 'react';
import { Warehouse, Calendar, ChevronDown, Check, RefreshCw } from 'lucide-react';
import { WarehouseOption, PeriodeOption } from '../types';

interface HeaderProps {
  selectedWarehouse: WarehouseOption;
  selectedPeriode: PeriodeOption;
  warehouses: WarehouseOption[];
  periodes: PeriodeOption[];
  onWarehouseChange: (wh: WarehouseOption) => void;
  onPeriodeChange: (period: PeriodeOption) => void;
  onReset: () => void;
  onSyncSheet?: () => void;
  loadingSheet?: boolean;
}

export default function Header({
  selectedWarehouse,
  selectedPeriode,
  warehouses,
  periodes,
  onWarehouseChange,
  onPeriodeChange,
  onReset,
  onSyncSheet,
  loadingSheet,
}: HeaderProps) {
  const [whDropdownOpen, setWhDropdownOpen] = useState(false);
  const [periodDropdownOpen, setPeriodDropdownOpen] = useState(false);

  return (
    <header className="relative w-full bg-[#091b34] text-white px-6 py-4 rounded-xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800" id="dashboard-header">
      {/* Left section: Title & Icon */}
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 shadow-inner">
          <Warehouse className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-wider text-slate-100 flex items-center gap-2">
            STORING DASHBOARD
          </h1>
          <p className="text-xs md:text-sm text-slate-400 font-medium">
            Monitoring Storing &amp; Storing Performance
          </p>
        </div>
      </div>

      {/* Right section: Filters & Operations */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Sync Google Sheet Button */}
        {onSyncSheet && (
          <button
            onClick={onSyncSheet}
            disabled={loadingSheet}
            className={`flex items-center gap-2 px-3 py-2 ${loadingSheet ? 'bg-blue-600/20 text-blue-400 border-blue-500/30' : 'bg-emerald-600 hover:bg-emerald-500 border border-emerald-500 text-white font-bold'} rounded-lg text-xs cursor-pointer transition-all duration-200 active:scale-95`}
            title="Synchronize Live Google Sheet data (Kolom A-F)"
            id="btn-sync-sheet"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingSheet ? 'animate-spin' : ''}`} />
            <span>{loadingSheet ? 'Syncing...' : 'Sync Live Sheet'}</span>
          </button>
        )}

        {/* Reset Button */}
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg text-xs font-medium cursor-pointer transition-colors duration-200"
          title="Reset to original screenshot values"
          id="btn-reset-data"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset data</span>
        </button>

        {/* Periode filter */}
        <div className="relative">
          <div
            onClick={() => {
              setPeriodDropdownOpen(!periodDropdownOpen);
              setWhDropdownOpen(false);
            }}
            className="bg-white text-slate-800 rounded-lg px-4 py-1.5 flex items-center gap-3 cursor-pointer select-none border border-slate-200 shadow-sm hover:border-blue-500 hover:shadow transition-all duration-200"
            style={{ minWidth: '190px' }}
            id="filter-periode"
          >
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="flex flex-col text-left">
              <span className="text-[9px] font-bold text-slate-400 tracking-wider leading-none uppercase">
                PERIODE
              </span>
              <span className="text-xs font-bold text-slate-700 truncate pt-0.5">
                {selectedPeriode.name}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 ml-auto" />
          </div>

          {periodDropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setPeriodDropdownOpen(false)} />
              <div className="absolute right-0 mt-1.5 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden divide-y divide-slate-100">
                {periodes.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onPeriodeChange(p);
                      setPeriodDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-blue-50 text-xs font-semibold text-slate-700 flex items-center justify-between transition-colors duration-150 cursor-pointer"
                  >
                    <span>{p.name}</span>
                    {selectedPeriode.id === p.id && (
                      <Check className="w-3.5 h-3.5 text-blue-600 font-bold" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Warehouse filter */}
        <div className="relative">
          <div
            onClick={() => {
              setWhDropdownOpen(!whDropdownOpen);
              setPeriodDropdownOpen(false);
            }}
            className="bg-white text-slate-800 rounded-lg px-4 py-1.5 flex items-center gap-3 cursor-pointer select-none border border-slate-200 shadow-sm hover:border-blue-500 hover:shadow transition-all duration-200"
            style={{ minWidth: '190px' }}
            id="filter-warehouse"
          >
            <Warehouse className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="flex flex-col text-left">
              <span className="text-[9px] font-bold text-slate-400 tracking-wider leading-none uppercase">
                WAREHOUSE
              </span>
              <span className="text-xs font-bold text-slate-700 truncate pt-0.5">
                {selectedWarehouse.name}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 ml-auto" />
          </div>

          {whDropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setWhDropdownOpen(false)} />
              <div className="absolute right-0 mt-1.5 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden divide-y divide-slate-100">
                {warehouses.map((wh) => (
                  <button
                    key={wh.id}
                    onClick={() => {
                      onWarehouseChange(wh);
                      setWhDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-blue-50 text-xs font-semibold text-slate-700 flex items-center justify-between transition-colors duration-150 cursor-pointer"
                  >
                    <span>{wh.name}</span>
                    {selectedWarehouse.id === wh.id && (
                      <Check className="w-3.5 h-3.5 text-blue-600 font-bold" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
