import {makeAutoObservable} from "mobx";
import { GenerateIdService} from "../src/ws/GenerateIdService.ts";


export default class UserStore {
    constructor() {
        makeAutoObservable(this)
        this.loadStorage();
        this.ensureUserId();
    }

    public ensureUserId(): void {
        let id = localStorage.getItem("id")
        if (!id || id.trim() === "") {
            id = GenerateIdService.generateUserId();
            localStorage.setItem("id", id);
        }
    }

    private parseBoolean(value: string | null): boolean {
        if (value === null) return false;
        return value === "true" || value === "1" || value === "yes";
    }


    getId() {
        let id = localStorage.getItem("id")
        return id;
    }

    setId(id: string) {
        localStorage.setItem("id", id);
    }

    setNick(nick: string) {
        localStorage.setItem("nick", nick);
    }

    getNick() {
        const nickUser = localStorage.getItem('nick')
        return nickUser;
    }

    getRoomId() {
        const roomId = localStorage.getItem("roomId")
        return roomId;
    }

    setRoomId(roomId: string) {
        localStorage.setItem("roomId", roomId);
    }

    getInRoom(): boolean {
        return this.parseBoolean(localStorage.getItem("inRoom"));
    }

    setInRoom(inRoom: boolean) {
        localStorage.setItem("inRoom", String(inRoom))
    }

    public loadStorage(): void {
        const savedId = localStorage.getItem("id");
        const savedNick = localStorage.getItem("nick");
        const savedInRoom = localStorage.getItem("inRoom");
        const savedRoomId = localStorage.getItem("roomId");
    }
}