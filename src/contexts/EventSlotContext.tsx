import { createContext, useContext, useState, ReactNode } from 'react';

export interface EventSlot {
  id: string;
  date: string;
  time: string;
  title: string;
  type: 'king' | 'queen' | 'electric' | 'mixte';
}

interface EventSlotContextType {
  selectedSlot: EventSlot | null;
  setSelectedSlot: (slot: EventSlot | null) => void;
}

const EventSlotContext = createContext<EventSlotContextType | undefined>(undefined);

export const EventSlotProvider = ({ children }: { children: ReactNode }) => {
  const [selectedSlot, setSelectedSlot] = useState<EventSlot | null>(null);

  return (
    <EventSlotContext.Provider value={{ selectedSlot, setSelectedSlot }}>
      {children}
    </EventSlotContext.Provider>
  );
};

export const useEventSlot = () => {
  const context = useContext(EventSlotContext);
  if (context === undefined) {
    throw new Error('useEventSlot must be used within an EventSlotProvider');
  }
  return context;
};
