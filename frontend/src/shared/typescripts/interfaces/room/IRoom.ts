import {IUser} from "@/shared/typescripts/interfaces/user/IUser.ts";

export interface IRoom {
    createdAt: string
    createdBy: string
    roomId: string
    roomName: string
    updatedAt: string
    Users: IUser[]
}