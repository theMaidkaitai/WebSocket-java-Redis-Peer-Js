import "./styles/UserContainerUsersStyle/UserContainerStyle.css"
import {useContext, useState} from "react";
import {Context} from "../main.tsx";
import voiceIcon from "../assets/voice-icon.png"
import "./styles/UserContainerStyles/UserContainerUsers.css"
import {observer} from "mobx-react";
import UserComponent from "./UserComponent.tsx";

const UserContainerUsers = observer(({addUser, deleteUser}) => {
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
    const {user, rooms} = useContext(Context);

    const handleSelectRoom = (roomId: string) => {
        if (user._inRoom === false) {
            setSelectedRoom(roomId);
            user.setRoomId(roomId)
            const userId = user.getId();

            if (!userId) {
                alert("Пользователь не авторизован!");
                return;
            }


            const success = rooms.join(userId, roomId);
            user._inRoom = true;
            user.setInRoom(true)
            addUser(userId, roomId);
            console.log(user._inRoom)
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
            {rooms.getRooms().map((room) => (
                <div
                    key={room.id}
                    className={`Main-Users-Container ${currentUserRoomId === room.id ? 'active' : ''}`}

                >
                    <div className="User-Container">
                        <div className="User-Header">
                            <div className="User-Header-Name">
                                <span className="room-title" onClick={() => handleSelectRoom(room.id)}>{room.name}</span>
                                <img src={voiceIcon} alt="Voice" className="sound-logo"/>
                            </div>
                        </div>

                        <div className="User-Divider"></div>

                        <div className="User-Content">
                            <div className="User-Header-Date">
                                {currentUserRoomId === room.id && <UserComponent
                                    deleteUser = {deleteUser}
                                />}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
});

export default UserContainerUsers;