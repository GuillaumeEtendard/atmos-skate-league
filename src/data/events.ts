export const TOTAL_SPOTS = 20;

export type EventType = 'king' | 'queen' | 'electric' | 'mixte';

export interface EventItem {
  id: string;
  date: string;
  time: string;
  title: string;
  type: EventType;
  totalSpots: number;
  comingSoon: boolean;
}

export const EVENTS: EventItem[] = [
  { id: 'king-15-mars', date: 'DIMANCHE 15 MARS', time: '18H00 / 20H00', title: 'King of the Road', type: 'king', totalSpots: TOTAL_SPOTS, comingSoon: false },
  { id: 'king-11-avril', date: 'SAMEDI 11 AVRIL', time: '19h30 / 21h30', title: 'King of the Road', type: 'king', totalSpots: TOTAL_SPOTS, comingSoon: false },
  { id: 'electric-9-mai', date: 'SAMEDI 9 MAI', time: '19h30 / 21h30', title: 'Électrique', type: 'electric', totalSpots: TOTAL_SPOTS, comingSoon: false },
  { id: 'queen-28-mars', date: 'SAMEDI 28 MARS', time: '19h30 / 21h30', title: 'Queen of the Road', type: 'queen', totalSpots: TOTAL_SPOTS, comingSoon: false },
  { id: 'queen-25-avril', date: 'SAMEDI 25 AVRIL', time: '19h30 / 21h30', title: 'Queen of the Road', type: 'queen', totalSpots: TOTAL_SPOTS, comingSoon: true },
  { id: 'mixte-24-mai', date: 'DIMANCHE 24 MAI', time: '18H00 / 20H00', title: 'Mixte', type: 'mixte', totalSpots: TOTAL_SPOTS, comingSoon: true },
];

export function getEventById(eventId: string): EventItem | undefined {
  return EVENTS.find((e) => e.id === eventId);
}
