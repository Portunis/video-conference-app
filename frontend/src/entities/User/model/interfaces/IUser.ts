export interface IUser {
    name: string,
    surname: string,
    age: number,
}

export enum EUserStatus {
    ONLINE = 'online',
    OFFLINE = 'offline'
}

export type TUser = {
    userId: string;
    isAudioEnabled: boolean;
    isVideoEnabled: boolean;
    status: EUserStatus
    user: {
        username: string;
    }
}