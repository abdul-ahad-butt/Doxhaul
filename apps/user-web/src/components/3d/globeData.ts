import * as THREE from 'three';
import { HubData, LogisticsRoute } from './HubTelemetryWidget';

// Geographic coordinates for primary global freight hubs
export const GLOBAL_HUBS: HubData[] = [
  { id: 'la', name: 'Los Angeles Port', country: 'USA', lat: 33.742, lng: -118.267, role: 'shipper', volume: '10.6M TEU', status: 'Optimal', activeFleets: 1420 },
  { id: 'ny', name: 'New York / NJ Hub', country: 'USA', lat: 40.669, lng: -74.148, role: 'broker', volume: '9.5M TEU', status: 'High Traffic', activeFleets: 1890 },
  { id: 'london', name: 'London Gateway', country: 'UK', lat: 51.507, lng: -0.127, role: 'broker', volume: '4.2M TEU', status: 'Optimal', activeFleets: 840 },
  { id: 'rotterdam', name: 'Port of Rotterdam', country: 'Netherlands', lat: 51.956, lng: 4.12, role: 'carrier', volume: '14.8M TEU', status: 'Heavy Hub', activeFleets: 2310 },
  { id: 'dubai', name: 'Jebel Ali Dubai', country: 'UAE', lat: 24.985, lng: 55.061, role: 'shipper', volume: '13.7M TEU', status: 'Optimal', activeFleets: 1120 },
  { id: 'singapore', name: 'Singapore Mega Port', country: 'Singapore', lat: 1.264, lng: 103.84, role: 'carrier', volume: '37.3M TEU', status: 'Congested', activeFleets: 3450 },
  { id: 'tokyo', name: 'Tokyo Port Complex', country: 'Japan', lat: 35.619, lng: 139.778, role: 'shipper', volume: '5.1M TEU', status: 'Optimal', activeFleets: 970 },
  { id: 'shanghai', name: 'Shanghai Gateway', country: 'China', lat: 31.23, lng: 121.473, role: 'carrier', volume: '47.3M TEU', status: 'Peak Volume', activeFleets: 4100 },
  { id: 'hamburg', name: 'Port of Hamburg', country: 'Germany', lat: 53.546, lng: 9.966, role: 'broker', volume: '8.7M TEU', status: 'Optimal', activeFleets: 1290 },
  { id: 'sydney', name: 'Port Botany Sydney', country: 'Australia', lat: -33.962, lng: 151.218, role: 'shipper', volume: '2.7M TEU', status: 'Optimal', activeFleets: 630 }
];

// Active freight lanes connecting hubs
export const LOGISTICS_ROUTES: LogisticsRoute[] = [
  { from: 'la', to: 'ny', role: 'broker', rate: '$3,420 / load', weight: 'Overland Corridor' },
  { from: 'ny', to: 'rotterdam', role: 'shipper', rate: '$2,150 / TEU', weight: 'Transatlantic East' },
  { from: 'rotterdam', to: 'dubai', role: 'carrier', rate: '$1,890 / TEU', weight: 'Suez Maritime' },
  { from: 'dubai', to: 'singapore', role: 'carrier', rate: '$2,400 / TEU', weight: 'Indian Ocean Express' },
  { from: 'singapore', to: 'shanghai', role: 'shipper', rate: '$1,200 / TEU', weight: 'East Asia Feeder' },
  { from: 'shanghai', to: 'tokyo', role: 'broker', rate: '$980 / TEU', weight: 'Pacific Shortsea' },
  { from: 'shanghai', to: 'la', role: 'carrier', rate: '$4,100 / TEU', weight: 'Transpacific Primary' },
  { from: 'rotterdam', to: 'hamburg', role: 'broker', rate: '$760 / load', weight: 'Euro Inland Feeder' },
  { from: 'london', to: 'ny', role: 'shipper', rate: '$2,350 / TEU', weight: 'North Atlantic Air/Sea' },
  { from: 'singapore', to: 'sydney', role: 'carrier', rate: '$2,800 / TEU', weight: 'Oceania Trade Link' }
];

// Helper to convert Lat/Long to 3D sphere coordinate
export function latLongToVector3(lat: number, lng: number, radius: number, height = 0): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const r = radius + height;
  return new THREE.Vector3(
    -(r * Math.sin(phi) * Math.cos(theta)),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}
