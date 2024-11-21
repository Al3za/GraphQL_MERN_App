import { ObjectId } from 'mongodb';

export interface UserDocument {
    id?: ObjectId
    mockId?: String,
    roles?: string[],
    username: string
    password: string
    email: string
}

export interface Context {
    loggedInUser: UserDocument
}