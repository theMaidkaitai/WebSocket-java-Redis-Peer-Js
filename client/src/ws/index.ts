// import {Client} from "@stomp/stompjs";
// import SockJS from 'sockjs-client';
// import type RoomsStore from "../../store/RoomsStore.ts";
//
// const decoder = new TextDecoder('utf-8');
// export default function initClient(roomsStore: RoomsStore, onCreateUser: () => void):Client {
//
//     const client = new Client({
//         webSocketFactory: () => new SockJS(`http://${window.location.host}/voice-ws`),
//         debug: function (str) {
//             console.log(str);
//         },
//         reconnectDelay: 5000,
//
//         heartbeatIncoming: 4000,
//         heartbeatOutgoing: 4000,
//
//         onConnect: function () {
//             if (onCreateUser) {
//                 setTimeout(() => {
//                     if (onCreateUser) {
//                         onCreateUser();
//                     }
//                 }, 1000);
//             }
//
//             client.subscribe("/topic/room/users/all", (message) => {
//                 try {
//                     const text = decoder.decode(message.binaryBody);
//                     const response = JSON.parse(text);
//
//                     console.log("📥 Получен ответ от сервера:", response);
//
//                     if (response.roomId && response.users) {
//                         const { roomId, users } = response;
//                         roomsStore.setUsers(roomId, users);
//                         console.log(`✅ Обновлены пользователи комнаты ${roomId}:`, users);
//                     }
//
//                     response.forEach(roomData => {
//                         roomsStore.setUsers(roomData.roomId, roomData.users);
//                     });
//                     console.log ("ЮЗЕРЫ В КОМНАТАХ", roomsStore.getRoomUsers("411520ec-691b-4463-adae-7828d6954d09\n"));
//                 } catch (error) {
//                     console.error("❌ Ошибка обработки сообщения:", error);
//                 }
//             });
//
//             client.subscribe('/topic/rooms', (message) => {
//                 try {
//                     let decodeDate = decoder.decode(message.binaryBody)
//                     let date = JSON.parse(decodeDate);
//
//                     if (date.body && Array.isArray(date.body)) {
//                         roomsStore.setRooms(date.body);
//                     } else if (date.body && date.body.id && date.body.name) {
//                         roomsStore.addRoom(date.body);
//                     }
//
//                     console.log(date.body);
//                 } catch (error) {
//                     console.log(`Ошибки обработки прогрузки комнат: ${error}`);
//                 }
//             });
//
//             client.subscribe('/topic/public', (message) => {
//                 try {
//                     let data;
//                     if (message.isBinaryBody) {
//                         const binaryBody = message.binaryBody;
//                         const text = decoder.decode(binaryBody);
//                         data = JSON.parse(text);
//                     } else {
//                         data = JSON.parse(message.body);
//                     }
//
//                     console.log('📨 Получены комнаты:', data);
//
//                     if (Array.isArray(data)) {
//                         roomsStore.setRooms(data);
//                     }
//                     else if (data.rooms && Array.isArray(data.rooms)) {
//                         roomsStore.setRooms(data.rooms);
//                     }
//                     else if (data.body && Array.isArray(data.body)) {
//                         roomsStore.setRooms(data.body);
//                     }
//                 }
//                 catch (error) {
//                     console.error('Ошибка обработки комнат:', error);
//                     console.log('Raw message:', message);
//                 }
//             });
//
//             client.subscribe('/topic/room/updates', (message) => {
//                 const updatedRooms = JSON.parse(message.body);
//                 roomsStore.setRooms(updatedRooms);
//                 console.log("Обновление комнаты:", message.body);
//             });
//
//             client.publish({
//                 destination: "/voice/get/rooms",
//                 headers: { 'content-type': 'application/json' } // get rooms
//             });
//         },
//
//         onWebSocketClose: function () {
//             console.log("WebSocket closed!");
//         },
//
//         onDisconnect: () => {
//             console.log('User + Stomp отключены!');
//         },
//     });
//
//     if (typeof WebSocket !== 'function') {
//         client.webSocketFactory = function () {
//             return new SockJS('http://localhost:8080/voice-ws');
//         };
//     }
//
//     client.reconnectDelay = 5000;
//
//     client.onStompError = function (frame) {
//         console.log('Broker reported error: ' + frame.headers['message']);
//         console.log('Additional details: ' + frame.body);
//     };
//
//     client.onDisconnect = function () {
//         console.log("WebSocket disconnected");
//     };
//
//     client.activate();
//
//     return client;
// }