import {Client} from "@stomp/stompjs";

let stompClient: Client | null = null;

export function setStompClientUser(client: Client) {
    stompClient = client;
}

export async function registUser () {
    try {
        if (!stompClient) {
            console.log("WebSocket not ready")
            return;
        }
        stompClient.publish({
            destination: "/voice/create/user",
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({})
        })
    }
    catch (error) {
        console.error(error);
    }
}

export function checkUser(id: string, callback: (exists: boolean) => void) {
    try {
        if (!stompClient) {
            console.log("WebSocket not ready")
            return;
        }
        stompClient.publish({
            destination: "/voice/get/check/user",
            headers: { 'content-type': 'text/plain' },
            body: id
        })
    }
    catch (error) {
        console.error(error);
    }
}

