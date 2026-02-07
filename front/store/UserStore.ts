import {makeAutoObservable} from "mobx";
import { GenerateIdService} from "../src/ws/GenerateIdService.ts";


export default class UserStore {
    _id: string | undefined;
    _nick: string | undefined = undefined;
    _inRoom: boolean = false;
    _roomId: string | undefined;

    constructor() {
        makeAutoObservable(this)
        this.loadStorage();
        this.ensureUserId();
    }

    public ensureUserId(): void {
        if (!this._id || this._id.trim() === "") {
            this._id = GenerateIdService.generateUserId();
            localStorage.setItem("id", this._id);
        }
    }


    getId() {
        return this._id;
    }

    setId(id: string) {
        this._id = id;
        localStorage.setItem("id", id);
    }

    setNick(nick: string) {
        this._nick = nick;
        localStorage.setItem("nick", nick);
    }

    getNick() {
        return this._nick;
    }

    getRoomId() {
        return this._roomId;
    }

    setRoomId(roomId: string) {
        this._roomId = roomId;
        localStorage.setItem("roomId", roomId);
        if (roomId === this._id) {
            console.error("ОШИБКА: В setRoomId передается ID пользователя вместо ID комнаты!");
        }
    }

    getInRoom(): boolean {
        return this._inRoom;
    }

    setInRoom(inRoom: boolean) {
        localStorage.setItem("inRoom", String(inRoom))
        this._inRoom = inRoom;
    }

    private loadStorage(): void {
        const savedId = localStorage.getItem("id");
        if (savedId) {
            this._id = savedId;
        }

        const savedNick = localStorage.getItem("nick");
        if (savedNick) {
            this._nick = savedNick;
            console.log("Ник загружен из localStorage:", savedNick);
        }

        const savedInRoom = localStorage.getItem("inRoom");
        if (savedInRoom) {
            this._inRoom = savedInRoom === "true";
        }

        const savedRoomId = localStorage.getItem("roomId");
        if (savedRoomId) {
            this._roomId = savedRoomId;
        }

    }
}