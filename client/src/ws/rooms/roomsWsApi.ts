import {Client} from "@stomp/stompjs";

let stompClient: Client | null = null;

export function setStompClientRooms(client: Client) {
    stompClient = client;
}

export async function createRoom (roomName: string) {
    try {
        if (!stompClient) {
            console.log("WebSocket not ready")
            return;
        }
        stompClient.publish({
            destination: "/voice/rooms/actions/create",
            headers: { 'content-type': 'text/plain'  },
            body: roomName
        })
    }
    catch (error) {
        console.error(error);
    }
}


export async function getRooms () {
    try {
        if (!stompClient) {
            console.log("WebSocket not ready")
            return;
        }



        stompClient.publish({
            destination: "/voice/rooms/get/all",
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({})
        })
    }
    catch (error) {
        console.error(error);
    }
}

export async function connectToRoom (userId: string, roomId: string) {
    try {
        if (!stompClient) {
            console.log("WebSocket not ready")
            return;
        }

        const data = {
            userId: userId,
            roomId: roomId,
        }


        stompClient.publish({
            destination: "/voice/rooms/user/action/connect",
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ userId, roomId })
        })
    }
    catch (error) {
        console.error(error);
    }
}


export async function getUsersInRoom (roomId: string) {
    try {
        if (!stompClient) {
            console.log("WebSocket not ready")
            return;
        }

        stompClient.publish({
            destination: "/voice/rooms/get/users/all",
            headers: { 'content-type': 'text/plain'  },
            body: roomId
        })
    }
    catch (error) {
        console.error(error);
    }
}


// export function checkUser(id: string, callback: (exists: boolean) => void) {
//     try {
//         if (!stompClient) {
//             console.log("WebSocket not ready")
//             return;
//         }
//         stompClient.publish({
//             destination: "/voice/get/check/user",
//             headers: { 'content-type': 'text/plain' },
//             body: id
//         })
//     }
//     catch (error) {
//         console.error(error);
//     }
// }