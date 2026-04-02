import {createContext} from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import RoomStore from "./store/RoomStore.ts";


interface ContextValue {
    rooms: RoomStore
}

export const Context = createContext<ContextValue>({} as ContextValue)


createRoot(document.getElementById('root')!).render(
  <Context.Provider value={{
      rooms: new RoomStore()
  }}>
    <App />
  </Context.Provider>,
)
