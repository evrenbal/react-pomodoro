import useStore from 'hooks/use-store';
import {useState} from 'react';

import Timer from 'components/Timer';
import TimerSwitch from 'components/TimerSwitch';
import TimerAdjust from 'components/TimerAdjust';
import classes from './PomodoroClock.module.scss';

const PomodoroClock = () => {

  const [store, dispatch] = useStore("pomodoro",true);
  const [lastReset, setLastReset] = useState(0);  

  const handleReset = () => {
    dispatch("RESET");
    setLastReset(new Date().getTime())
  };
  
  return (
    <div className={`${classes['pomodoro-app']} timertype-${store.currentTimer}`}>
      <div className="container mx-auto">
        <div className={classes["pomodoro-header"]}>
          <TimerSwitch/>
          <TimerAdjust/>
        </div>
        <button onClick={handleReset} className="text-white mt-5 block mx-auto" id="reset">
          <i className="fa fa-times-circle" /> Reset Settings
        </button>

        <div className={classes['pomodoro-timer']}>
          <Timer timerType={store.currentTimer} lastReset={lastReset}/>
        </div>
      </div>
    </div>
  )
}

export default PomodoroClock;