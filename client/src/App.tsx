import './App.css'
import SideBarComponent from "./components/SideBarComponent.tsx";
import VoidComponent from "./components/VoidComponent.tsx";
import {useContext, useEffect, useRef} from "react";
import {checkUser, registUser} from "./ws/user/userWsApi.ts";
import initClient from "./ws";
import {Context} from "./main.tsx";
import {getCookie} from "./ws/getCookie.ts";
import {getRooms, getUsersInRoom} from "./ws/rooms/roomsWsApi.ts";

function App() {
    const { rooms } = useContext(Context);
    const clientRef = useRef(null);

    useEffect(() => {
        const init = async () => {

            const handleCreateUser = async () => {
                console.log("WebSocket connected, registering user...");
                const userId: string = getCookie("id");

                if (userId === null || userId === undefined) {
                    await registUser();
                }

                checkUser(userId, (exists) => {
                    if (!exists) {
                        console.log("User not found, registering...");
                         registUser();
                    } else {
                        console.log("User already exists:", userId);
                    }
                });
                await getRooms();
            };


            const client =  initClient(rooms, handleCreateUser);
            clientRef.current = client;
        }


        init()
        return () => {
            if (clientRef.current) {
                clientRef.current.deactivate();
            }
        };
    }, []);



  return (
      <div style={{ position: 'relative', minHeight: '100vh' }}>
          <SideBarComponent/>
          <VoidComponent/>
      </div>

  )
}

export default App
