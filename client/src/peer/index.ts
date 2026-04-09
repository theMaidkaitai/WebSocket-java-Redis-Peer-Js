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
            window.localAudio.srcObject = stream;
            window.localAudio.autoplay = true;
            return stream;
        } catch (error) {
            console.error('Microphone access denied:', error);
            return null;
        }
    }

    const mediaStream = await getMicro()



    peer.on("open", function () {
        conn.on("data", function (data) {
            console.log("Received open", data);
        });


        conn.send("Hello!");
    });

     peer.on("error", err => {
         console.log("Ошибка Peer error:", err);
     })


    peer.on("connection", connect => {
        console.log("Peer connect:", connect);
    })


    var conn = peer.connect("dest-peer-id");
    peer.on("open", function () {
        conn.on("data", function (data) {
            console.log("Received", data);
        });

        conn.send("Hello!");
    });


    peer.on("call", (call) => {
        if (mediaStream) {
            call.answer(mediaStream);
            call.on("stream", (remoteStream) => {
                console.log("Received remote stream (CALL)");
                const remoteAudio = new Audio();
                remoteAudio.srcObject = remoteStream;
                remoteAudio.autoplay = true;
            });
        }
    });

    // if (mediaStream) {
    //     const call = peer.call("dest-peer-id", mediaStream);
    //     call.on("stream", (remoteStream) => {
    //         console.log("Call answered, remote stream received (ANSWER TO CALL)");
    //         const remoteAudio = new Audio();
    //         remoteAudio.srcObject = remoteStream;
    //         remoteAudio.autoplay = true;
    //     });
    // }



    return { peer, mediaStream };
}


