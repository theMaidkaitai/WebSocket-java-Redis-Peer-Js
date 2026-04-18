import React, {useContext, useEffect, useRef, useState} from 'react';
import dynamic from "../assets/dynamIcon.png"
import "../styles/ChannelComponentStyles/ChannelStyles.css"
import UserComponent from "./UserComponent.tsx";
import {Context} from "../main.tsx";
import { observer } from 'mobx-react-lite';
import {connectToRoom, disconnectUser, getRooms, getUsersInRoom} from "../ws/rooms/roomsWsApi.ts";
import {getCookie} from "../ws/getCookie.ts";
import disconnectIcon from "../assets/disconnectIcon.png"
import {UserData} from "../store/RoomStore.ts";
import Peer from "peerjs";
import {peerInstanse} from "../peer";


interface ChannelComponentProps {
    id?: string;
    title?: string;
    users?: UserData[];
}

const ChannelComponent = observer(({id, title}: ChannelComponentProps) => {
    const { rooms } = useContext(Context);
    const [peer, setPeer] = useState(null);
    const prevUsersRef = useRef([])

    const handleJoin = async () => {
        const roomId = localStorage.getItem("roomId");
        const userId = getCookie("id")

        if (roomId) {
            localStorage.removeItem("roomId");
            if (peer !== null) {
                peer.peer.destroy();
            }
            disconnectUser(userId, roomId);
        }

        localStorage.setItem("roomId", id)

        console.log(`userId: ${userId} roomId: ${id}`)


        const peerRtc = await peerInstanse(userId)
        await connectToRoom(userId, id)


        console.log("PEER RTC:", peerRtc.peer)
        console.log("PEER MEDIA STREAM:", peerRtc.mediaStream)

        setPeer(peerRtc);
    };









    const handleDisconnect = async () => {
        const userId = getCookie("id");
        disconnectUser(userId, id);
        peer.peer.destroy();

        const audioElements = document.querySelectorAll('audio');
        audioElements.forEach(audio => {
            audio.pause();
            audio.srcObject = null;
            audio.remove();
        });



        const myId = getCookie("id");
        const currentUserIds = users.map(u => u.id);
        window.activeCalls.forEach((call, userId) => {
            if (!currentUserIds.includes(userId) && userId !== myId) {
                console.log("Закрываем звонок с:", userId);
                call.close();
                window.activeCalls.delete(userId);

                const audio = window.remoteAudios?.get(userId);
                    audio.pause();
                    audio.srcObject = null;
                    audio.remove();
                    window.remoteAudios.delete(userId);
            }
        });


        window.localStream.getTracks().forEach(track => track.stop());
        window.localStream = null;


        setPeer(null);
        localStorage.removeItem("roomId");


        if (window.activeCalls) window.activeCalls.clear();
        if (window.remoteAudios) window.remoteAudios.clear();
    }

    useEffect(() => {
        console.log("roomId: " + id);

        const init = async () => {
            const users = await getUsersInRoom(id)

            const roomId = localStorage.getItem("roomId")
            const userId = getCookie("id")

            if (roomId && userId && peer !== null) {
                await peerInstanse(userId)
            }

            console.log("USERS FROM CHANNEL (Stringify): " + JSON.stringify(users))
            console.log("USERS FROM CHANNEL (not stringify): " + JSON.stringify(users))
        }


        init()
    }, []);


    useEffect(() => { // when close site
        const handleCloseSite = async () => {
            const userId = getCookie("id")
            const roomId = localStorage.getItem("roomId")

            if (userId && roomId) {
                disconnectUser(userId, roomId)
                localStorage.removeItem("roomId")
            }
        }

        window.addEventListener("beforeunload", handleCloseSite);

        return () => {
            window.removeEventListener('beforeunload', handleCloseSite);
        };

    }, []);


    const room = rooms.rooms.find(r => r.id === id);
    const users = room?.users || [];


    const userId = getCookie("id")
    const isUserInRoom = rooms.isUserInRoom(id, userId);





    useEffect(() => {
        if (!peer || !peer.mediaStream) return;

        const myId = getCookie("id");

        if (users && users.length > 0) {
            users.forEach(user => {
                if (user.id !== myId) {
                    console.log("Звоню пользователю:", user.id);
                    peer.peer.call(user.id, peer.mediaStream);
                }
            });
        }

    }, [users, peer]);


    return (
        <div className={"channel-container"}>

            {isUserInRoom && (
                <img src={disconnectIcon} alt="" className={"disconnect-icon"} onClick={handleDisconnect} />
            )}

            <div className="channel-header">
                <h2 onClick={handleJoin}>
                    <img src={dynamic} alt="" className={"dynamic-icon"}/>
                    {title}
                </h2>
            </div>
            <div className={"channel-container-users"}>
                {users.map((user) => (
                    <UserComponent
                        key={user.id}
                        userId={user.id}
                        name={user.name}
                    />
                ))}
            </div>
        </div>
    );
});

export default ChannelComponent;