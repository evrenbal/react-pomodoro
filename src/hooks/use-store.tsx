import { useState, useEffect } from 'react';

type T_state = any;
type T_listener = React.Dispatch<React.SetStateAction<object>>;
type T_action = (actionIdentifier: T_state, payload: any) => T_state;

interface I_Actions { [key: string]: T_action[]; }
interface I_States  { [key: string]: any }
interface I_Listeners { [key: string]: T_listener[] }


let globalState: I_States = {};
let listeners: I_Listeners = {}
let actions: I_Actions = {}

const useStore = ( storeName: string, shouldListen = true) => {
  
  const setState = useState(globalState[storeName])[1];

  const dispatch = (actionIdentifier:any, payload:any) => {
      if (!actions[storeName][actionIdentifier])
        throw new Error(storeName+" "+actionIdentifier+" not found");
      globalState[storeName] = actions[storeName][actionIdentifier](globalState[storeName], payload);
      for (const listener of listeners[storeName]) {
      listener(globalState[storeName]);
    }
  };

  useEffect(() => {
    if (shouldListen) {
      listeners[storeName].push(setState);
    }

    return () => {
      if (shouldListen) {
        listeners[storeName] = listeners[storeName].filter(li => li !== setState);
      }
    };
  }, [setState, shouldListen, storeName]);
  return [globalState[storeName], dispatch];
};

export const initStore = (storeName: string, storeActions:any, initialState:any) => {
  if (initialState) {
    globalState[storeName] = initialState;
  }
  listeners[storeName] = [];
  actions[storeName] = storeActions;
};

export default useStore;