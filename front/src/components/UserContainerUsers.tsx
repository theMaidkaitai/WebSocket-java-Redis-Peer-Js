import "./styles/UserContainerUsersStyle/UserContainerStyle.css"
import {useContext, useState} from "react";
import {Context} from "../main.tsx";
import voiceIcon from "../assets/voice-icon.png"
import "./styles/UserContainerStyles/UserContainerUsers.css"
import {observer} from "mobx-react";
import UserComponent from "./UserComponent.tsx";

const UserContainerUsers = observer(({

    addUser, deleteUser, localInRoom, localRoomId, onJoinRoom, onLeaveRoom

}) => {
    const {user, rooms} = useContext(Context);

    const handleSelectRoom = (roomId: string) => {
        if (!localInRoom) {
            onJoinRoom(roomId)
            user.setRoomId(roomId)
            const userId = user.getId();

            if (!userId) {
                alert("Пользователь не авторизован!");
                return;
            }


            const success = rooms.join(userId, roomId);
            user.setInRoom(true)
            addUser(userId, roomId);
            console.log(user.getInRoom)
        }
    };


    const getUserRoomId = (): string | null => {
        const userId = user.getId();
        if (!userId) return null;

        const userRooms = rooms.getUserRoom(userId);
        // @ts-ignore
        return userRooms?.length > 0 ? userRooms[0].id : null;
    };

    const currentUserRoomId = getUserRoomId();

    return (
        <div className="rooms-list">
            {rooms.getRooms().map((room) => {
                const roomUsers = room.users || [];
                const isCurrentUserInRoom = currentUserRoomId === room.id;
                
                return (
                    <div
                        key={room.id}
                        className={`Main-Users-Container ${isCurrentUserInRoom ? 'active' : ''}`}
                    >
                        <div className="User-Container">
                            <div className="User-Header">
                                <div className="User-Header-Name">
                                    <span 
                                        className="room-title" 
                                        onClick={() => handleSelectRoom(room.id)}
                                        style={{ cursor: localInRoom ? 'not-allowed' : 'pointer' }}
                                    >
                                        {room.name} ({roomUsers.length})
                                    </span>
                                    <img src={voiceIcon} alt="Voice" className="sound-logo"/>
                                </div>
                            </div>

                            <div className="User-Divider"></div>

                            <div className="User-Content">
                                <div className="User-Header-Date">
                                    {roomUsers.map(userIdInRoom => (
                                        <UserComponent
                                            key={userIdInRoom}
                                            deleteUser={deleteUser}
                                            userIdInRoom={userIdInRoom} 
                                            localInRoom={localInRoom}
                                            localRoomId={localRoomId}
                                            onLeaveRoom={onLeaveRoom}
                                            isCurrentUserInThisRoom={isCurrentUserInRoom}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
});

export default UserContainerUsers;