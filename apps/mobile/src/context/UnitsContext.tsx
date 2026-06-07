import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Units = 'imperial' | 'metric';
const STORAGE_KEY = 'glidr.units';

interface UnitsContextValue {
  units: Units;
  setUnits: (u: Units) => void;
}

const UnitsContext = createContext<UnitsContextValue>({ units: 'imperial', setUnits: () => {} });

export const useUnits = () => useContext(UnitsContext);

export function UnitsProvider({ children }: { children: ReactNode }) {
  const [units, setUnitsState] = useState<Units>('imperial');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((v) => {
      if (v === 'imperial' || v === 'metric') setUnitsState(v);
    }).catch(() => {});
  }, []);

  const setUnits = (u: Units) => {
    setUnitsState(u);
    AsyncStorage.setItem(STORAGE_KEY, u).catch(() => {});
  };

  return <UnitsContext.Provider value={{ units, setUnits }}>{children}</UnitsContext.Provider>;
}
