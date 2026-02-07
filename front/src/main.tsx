import {createContext} from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import UserStore from "../store/UserStore.ts";
import RoomsStore from "../store/RoomsStore.ts";

interface ContextValue {
    user: UserStore
    rooms: RoomsStore
}

export const Context = createContext<ContextValue>({} as ContextValue)

createRoot(document.getElementById('root')!).render(
      <Context.Provider value={{
          user: new UserStore(),
          rooms: new RoomsStore()
      }}>
    <App/>
      </Context.Provider>
)
