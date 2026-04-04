import React, {useContext, useEffect, useState} from 'react';
import "../../styles/CreateRoomModalStyles/CreateModalStyle.css"
import {createRoom} from "../../ws/rooms/roomsWsApi.ts";
import type {RoomData} from "../../store/RoomStore.ts";
import {Context} from "../../main.tsx";

interface CreateRoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (roomName: string) => void;
}


const CreateRoomModal = ({ isOpen, onClose }: CreateRoomModalProps) => {
    const [roomName, setRoomName] = useState('');
    const [error, setError] = useState('');


    const {rooms} = useContext(Context)



    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!roomName.trim()) {
            setError('Название комнаты обязательно');
            return;
        }

        if (roomName.length > 20) {
            setError('Название не может быть длиннее 50 символов');
            return;
        }

        await createRoom(roomName);

        //await getRoom(roomName);

        setRoomName('');
        setError('');
        onClose();


    };

    const handleClose = () => {
        setRoomName('');
        setError('');
        onClose();
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            handleClose();
        }
    };


    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Создать комнату</h2>
                    <button className="modal-close" onClick={handleClose}>×</button>
                </div>
                <div className="modal-content">
                    <div className="modal-field">
                        <label>НАЗВАНИЕ КОМНАТЫ</label>
                        <input
                            type="text"
                            placeholder="Введите название"
                            value={roomName}
                            onChange={(e) => {
                                setRoomName(e.target.value);
                                setError('');
                            }}
                            onKeyDown={handleKeyPress}
                            className={error ? 'input-error' : ''}
                            autoFocus
                        />
                        {error && <div className="modal-error">{error}</div>}
                    </div>
                    <div className="modal-actions">
                        <button className="modal-cancel" onClick={handleClose}>
                            Отмена
                        </button>
                        <button
                            className="modal-create"
                            onClick={handleSubmit}
                            disabled={!roomName.trim()}
                        >
                            Создать
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateRoomModal;