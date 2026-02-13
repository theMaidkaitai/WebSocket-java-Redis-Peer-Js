import {makeAutoObservable, toJS} from "mobx";



export interface Room {
    id?: string;
    name: string;
    max_people: number;
    users?: string[];
}


export default class RoomsStore {
    _rooms: Room[] = [];

    constructor() {
        makeAutoObservable(this)
    }


    // loadStorage() {
    //     const savedRooms = localStorage.getItem('rooms');
    //     if (savedRooms) {
    //         try {
    //             this._rooms = JSON.parse(savedRooms);
    //         } catch (e) {
    //             this._rooms = [];
    //         }
    //     }
    // }
    //
    // saveToStorage() {
    //     try {
    //         localStorage.setItem('rooms', JSON.stringify(this._rooms));
    //     } catch (e) {
    //         console.error('Ошибка при сохранении комнат:', e);
    //     }
    // }

    setRooms(rooms: any[]): void {
        this._rooms = Array.isArray(rooms) ? [...rooms] : [];
    }

    addRoom(room: Room) {
        this._rooms.push(room);
    }

    getRoomById(id: string): Room | undefined {
        return this._rooms.find(room => room.id === id);
    }


    getRooms(): any[] {
        return toJS(this._rooms);
    }

    join(userId: string | undefined, roomId: string) {
        const roomIndex = this._rooms.findIndex(room => room.id === roomId);
        if (roomIndex === -1) {
            console.error(`Комната ${roomId} не найдена`);
            return false;
        }
        const room = this._rooms[roomIndex];

        // @ts-ignore
        if (room.users?.length >= room.max_people) {
            alert("Комната заполнена!")
        }
        if (!room.users) {
            room.users = [];
        }

        if (room.users.includes(<string>userId)) {
            return;
        }

        room.users.push(<string> userId);
        this._rooms[roomIndex] = { ...room };
    }

    getRoomUsers (roomId:string) {
        const room = this._rooms.find(room => room.id === roomId);
        return room?.users || [] // после чего итерируемся по этому массиву и делаем запрос по этим юзерам и погружаем
    }


    leaveRoom(userId: string | undefined, roomId: string | undefined) {
        const roomIndex: number = this._rooms.findIndex(room => room.id === roomId);
        if (roomIndex === -1) {
            console.error(`Комната ${roomId} не найдена`);
            return false;
        }
        const room = this._rooms[roomIndex];

        const userIndex = room.users?.indexOf(userId);
        if (userIndex === -1) {
            console.log(`Пользователь ${userId} не найден в комнате ${room.name}`);
            return true;
        }

        // @ts-ignore
        room.users?.splice(userIndex, 1);

        this._rooms[roomIndex] = { ...room };
    }

    isUserInRoom(roomId: string, userId: string): boolean {
        const room = this.getRoomById(roomId);
        return room?.users?.includes(userId) || false;
    }

    getUserRoom(userId: string): Room[] {
        return this._rooms.filter(room =>
            room.users?.includes(userId)
        );
    }



}
