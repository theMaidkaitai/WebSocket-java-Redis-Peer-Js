import Peer from "peerjs";

export const peerInstanse = async (id: string) => {

     const peer = new Peer(id ,{
        host: import.meta.env.VITE_PEER_HOST || "1488-pozvony.ru",
        port: import.meta.env.VITE_PEER_PORT || 443,
        path: '/peerjs',
        key: '1488pozvony',
        config: {
            iceServers: [
                { urls: 'stun:stun.1und1.de:3478' },
                { urls: 'stun:stun.bluesip.net:3478' },
                {
                    urls: 'turn:turn.anyfirewall.com:443?transport=tcp',
                    username: 'webrtc',
                    credential: 'webrtc'
                }

            ],

        },
        secure: true,
        debug: 1
    });


    async function getMicro() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
            window.localStream = stream;

            // window.localAudio = new Audio();
            // window.localAudio.srcObject = stream;
            // window.localAudio.autoplay = true; hear myself


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




    //peer.call(id, mediaStream);

    peer.on("call", async (call) => {
        console.log("ВХОДЯЩИЙ ЗВОНОК ОТ:", call.peer);
        if (mediaStream) {
            call.answer(mediaStream);
            call.on("stream", (remoteStream) => {
                console.log("ПОЛУЧЕН УДАЛЁННЫЙ СТРИМ ОТ:", call.peer);
                const remoteAudio = new Audio();
                remoteAudio.srcObject = remoteStream;
                remoteAudio.play();
            });
        }
    });


    return { peer, mediaStream };
}


