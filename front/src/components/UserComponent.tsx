import {useContext} from "react";
import {Context} from "../main.tsx";
import "./styles/UserContainerStyles/UserComponent.css"
import microIcon from "../assets/micro-icon.png"
import disconnectIcon from "../assets/disconnect.png"

const UserComponent = ({deleteUser, userIdInRoom, localInRoom, localRoomId, onLeaveRoom, isCurrentUserInThisRoom}) => {

    const {user, rooms} = useContext(Context)
    const userId: string | undefined = user.getId()
    const roomId: string | undefined = user.getRoomId()


    const ForCurrentUser = userIdInRoom === userId;
    const isCurrentUserInAnyRoom = localInRoom;

    const currentRoom = rooms.getRoomById(roomId)

    const userNick = localStorage.getItem("nick")

    const handleClick = () => {
        user.setInRoom(false);
        localStorage.removeItem("inRoom");
        localStorage.removeItem("roomId");
        if (!userId || !roomId) {
            console.error("Room id or user id not found! (leave button)")
        }
        rooms.leaveRoom(userId, roomId)
        deleteUser(userId, roomId)

    }

    const showControls = ForCurrentUser && isCurrentUserInAnyRoom;

    return (
        <div>
            <div className="User-Container-Nick">
                {showControls  ? (
                    <>
                        {userNick}
                        <img src={microIcon} alt="" className={"micro-icon"}/>
                        <img src={disconnectIcon} alt="" className={"disconnect-icon"} onClick={handleClick}/>
                    </>
                ) :
                 null}
            </div>
        </div>
    );
};

export default UserComponent;