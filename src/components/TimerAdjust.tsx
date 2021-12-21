import useStore from 'hooks/use-store';
import classes from './TimerSwitch.module.scss';
import {TTimer} from 'store/store-pomodoro';
import React, { KeyboardEventHandler } from 'react';

const TimerAdjust= () => {

   return (
     <div className={classes.adjuster}>
        <TimeAdjuster
          timerType={TTimer.Pomodoro}
        />
        <TimeAdjuster
          timerType={TTimer.ShortBreak}
        />
        <TimeAdjuster
          timerType={TTimer.LongBreak}
        />
     </div>
   );
}

const TimeAdjuster:React.FC<{timerType: TTimer}> = (props) => {

  const [store,dispatch] = useStore("pomodoro",false);

  const handleClick = (val: number) => {
    dispatch('ADJUSTTIMER', {timerType: props.timerType, val: val})
  }
  
  
  const handleChange:React.ChangeEventHandler<HTMLInputElement>= (e) => {
    const newValue = parseInt( e.currentTarget.value );
    if ( newValue > 0 && newValue < 86400)
    {
      const oldValue = store.timerTypes.get(props.timerType).min      
      dispatch('ADJUSTTIMER', {timerType: props.timerType, val: newValue - oldValue})
    }
  }

  /* Because of freeCodeCamp Assertion tests! Not required normally! */
  const ids = {prefix: '', labelText:''};
  switch (props.timerType) {
    case TTimer.Pomodoro:
      ids.prefix = "session";
      ids.labelText = "Session Length";
    break;
    case TTimer.ShortBreak:
      ids.prefix = "break";
      ids.labelText = "Break Length";
    break;
    case TTimer.LongBreak:
      ids.prefix = "long-break";
      ids.labelText = "Long Break Length";
    break;
  }

  return (
    <div className={classes["adjuster-inner"]}>
      <div>
        <button id={`${ids.prefix}-decrement`} onClick={() => { handleClick(-1)}}>-</button>
        <input id={`${ids.prefix}-length`} type="number" value={ store.timerTypes.get(props.timerType).min } onChange={handleChange}/>
        <button id={`${ids.prefix}-increment`} onClick={() => { handleClick(1)}}>+</button>
      </div>
      <label id={`${ids.prefix}-label`}>{ids.labelText}</label>
    </div>
  );
}

export default TimerAdjust;