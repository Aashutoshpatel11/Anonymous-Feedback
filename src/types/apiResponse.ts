import {messageInterface} from '../models/user.models'

export interface apiResponse{
    status: boolean,
    message: string,
    isAcceptingMessages?: boolean,
    messages?: Array<messageInterface>
}