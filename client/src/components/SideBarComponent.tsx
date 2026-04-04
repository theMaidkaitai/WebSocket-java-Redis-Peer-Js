import React, {useContext, useState} from 'react';
import "../styles/SideBarComponentStyles/sideBarStyle.css"
import InputComponent from "./InputComponent.tsx";
import microEnabled from "../assets/microEnabled.png"
import microDisabled from "../assets/microDisabled.png"
import {Context} from "../main.tsx";
import ChannelComponent from "./ChannelComponent.tsx";
import type {RoomData} from "../store/RoomStore.ts";
import addIcon from "../assets/add.png"
import CreateRoomModal from "./modals/CreateRoomModal.tsx";
import { observer } from 'mobx-react-lite';


const SideBarComponent = observer(() => {
    const {rooms} = useContext(Context);
    const [modalVisibility, setModalVisibility] = useState(false);
    const [name, setName] = useState("");

    const handleCreateRoom = (roomName: string) => {
        console.log('Создана комната:', roomName);
    };

    const testSubmit = () => {
           localStorage.setItem("name", name);
           console.log(name)
    }



    return (
        <div className="sidebar">
            <div className="users-list">
                {rooms.rooms.map((rooms: RoomData) => (
                    <ChannelComponent
                        key={rooms.id}
                        id={rooms.id}
                        title={rooms.name}
                        users={rooms.users}
                    />
                ))}
                <img src={addIcon} alt="" className={"add-icon"} onClick={() => setModalVisibility(true)} />

            </div>
            <CreateRoomModal
                isOpen={modalVisibility}
                onClose={() => setModalVisibility(false)}
                onCreate={handleCreateRoom}
            />

            <InputComponent
                value={name}
                onChange={setName}
                onSubmit={testSubmit}
            />
            {/*<img src={microEnabled} alt="" className={"micro-icon"}/>*/}
        </div>
    );
});

export default SideBarComponent;