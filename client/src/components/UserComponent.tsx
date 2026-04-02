import React, {useContext} from 'react';
import "../styles/UserComponentStyles/UserStyles.css"
import {Context} from "../main.tsx";
import { observer } from 'mobx-react-lite';
import {getCookie} from "../ws/getCookie.ts";

interface UserComponentProps {
    userId: number | string;
    name: string;
    status?: 'online' | 'offline' | 'idle';
}

const UserComponent = observer(({ userId, name, status = 'online' }: UserComponentProps) => {
    const { rooms } = useContext(Context);



    const avatarLetter = name.charAt(0).toUpperCase();

    return (
        <div className="user-component">
            <div className={`user-status ${status}`}></div>
            <div className="user-avatar">
                {avatarLetter}
            </div>
            <div className="user-name">
                {name}
            </div>
        </div>
    );
});

export default UserComponent;