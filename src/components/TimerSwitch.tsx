import useStore from 'hooks/use-store';
import classes from './TimerSwitch.module.scss';
import {TTimer} from 'store/store-pomodoro';

const TimerSwitch= () => {

  const store = useStore("pomodoro", true)[0];

   return (
       <div className={classes["timer-buttons"]}>
         <SwitchTimerButton timerType={TTimer.Pomodoro}/>
         <SwitchTimerButton timerType={TTimer.ShortBreak}/>
         <SwitchTimerButton timerType={TTimer.LongBreak}/>
       </div>
   );
}

const SwitchTimerButton:React.FC<{timerType: TTimer}> = (props) => {

  const [store,dispatch] = useStore("pomodoro",true);
  const isActive:boolean = store.currentTimer === props.timerType;
  const timer = store.timerTypes.get(props.timerType);

  const handleClick = () => {
    dispatch("SETSTATE",props.timerType)
  }

  return <button onClick={handleClick} className={isActive ? classes.active  : '' }>
    {timer.name}
    { timer.runs > 0 && <span className={classes.badge}>{timer.runs}</span>}
  </button>

}

export default TimerSwitch;