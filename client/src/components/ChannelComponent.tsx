import React, {useContext, useEffect, useState} from 'react';
import dynamic from "../assets/dynamIcon.png"
import "../styles/ChannelComponentStyles/ChannelStyles.css"
import UserComponent from "./UserComponent.tsx";
import {Context} from "../main.tsx";
import { observer } from 'mobx-react-lite';
import {connectToRoom, disconnectUser, getRooms, getUsersInRoom} from "../ws/rooms/roomsWsApi.ts";
import {getCookie} from "../ws/getCookie.ts";
import disconnectIcon from "../assets/disconnectIcon.png"


interface ChannelComponentProps {
    id?: string;
    title?: string;
    usersId?: string[];
}

const ChannelComponent = observer(({id, title, usersId}: ChannelComponentProps) => {
    const { rooms } = useContext(Context);

    const handleJoin = async () => {
        const userId = getCookie("id")
        console.log(`userId: ${userId} roomId: ${id}`)
        await connectToRoom(userId, id)

    };

    const handleDisconnect = async () => {
        const userId = getCookie("id")
        disconnectUser(userId, id)
        //await getUsersInRoom(id);
    }

    useEffect(() => {
        console.log("roomId: " + id);
        const init = async () => {
            await getUsersInRoom(id)
        }
        init()
    }, []);


    const room = rooms.rooms.find(r => r.id === id);
    const users = room?.users || [];


    const userId = getCookie("id")
    const isUserInRoom = rooms.isUserInRoom(id, userId);

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