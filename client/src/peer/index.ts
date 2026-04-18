import Peer from "peerjs";

export const peerInstanse = async (id: string) => {

     const peer = new Peer(id ,{
        host: import.meta.env.VITE_PEER_HOST || "1488-pozvony.ru",
        port: import.meta.env.VITE_PEER_PORT || 443,
        path: '/peerjs',
        key: '1488pozvony',
        config: {
            iceServers: [
                { urls: 'stun:stun.1und1.de:3478' }
            ],

        },
        secure: true,
        debug: 0
    });


    async function getMicro() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
            window.localStream = stream;

            // window.localAudio = new Audio();
            // window.localAudio.srcObject = stream;
            // window.localAudio.autoplay = true;                hear myself


            return stream;

        } catch (error) {
            console.error('Microphone access denied:', error);
            return null;
        }
    }

    const mediaStream: MediaStream = await getMicro()



    peer.on("connection", (conn) => {
        console.log("Peer connect:", conn.peer); // здесь conn.peer — это string

        conn.on("close", () => {
            console.log("Connection closed with:", conn.peer);
            const audioElements = document.querySelectorAll(`audio[data-peer-id="${conn.peer}"]`);
            audioElements.forEach(audio => {
                // @ts-ignore
                audio.pause();
                // @ts-ignore
                audio.srcObject = null;
                audio.remove();
            });
        });
    });


     peer.on("error", err => {
         console.log("Ошибка Peer error:", err);
     })


    peer.on("connection", connect => {
        console.log("Peer connect:", connect);

    })


    // @ts-ignore
    peer.on("close", (peerId) => {
        console.log("Peer closed:", peerId);
        const audioElements = document.querySelectorAll(`audio[data-peer-id="${peerId}"]`);
        audioElements.forEach(audio => {
            // @ts-ignore
            audio.pause();
            // @ts-ignore
            audio.srcObject = null;
            audio.remove();
        });
    });


    peer.on("call", async (call) => {
        console.log("ВХОДЯЩИЙ ЗВОНОК ОТ:", call.peer);
        if (mediaStream) {
            call.answer(mediaStream);
            call.on("stream", (remoteStream) => {
                console.log("ПОЛУЧЕН УДАЛЁННЫЙ СТРИМ ОТ:", call.peer);
                const remoteAudio = new Audio();
                remoteAudio.setAttribute("data-peer-id", call.peer);
                remoteAudio.srcObject = remoteStream;
                remoteAudio.play();

                if (!window.remoteAudios) window.remoteAudios = new Map();
                window.remoteAudios.set(call.peer, remoteAudio);
            });

            call.on("close", () => {
                console.log("Звонок закрыт с:", call.peer);
                const audio = window.remoteAudios?.get(call.peer);
                if (audio) {
                    audio.pause();
                    audio.srcObject = null;
                    audio.remove();
                    window.remoteAudios.delete(call.peer);
                }
            });
        }
    });


    return { peer, mediaStream };
}


