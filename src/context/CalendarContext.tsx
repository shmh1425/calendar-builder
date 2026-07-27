import { createContext, useContext, useReducer, useEffect, useCallback, type ReactNode } from 'react';
import type { CalendarState } from '../types/calendar';
import { DEFAULT_STATE } from '../constants/defaults';
import {
  saveCurrentDesign,
  loadCurrentDesign,
  saveLastDesign,
  loadLastDesign,
  loadStateFromUrl,
  applyWeekdayDefault,
} from '../utils/storage';

type Action =
  | { type: 'SET_STATE'; payload: Partial<CalendarState> }
  | { type: 'RESET' }
  | { type: 'RESTORE'; payload: CalendarState };

function reducer(state: CalendarState, action: Action): CalendarState {
  switch (action.type) {
    case 'SET_STATE':
      return { ...state, ...action.payload };
    case 'RESET': {
      const reset = {
        ...DEFAULT_STATE,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
      };
      return applyWeekdayDefault(reset);
    }
    case 'RESTORE':
      return action.payload;
    default:
      return state;
  }
}

interface CalendarContextValue {
  state: CalendarState;
  updateState: (partial: Partial<CalendarState>) => void;
  resetState: () => void;
  restoreState: (state: CalendarState) => void;
  undoLast: () => void;
  hasUndo: boolean;
}

const CalendarContext = createContext<CalendarContextValue | null>(null);

function getInitialState(): CalendarState {
  const fromUrl = loadStateFromUrl();
  if (fromUrl) return fromUrl;
  const saved = loadCurrentDesign();
  if (saved) return saved;
  return applyWeekdayDefault({
    ...DEFAULT_STATE,
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });
}

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState);
  const [previousState, setPreviousState] = useReducer(
    (_: CalendarState | null, action: CalendarState | null) => action,
    null,
  );

  useEffect(() => {
    saveCurrentDesign(state);
  }, [state]);

  const updateState = useCallback(
    (partial: Partial<CalendarState>) => {
      setPreviousState(state);
      dispatch({ type: 'SET_STATE', payload: partial });
    },
    [state],
  );

  const resetState = useCallback(() => {
    setPreviousState(state);
    saveLastDesign(state);
    dispatch({ type: 'RESET' });
  }, [state]);

  const restoreState = useCallback((newState: CalendarState) => {
    setPreviousState(state);
    dispatch({ type: 'RESTORE', payload: newState });
  }, [state]);

  const undoLast = useCallback(() => {
    if (previousState) {
      dispatch({ type: 'RESTORE', payload: previousState });
      setPreviousState(null);
    } else {
      const last = loadLastDesign();
      if (last) dispatch({ type: 'RESTORE', payload: last });
    }
  }, [previousState]);

  return (
    <CalendarContext.Provider
      value={{
        state,
        updateState,
        resetState,
        restoreState,
        undoLast,
        hasUndo: previousState !== null || loadLastDesign() !== null,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const ctx = useContext(CalendarContext);
  if (!ctx) throw new Error('useCalendar must be used within CalendarProvider');
  return ctx;
}
