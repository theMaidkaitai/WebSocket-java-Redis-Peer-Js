import {useContext} from "react";
import {Context} from "../main.tsx";
import "./styles/UserContainerStyles/UserComponent.css"
import microIcon from "../assets/micro-icon.png"
import disconnectIcon from "../assets/disconnect.png"

const UserComponent = ({deleteUser}) => {

    const {user, rooms} = useContext(Context)
    const userId: string | undefined = user.getId()
    const roomId: string | undefined = user.getRoomId()

    const currentRoom = rooms.getRoomById(roomId)

    const handleClick = () => {
        user._inRoom = false;
        localStorage.removeItem("inRoom");
        localStorage.removeItem("roomId");
        if (!userId || !roomId) {
            console.error("Room id or user id not found! (leave button)")
        }
        rooms.leaveRoom(userId, roomId)
        deleteUser(userId, roomId)

    }



    return (
        <div>
            <div className="User-Container-Nick">
                {user._inRoom && user._id === userIdInRoom  ? (
                    <>
                        {user._nick}
                        <img src={microIcon} alt="" className={"micro-icon"}/>
                        <img src={disconnectIcon} alt="" className={"disconnect-icon"} onClick={handleClick}/>
                    </>
                ) 
                : 
                null
                
                }
            </div>
        </div>
    );
};

export default UserComponent;