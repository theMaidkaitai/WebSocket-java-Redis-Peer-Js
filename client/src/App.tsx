import './App.css'
import SideBarComponent from "./components/SideBarComponent.tsx";
import VoidComponent from "./components/VoidComponent.tsx";
import {useContext, useEffect, useRef} from "react";
import {checkUser, registUser} from "./ws/user/userWsApi.ts";
import initClient from "./ws";
import {Context} from "./main.tsx";
import {getCookie} from "./ws/getCookie.ts";
import {getRooms} from "./ws/rooms/roomsWsApi.ts";

function App() {
    const { rooms } = useContext(Context);
    const clientRef = useRef(null);
    const registrationAttempted = useRef(false);

    useEffect(() => {
        const init = async () => {
            const handleCreateUser = async () => {
                console.log("WebSocket connected, handling user...");
                const userId: string = getCookie("id");

                if (!userId || userId === "null" || userId === "undefined") {
                    console.log("No user cookie, registering new user...");
                    await registUser();
                    await getRooms();
                    return;
                }

               
                checkUser(userId, async (exists) => {
                    if (!exists && !registrationAttempted.current) {
                        registrationAttempted.current = true;
                        console.log("User not found, registering...");
                        await registUser();
                    } else if (exists) {
                        console.log("User already exists:", userId);
                    }
                    await getRooms();
                });
            };

            const client = initClient(rooms, handleCreateUser);
            clientRef.current = client;
        }

        init();

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
    );
}

export default App;