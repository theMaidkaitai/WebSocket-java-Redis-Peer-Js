export {};

declare global {
    interface Window {
        localStream: MediaStream;
        localAudio: HTMLAudioElement;
        stompClient: any;
    }
}