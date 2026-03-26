import { v4 as uuidv4 } from 'uuid';




export class GenerateIdService {
    static generateUserId(): string {
        return uuidv4();
    }

    static generateSessionId(): string {
        return uuidv4();
    }

    static generateRoomId(): string {
        return uuidv4();
    }
}