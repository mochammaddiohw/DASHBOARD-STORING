export interface OccupancyArea {
  id: string;
  name: string;
  capacity: number;
  used: number;
  emptyCont: number;
  occupancy: number; // percentage
}

export interface PickZoneData {
  id: string;
  name: string;
  allTimeAvg: number; // percentage
  pctPickZone: number; // blue level (1-2)
  pctBuffer: number; // gray level (3-9)
}

export interface ProcessAccuracy {
  id: string;
  name: string;
  description?: string;
  hit: number;
  miss: number;
}

export interface InboundValidationState {
  totalSku: number;
  totalLpnDivalidasi: number;
  lpnHit: number;
  lpnMiss: number;
}

export interface AreaDetail {
  id: string;
  name: string;
  workload: number;
  manpower: number;
  capacity: number;
}

export interface WarehouseOption {
  id: string;
  name: string;
}

export interface PeriodeOption {
  id: string;
  name: string;
}
