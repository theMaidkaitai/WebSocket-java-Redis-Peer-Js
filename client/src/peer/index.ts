import Peer from "peerjs";

export const peerInstanse = async () => {
     const peer = new Peer({
        host: import.meta.env.VITE_PEER_HOST || "1488-pozvony.ru",
        port: import.meta.env.VITE_PEER_PORT || 443,
        path: '/peerjs',
        key: 'peerjs-secret-key',
        config: {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' }
            ]
        },
        secure: true,
        debug: 3
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

    const mediaStream = await getMicro()



    peer.on("open", () => {
        console.log("Peer connected, ID:", peer.id);
    });

     peer.on("error", err => {
         console.log("Ошибка Peer error:", err);
     })


    peer.on("connection", connect => {
        console.log("Peer connect:", connect);
    })




    peer.call("dest-peer-id", mediaStream);

    peer.on("call", (call) => {
        console.log("Incoming call from:", call.peer);

        if (mediaStream) {
            call.answer(mediaStream);

            call.on("stream", (remoteStream) => {
                console.log("Received remote stream");
                const remoteAudio = new Audio();
                remoteAudio.srcObject = remoteStream;
                remoteAudio.play();
            });
        }
    });


    return { peer, mediaStream };
}


