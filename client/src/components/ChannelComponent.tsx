import React, {useContext, useEffect, useState} from 'react';
import dynamic from "../assets/dynamIcon.png"
import "../styles/ChannelComponentStyles/ChannelStyles.css"
import UserComponent from "./UserComponent.tsx";
import {Context} from "../main.tsx";
import { observer } from 'mobx-react-lite';
import {connectToRoom, disconnectUser, getUsersInRoom} from "../ws/rooms/roomsWsApi.ts";
import {getCookie} from "../ws/getCookie.ts";
import disconnectIcon from "../assets/disconnectIcon.png"
import {UserData} from "../store/RoomStore.ts";
import {peerInstanse} from "../peer";


interface ChannelComponentProps {
    id?: string;
    title?: string;
    users?: UserData[];
}

const ChannelComponent = observer(({id, title}: ChannelComponentProps) => {
    const { rooms } = useContext(Context);
    const [peer, setPeer] = useState(null);

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

        if (!window.activeCalls) window.activeCalls = new Map();
        if (!window.remoteAudios) window.remoteAudios = new Map();

        const currentUserIds = users.map(u => u.id);

        window.activeCalls.forEach((call, userId) => {
            if (!currentUserIds.includes(userId) && userId !== myId) {
                console.log("Закрываем звонок с:", userId);
                call.close();
                window.activeCalls.delete(userId);

                const audio = window.remoteAudios.get(userId);
                if (audio) {
                    audio.pause();
                    audio.srcObject = null;
                    audio.remove();
                    window.remoteAudios.delete(userId);
                }
            }
        });

        if (users && users.length > 0) {
            users.forEach(user => {
                if (user.id !== myId && !window.activeCalls.has(user.id)) {
                    console.log("Звоню пользователю:", user.id);
                    const call = peer.peer.call(user.id, peer.mediaStream);

                    window.activeCalls.set(user.id, call);

                    call.on("stream", (remoteStream) => {
                        console.log("Получен стрим от:", user.id);
                        const remoteAudio = new Audio();
                        remoteAudio.setAttribute("data-peer-id", user.id);
                        remoteAudio.srcObject = remoteStream;
                        remoteAudio.play();
                        window.remoteAudios.set(user.id, remoteAudio);
                    });

                    call.on("close", () => {
                        console.log("Звонок закрыт с:", user.id);
                        const audio = window.remoteAudios.get(user.id);
                        if (audio) {
                            audio.pause();
                            audio.srcObject = null;
                            audio.remove();
                            window.remoteAudios.delete(user.id);
                        }
                        window.activeCalls.delete(user.id);
                    });
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