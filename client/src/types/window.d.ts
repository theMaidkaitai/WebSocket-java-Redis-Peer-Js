export {};

declare global {
    interface Window {
        localStream: MediaStream;
        localAudio: HTMLAudioElement;
        remoteAudios: Map<string, HTMLAudioElement>;
        stompClient: any;
        activeCalls: Map<string, any>;
    }
}