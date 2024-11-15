import { ObjectId } from 'mongodb';

export interface UserDocument {
    id?: ObjectId
    mockId?: String,
    username: string
    password: string
    email: string
}

export interface Context {
    loggedInUser: UserDocument
}