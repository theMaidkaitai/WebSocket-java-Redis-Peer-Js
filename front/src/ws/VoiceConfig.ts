import Peer from "peerjs";


let peer
async function createPeerConnection(id: string) {
    try {
        peer = new Peer(id, {
            host: 'localhost', // Или ваш PeerJS сервер
            port: 9000,
            path: '/voice-peer', // endpoint
            debug: 3,
            config: {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' },
                ]
            }
        });

        peer.on('open', (id) => {
            console.log("User peer id:", id)
        })

        peer.on("call", async (call) => {
            console.log("Звонок!!!!")
            const localStream = await getLocalAudioStream()
            call.answer(localStream)
        })


        //setupPeerEventHandlers();

        await getLocalAudioStream();

        return peer;

    } catch (error) {
        console.error('Error creating peer connection:', error);
        throw error;
    }
}





async function getLocalAudioStream () {
    const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
            echoCancellation: true, // echo
            noiseSuppression: false, // шум
            autoGainControl: false,
            channelCount: 1,
            sampleRate: 48000,
            sampleSize: 16,
        },
        video: false
    })
    return audioStream
}

