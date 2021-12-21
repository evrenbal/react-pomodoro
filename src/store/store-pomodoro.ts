import { initStore } from 'hooks/use-store';
import lodashClonedeep  from 'lodash.clonedeep';

type TPomodoroState = {
  timerTypes: Map<TTimer, {min: number, name: string, runs: number}>,
  switchedFrom: TTimer | null,
  currentTimer: TTimer
}

export enum TTimer {
  Pomodoro=1,
  ShortBreak,
  LongBreak,
}

export const initialState:TPomodoroState = {
  timerTypes : new Map([
      [ TTimer.Pomodoro, { min: 25, name: 'Pomodoro', runs : 0} ],
      [ TTimer.ShortBreak, { min: 5, name: 'Short Break', runs: 0 }],
      [ TTimer.LongBreak, { min: 15, name: 'Long Break', runs: 0}],
    ]
  ),
  switchedFrom : null,
  currentTimer : TTimer.Pomodoro
};

const configureStore = (state:TPomodoroState = lodashClonedeep(initialState) ) => {

  const actions = {
      SETSTATE: (state:TPomodoroState, timerType: TTimer) => {
        const newState = lodashClonedeep( state );
        newState.switchedFrom = newState.currentTimer;
        newState.currentTimer =  timerType; 
        return newState;
      },
      ADJUSTTIMER: (state:TPomodoroState, payload: {timerType: TTimer, val: number}  ) => {
        const newState = lodashClonedeep( state ) ;
        const current = newState.timerTypes.get(payload.timerType);
        if (! current )
          throw new Error('Undefined timer type '+ payload.timerType );
        if (current.min + payload.val > 0 && current.min + payload.val < 86400)
          newState.timerTypes.set(payload.timerType, {min: current.min + payload.val, name: current.name, runs: current.runs } );
        return newState;
      },
      RESET: () => {
        return lodashClonedeep( initialState) ;
      },
      FINISH: (state:TPomodoroState, payload : {current : TTimer, next?:TTimer} ) => {
        const newState = lodashClonedeep(state);
        const t = newState.timerTypes.get(payload.current);
        if(t) t.runs++;
        if (payload.next !== undefined) {
          newState.switchedFrom = null;
          newState.currentTimer = payload.next;
        }
        return newState;
      }
    };

    initStore('pomodoro', actions, state );
};

export default configureStore;