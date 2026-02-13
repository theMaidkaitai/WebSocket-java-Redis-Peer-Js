import {useContext, useEffect, useRef, useState} from "react";
// @ts-ignore
import SockJS from 'sockjs-client';
import "./App.css"
import {Client} from "@stomp/stompjs";
import InputComponent from "./components/InputComponent.tsx";
import InputNickComponent from "./components/InputNickComponent.tsx";
import {Context} from "./main.tsx"
import {observer} from "mobx-react";
import UserContainerUsers from "./components/UserContainerUsers.tsx";
import initClient from "./ws";

function App() {
    const stompClientRef = useRef<Client | null>(null);
    const { user, rooms } = useContext(Context);

    const [localInRoom, setLocalInRoom] = useState<boolean>(() => {
        return localStorage.getItem("inRoom") === "true";
    });

    const [localRoomId, setLocalRoomId] = useState<string>(() => {
        return localStorage.getItem("roomId") || '';
    });



    function setNickUser(nick: string){
        if (nick.length > 16){
            alert("16 ЭТО НЕ ОГРОМНЫЙ. СЛИШКОМ ДЛИННЫЙ НИК")
            nick = "dalbaeb"
            return nick
        }
        user.setNick(nick);
        console.log('Ник установлен:', nick);
    }

    function clearData () {
        localStorage.removeItem('id')
        localStorage.removeItem("nick")
        localStorage.removeItem("roomIn");
        localStorage.removeItem("roomId");
        user.setInRoom(false);
        user.setRoomId("")
    }

    function removeUser(userId: string, roomId: string){
        try {
            if (!stompClientRef.current) {
                console.log("WebSocket not ready");
                return;
            }

            const date = {
                userId: userId,
                roomId: roomId,
            }

            stompClientRef.current.publish({
                destination: "/voice/delete/user/room",
                body: JSON.stringify(date),
                headers: { 'content-type': 'application/json' }
            });

            console.log("Запрос по комнатам + юзерам отправлен!");

        } catch (e) {
            console.error("Ошибка запроса:", e);
        }
    }

    function getAllRoomsUsers(roomId: string | undefined) {
        try {
            if (!stompClientRef.current) {
                console.log("WebSocket not ready");
                return;
            }

            const date = {
                id: roomId
            }

            stompClientRef.current.publish({
                destination: "/voice/get/all/rooms/users",
                body: JSON.stringify(date),
                headers: { 'content-type': 'application/json' }
            });

            console.log("Запрос по комнатам + юзерам отправлен!");

        } catch (e) {
            console.error("Ошибка запроса:", e);
        }
    }

    function createUser () {
        try {
            if (!stompClientRef.current) {
                console.log("WebSocket not ready")
                return;
            }

            const userId = user.getId();
            stompClientRef.current.publish({
                destination: "/voice/create/user",
                body: userId,
                headers: { 'content-type': 'text/plain' }
            })
        }

        catch (e) {
            console.error(e, "Запрос к Redis WS STOMP не удался (createUser)");
        }
    }

    useEffect(() => {
        user.loadStorage()
        const savedInRoom = localStorage.getItem("inRoom");
        const savedRoomId = localStorage.getItem("roomId");
        user.ensureUserId();

        if (localInRoom && localRoomId) {
            setTimeout(() => {
                if (stompClientRef.current?.connected) {
                    stompClientRef.current.publish({
                        destination: "/voice/get/room/users",
                        body: JSON.stringify({ roomId: localRoomId }),
                        headers: { 'content-type': 'application/json' }
                    });
                }
            }, 2000);
        }
        setTimeout(() => {
            stompClientRef.current = initClient(rooms, () => {
                createUser();
            });

            setTimeout(() => {
                const room = rooms.getRooms();
                room.forEach(room => {
                    console.log('ID комнаты:', room.id);
                    console.log('Название:', room.name);
                    console.log('Пользователи:', room.users);

                    getAllRoomsUsers(room.id);
                });
            }, 2000);
            console.log("USER IN ROOM?", user.getInRoom)
            console.log("USER ID ROOOOM:", user.getRoomId())
        }, 1000);
    }, []);



    function createRoom (name: string) {
        try {
            if (!stompClientRef.current) {
                console.log("WebSocket not ready")
                return;
            }

            const roomData = {
                name: name,
            }

            stompClientRef.current.publish({
                destination: "/voice/create/room",
                body: JSON.stringify(roomData),
                headers: { 'content-type': 'application/json' }
            })
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }

        catch (e) {
            console.error(e, "Запрос к Redis WS STOMP не удался (createUser)");
        }
    }

    function addUser (userId: string, roomId: string) {
        try {
            if (!stompClientRef.current) {
                console.log("WebSocket not ready")
                return;
            }


            const date = {
                roomId: roomId,
                userId: userId,
            }

            stompClientRef.current.publish({
                destination: "/voice/add/user/room",
                body: JSON.stringify(date),
                headers: { 'content-type': 'application/json' }
            })
            console.log("АДД ЮЗЕРА!!!!!")
        }

        catch (e) {
            console.error(e, "Запрос к Redis WS STOMP не удался (addUser)");
        }
    }


    const handleJoinRoom = (roomId: string) => {
        setLocalInRoom(true);
        setLocalRoomId(roomId);
        localStorage.setItem("inRoom", "true");
        localStorage.setItem("roomId", roomId);
    };

    const handleLeaveRoom = () => {
        setLocalInRoom(false);
        setLocalRoomId('');
        localStorage.removeItem("inRoom");
        localStorage.removeItem("roomId");
    };


  return (
    <div className="App-main-container">


        <div className="App-main">
            <UserContainerUsers 
                addUser={addUser} 
                deleteUser = {removeUser}
                localInRoom={localInRoom}
                onJoinRoom={handleJoinRoom}
                onLeaveRoom={handleLeaveRoom}
            />
        </div>

        <div className={"NickContainer"}>
            Ник:
            {
                typeof user.getNick === "string"
                ?
                    ` ${user.getNick}`
                    :
                    "Не указан"
            }
        </div>
        <InputNickComponent setNickFunc={setNickUser}/>
        <InputComponent createRoom = {createRoom} />
        <button onClick={clearData} className={"button-date"}>Очистить данные</button>
    </div>
  )
}

export default observer(App);