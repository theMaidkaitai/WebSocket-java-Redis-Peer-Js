import Peer from "peerjs";

export const peerInstanse = async (id: string) => {

     const peer = new Peer(id ,{
        host: import.meta.env.VITE_PEER_HOST || "1488-pozvony.ru",
        port: import.meta.env.VITE_PEER_PORT || 443,
        path: '/peerjs',
        key: '1488pozvony',
        config: {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun.1und1.de:3478' },
                { urls: 'stun:stun.bluesip.net:3478' },
                { urls: 'stun:stun.eyeball.com:3478' }
            ]
        },
        secure: true,
        debug: 1
    });


    async function getMicro() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
            window.localStream = stream;

            window.localAudio = new Audio();
            window.localAudio.srcObject = stream;
            window.localAudio.autoplay = true;
            return stream;

        } catch (error) {
            console.error('Microphone access denied:', error);
            return null;
        }
    }

    const mediaStream: MediaStream = await getMicro()



    peer.on("open", () => {
        console.log("Peer connected, ID:", peer.id);
    });

     peer.on("error", err => {
         console.log("Ошибка Peer error:", err);
     })


    peer.on("connection", connect => {
        console.log("Peer connect:", connect);
    })




    peer.call(id, mediaStream);

    peer.on("call", async (call) => {
        console.log("Incoming call from:", call.peer);
        console.log("call myself")
        if (mediaStream) {
            await new Promise(resolve => setTimeout(resolve, 100));
            call.answer(mediaStream);
            call.on("stream", (remoteStream) => {
                console.log("Received remote stream");
                const remoteAudio = new Audio();
                remoteAudio.srcObject = remoteStream;
                remoteAudio.play();
            });
        }

        call.on("error", (err) => {
            console.error("CALL ERROR:", err);
        });

    });


    return { peer, mediaStream };
}


