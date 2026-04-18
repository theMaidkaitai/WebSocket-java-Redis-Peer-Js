import {Client} from "@stomp/stompjs";
import SockJS from 'sockjs-client';
import {registUser, setStompClientUser} from "./user/userWsApi.ts";
import RoomStore, {type RoomData, type UserData} from "../store/RoomStore.ts";
import {getUsersInRoom, setStompClientRooms} from "./rooms/roomsWsApi.ts";

const decoder = new TextDecoder('utf-8');
export default function initClient(roomsStore: RoomStore, onCreateUser: () => void):Client {

    const client = new Client({
        webSocketFactory: () => new SockJS(`https://${window.location.host}/voice-ws`),
        //webSocketFactory: () => new SockJS(`http://localhost:8080/voice-ws`),
        debug: function (str) {
            console.log(str);
        },
        reconnectDelay: 5000,

        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,

        onConnect: function () {

            setStompClientRooms(client);
            setStompClientUser(client);


            // users
            let registerSubscription = null;
            registerSubscription = client.subscribe("/topic/users/register", (message) => {
                try {
                    const text = decoder.decode(message.binaryBody);
                    const response = JSON.parse(text);

                    if (response && response.id) {
                        document.cookie = `id=${response.id}; path=/`;
                        document.cookie = `nick=${response.nick}; path=/`;

                        console.log("Cookie saved:", {
                            id: response.id,
                            nick: response.nick
                        });

                        if (registerSubscription) {
                            registerSubscription.unsubscribe();
                        }
                    } else {
                        console.log("Invalid response:", response);
                    }
                }
                catch (error) {
                    console.error("Ошибка при получении данных с топика: /topic/users/register", error);
                }
            });

            client.subscribe("/topic/users/get/check", (message) => {
                try {
                    const res = decoder.decode(message.binaryBody);
                    const response = JSON.parse(res);
                    console.log("CHECK USER", response);

                    if (response === true) {
                        if (registerSubscription) {
                            registerSubscription.unsubscribe();
                            console.log("User already exists, unsubscribed from /topic/users/register");
                        }
                    }
                    else {
                        registUser()
                    }
                }
                catch (error) {
                    console.error("Error in check user:", error);
                }
            });




            // rooms
            client.subscribe('/topic/rooms/get/created/data', (message) => {
                try {
                    let decodeDate = decoder.decode(message.binaryBody)
                    let date = JSON.parse(decodeDate);


                    if (date.body && Array.isArray(date.body)) {
                        roomsStore.setRooms(date.body);
                    }

                    else if (date.body && date.body.id && date.body.name) {
                        roomsStore.addRoom(date.body);
                    }

                    console.log(date);
                } catch (error) {
                    console.log(`Ошибки обработки прогрузки комнат: ${error}`);
                }
            });

            client.subscribe('/topic/rooms/get/all', (message) => {
                try {
                    const decodeDate = decoder.decode(message.binaryBody);
                    const date = JSON.parse(decodeDate);

                    console.log("Получены комнаты:", date);
                    if (Array.isArray(date)) {

                        const formattedRooms: RoomData[] = date.map(room => ({
                            id: room.id,
                            name: room.name,
                            maxPeople: room.maxPeople,
                            users: room.users || []
                        }));


                        roomsStore.setRooms(formattedRooms);

                        formattedRooms.forEach(room => {
                            if (room.id) {
                                getUsersInRoom(room.id);
                            }
                        });



                        console.log("Комнаты сохранены в store:", formattedRooms.length);
                    }


                } catch (error) {
                    console.error("Ошибка обработки комнат:", error);
                }
            });







            client.subscribe('/topic/rooms/get/one', (message) => {
                try {
                    const decodeDate = decoder.decode(message.binaryBody);
                    const date = JSON.parse(decodeDate);

                    console.log("Получена комната:", date);

                    const formattedRoom: RoomData = {
                        id: date.id,
                        name: date.name,
                        maxPeople: date.maxPeople,
                        users: date.users || []
                    };


                    roomsStore.addRoom(formattedRoom);
                    console.log("Комната сохранена в store:", formattedRoom);


                } catch (error) {
                    console.error("Ошибка обработки комнат:", error);
                }
            });





            client.subscribe('/topic/rooms/get/users/all', (message) => {
                try {
                    let decodeDate = decoder.decode(message.binaryBody)
                    let date = JSON.parse(decodeDate);


                    // console.log("=== DEBUG /topic/rooms/get/users/all ===");
                    // console.log("Type:", typeof date);
                    // console.log("Is array:", Array.isArray(date));
                    // console.log("Data:", date);
                    // console.log("Keys:", Object.keys(date));
                    // console.log("RoomId exists:", date?.roomId);
                    // console.log("Users exists:", date?.users);
                    // console.log("=====================================");


                    if (Array.isArray(date)) {
                        const roomId = date[0].roomId;
                        const formattedUsers: UserData[] = date.map(user => ({
                            id: user.id,
                            name: user.nick,
                            roomId: user.roomId || null
                        }));

                        console.log("Formated users", formattedUsers)

                        roomsStore.updateUsersInRoom(roomId, formattedUsers);
                    }

                    console.log("Юзеры в комнате(Not formated):", date);
                } catch (error) {
                    console.log(`Ошибки обработки прогрузки комнат: ${error}`);
                }
            });





            if (onCreateUser) {
                setTimeout(() => {
                    if (onCreateUser) {
                        onCreateUser();
                    }
                }, 1000);
            }
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