import {Client} from "@stomp/stompjs";
import SockJS from 'sockjs-client';
import type RoomsStore from "../../store/RoomsStore.ts";
import {useContext} from "react";
import {Context} from "../main.tsx";

const decoder = new TextDecoder('utf-8');
export default function initClient(roomsStore: RoomsStore, onCreateUser: () => void):Client {

    const client = new Client({
        webSocketFactory: () => new SockJS(`http://${window.location.host}/voice-ws`),
        debug: function (str) {
            console.log(str);
        },
        reconnectDelay: 5000,

        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,

        onConnect: function () {
            if (onCreateUser) {
                setTimeout(() => {
                    if (onCreateUser) {
                        onCreateUser();
                    }
                }, 1000);
            }

            client.subscribe("/topic/room/users/all", (message) => {
                try {
                    let data;
                    const text = decoder.decode(message.binaryBody)
                    data = JSON.parse(text);

                    if (data && data.data && Array.isArray(data.data)) {
                        data.data.forEach(roomData => {
                            console.log(`Комната: ${roomData.name}, пользователей: ${roomData.users?.length || 0}`);

                            const room = roomsStore.getRoomById(roomData.roomId);
                            if (room) {
                                room.users = roomData.users?.map(user => user.id) || [];
                                console.log(`Обновлены пользователи комнаты ${roomData.roomName}:`, room.users);
                            }
                        });
                    }

                    data.data.forEach(roomData => {
                        console.log("Room data:", roomData.name);
                        roomData.users.forEach(user => {
                            console.log("user", user.id);
                        })
                    })
                }
                catch (error) {
                    console.log(error);
                }
            });

            client.subscribe('/topic/rooms', (message) => {
                try {
                    let decodeDate = decoder.decode(message.binaryBody)
                    let date = JSON.parse(decodeDate);

                    if (date.body && Array.isArray(date.body)) {
                        roomsStore.setRooms(date.body);
                    } else if (date.body && date.body.id && date.body.name) {
                        roomsStore.addRoom(date.body);
                    }

                    console.log(date.body);
                } catch (error) {
                    console.log(`Ошибки обработки прогрузки комнат: ${error}`);
                }
            });

            client.subscribe('/topic/public', (message) => {
                try {
                    let data;
                    if (message.isBinaryBody) {
                        const binaryBody = message.binaryBody;
                        const text = decoder.decode(binaryBody);
                        data = JSON.parse(text);
                    } else {
                        data = JSON.parse(message.body);
                    }

                    console.log('📨 Получены комнаты:', data);

                    if (Array.isArray(data)) {
                        roomsStore.setRooms(data);
                    }
                    else if (data.rooms && Array.isArray(data.rooms)) {
                        roomsStore.setRooms(data.rooms);
                    }
                    else if (data.body && Array.isArray(data.body)) {
                        roomsStore.setRooms(data.body);
                    }
                }
                catch (error) {
                    console.error('Ошибка обработки комнат:', error);
                    console.log('Raw message:', message);
                }
            });

            client.subscribe('/topic/room/updates', (message) => {
                const updatedRooms = JSON.parse(message.body);
                roomsStore.setRooms(updatedRooms);
                console.log("Обновление комнаты:", message.body);
            });

            client.publish({
                destination: "/voice/get/rooms",
                headers: { 'content-type': 'application/json' } // get rooms
            });
        },

        onWebSocketClose: function () {
            console.log("WebSocket closed!");
        },

        onDisconnect: () => {
            console.log('User + Stomp отключены!');
        },
    });

    if (typeof WebSocket !== 'function') {
        client.webSocketFactory = function () {
            return new SockJS('http://localhost:8080/voice-ws');
        };
    }

    client.reconnectDelay = 5000;

    client.onStompError = function (frame) {
        console.log('Broker reported error: ' + frame.headers['message']);
        console.log('Additional details: ' + frame.body);
    };

    client.onDisconnect = function () {
        console.log("WebSocket disconnected");
    };

    client.activate();

    return client;
}