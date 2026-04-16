import { makeAutoObservable } from "mobx";

export interface UserData {
    id: string;
    name: string;
    roomId: string
}

export interface RoomData {
    id?:  string;
    name?: string;
    maxPeople?: 3;
    users?: UserData[];

}

export default class RoomStore {
    private _rooms: RoomData[];

    constructor() {
        this._rooms = [];
        makeAutoObservable(this);
    }

    get rooms() {
        return this._rooms;
    }

    // set users (users: UserData[]) {
    //     this._users = users;
    // }
    //
    // setUsers (users: UserData[]) {
    //     console.log("setUsers called with:", users);
    //     this._users = users;
    // }
    //
    // getUsers () {
    //     return this._users;
    // }

    setRooms(rooms: RoomData[]) {
        this._rooms = rooms;
    }

    addRoom(room: RoomData) {
        const exists = this._rooms.some(r => r.id === room.id);
        if (!exists) {
            this._rooms = [...this._rooms, room];
        }
    }



    updateUsersInRoom(roomId: string, users: UserData[]) {
        this._rooms = this._rooms.map(room =>
            room.id === roomId
                ? { ...room, users: users }
                : room
        );
    }

    deleteFromRoom(userId: string,roomId: string) {
        this._rooms = this._rooms.map(room => {
            if (room.id === roomId) {
                const otherUsers = room.users?.filter(user => user.id !== userId);
                return {...room, users: otherUsers};
            }
        })
    }

    getUsers() {
        const allUsers: UserData[] = [];
        this._rooms.forEach(room => {
            if (room.users) {
                allUsers.push(...room.users);
            }
        });
        return allUsers;
    }

    addUserToRoom(roomId: string, user: UserData) {
        this._rooms = this._rooms.map(room => {
            if (room.id === roomId) {
                const exists = room.users?.some(u => u.id === user.id);
                if (!exists) {
                    return { ...room, users: [...(room.users || []), user] };
                }
            }
            return room;
        });
    }

    isUserInRoom(roomId: string, userId: string): boolean {
        const room = this._rooms.find(r => r.id === roomId);
        return room?.users?.some(user => user.id === userId) || false;
    }

}