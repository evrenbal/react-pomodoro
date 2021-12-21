import { useReducer, useEffect } from 'react';
import lodashClonedeep  from 'lodash.clonedeep';
import useStore from 'hooks/use-store';
import classes from 'components/Timer.module.scss';
import {TTimer} from 'store/store-pomodoro';

const stripHtml = (html:string): string => {
  let tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

let untilLongBreak = 4;
let deneme="";

const sec2Time: (sec:number) => string = (sec) => {
  
  const hours = Math.floor(sec/3600);
  sec=(sec%3600);
  const minutes = Math.floor(sec/60);
  sec = (sec%60);
  
  let str = '';
  if (hours>0)
    str+=( hours < 10 ? '0': '') + hours + '<sup>h</sup>' + (sec%2 === 0 ? ':' : ' ');
  
  str+= (minutes > 0 ? ( ( minutes < 10 ? '0' : '' ) + minutes ) : '00' )
        + (hours > 0 ? '<sup>m</sup>' : '');

  if (hours === 0 )
    str+=':'+(sec<10 ? '0' : '')+sec + (hours > 0 ? '<sup>s</sup>' : '');

  return str;
}

type TState = {
  elapsed: number,
  timerId: NodeJS.Timer|null  
}
const initialState:TState = { elapsed: 0, timerId: null  }

type TAction = {
  type: string,
  payload?: any
}

const reducer = ( state:TState, action:TAction ) => {
  const newState = lodashClonedeep(state);
  switch (action.type) {
    case 'INCREASE':
      newState.elapsed++;
      newState.timerId = action.payload;
    break;
    case 'STOP':
      if (newState.timerId !== null)
        clearTimeout( newState.timerId );
      return { elapsed: 0, timerId: null };
    case 'PAUSE':
      if (newState.timerId !== null)
        clearTimeout( newState.timerId );
        newState.timerId = null;
    break;
    default:
      throw new Error("UNHANDLED ACTION"+ action.type);
  }
  return newState;
}

const Timer:React.FC<{ timerType: number, lastReset: number}> = (props) => {

  const {timerType, lastReset} = props;
  const [state, reducerDispatch] = useReducer( reducer, initialState );
  const [store, storeDispatch] = useStore("pomodoro",true);
  const {min, name} = store.timerTypes.get(timerType);

  let maxTime:number = min ? min *60 : 0;
  if ( maxTime > 86400) { maxTime = 86400; }
  if ( maxTime < 0) { maxTime = 0;}

  const handleStart = () => {
    if (props.timerType === TTimer.LongBreak)
      untilLongBreak = 4;
    const timerId = setInterval( () => {
      reducerDispatch( { type: 'INCREASE', payload: timerId  });
    }, 1000);
  }

  const handleStop = () => {
    reducerDispatch( { type: 'STOP' });
    storeDispatch( 'FINISH', { current: props.timerType} );
    if ( props.timerType === TTimer.Pomodoro && state.elapsed > maxTime )
      untilLongBreak--;
  }

  const handlePause = () => {
    reducerDispatch( { type: 'PAUSE' });      
  }

  const handleNext = () => {
    if (props.timerType !== TTimer.Pomodoro)
      return;
    if ( state.elapsed > maxTime )
      untilLongBreak--;
    let nextTimer = TTimer.ShortBreak;
    if (untilLongBreak <= 0)
      nextTimer = TTimer.LongBreak;
    storeDispatch( 'FINISH', { current: props.timerType, next : nextTimer } );
  }

  const handlePrev = () => {
    storeDispatch( 'FINISH', { current:props.timerType, next: TTimer.Pomodoro } );
  }

  useEffect( () => {
    if ( store.switchedFrom && state.elapsed > maxTime)
    {
      storeDispatch( 'FINISH', { current: store.switchedFrom });
    }

    if ( store.switchedFrom === TTimer.Pomodoro &&  state.elapsed > maxTime )      
      untilLongBreak--;

    return () => {
      reducerDispatch( { type: 'STOP' });
    }
  }, [ timerType, lastReset ] );


  const progress = (state.elapsed < maxTime ? 100 - Math.round( state.elapsed / maxTime * 100) : 0) ;

  document.getElementsByTagName('title')[0].innerHTML = stripHtml( sec2Time( maxTime- state.elapsed ) );

  return (
    <div className={classes["timer"]}>
      <div className={classes["timer-inner"]}>
        <div
          className={classes.progress}
          style={{
            clipPath: `polygon(0 ${progress}%, 100% ${progress}%, 100% 100%, 0% 100%)`,
          }}
        ></div>
        {
          state.elapsed > maxTime && props.timerType === TTimer.Pomodoro &&
            <button className={classes["next-timer"]} onClick={handleNext}>
              <i className="fa fa-arrow-circle-right" />
            </button>
        }
        {
          state.elapsed > maxTime && props.timerType !== TTimer.Pomodoro &&
            <button className={classes["prev-timer"]} onClick={handlePrev}>
              <i className="fa fa-arrow-circle-left" />
            </button>
        }          
        <div className={classes.title}>
          <span id="timer-label">{name}</span>
        </div>
        <div className={classes.time}>
          {(state.elapsed <= maxTime && (
            <span
              id="time-left"
              className={classes.normaltime}
              dangerouslySetInnerHTML={{
                __html: sec2Time(maxTime - state.elapsed),
              }}
            ></span>
          )) || (
            <span id="time-left" className={classes.normaltime}>
              00:00
            </span>
          )}
          {state.elapsed > maxTime && (
            <span
              id="time-left"
              className={classes.excesstime}
              dangerouslySetInnerHTML={{
                __html: "+" + sec2Time(state.elapsed - maxTime),
              }}
            ></span>
          )}
        </div>

        <div className={classes.controls}>
          {state.timerId == null && (
            <button id="start_stop" onClick={handleStart}>
              <i className="fa fa-play-circle" />
            </button>
          )}
          {state.timerId != null && (
            <button id="start_stop" onClick={handlePause}>
              <i className="fa fa-pause-circle" />
            </button>
          )}
          {state.timerId != null && (
            <button onClick={handleStop}>
              <i className="fa fa-stop-circle" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Timer;