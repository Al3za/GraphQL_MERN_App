import { MongoDataSource, MongoDataSourceConfig } from 'apollo-datasource-mongodb';
import { ObjectId } from 'mongodb';
import { UserDocument } from '../types';


export default class Users extends MongoDataSource<UserDocument> {

    protected loggedInUser: UserDocument;
    protected tok: String;
    protected MockurrentUserId: String | null

    constructor(options: { MockurrentUserId: String | null, tok: String, loggedInUser: UserDocument } & MongoDataSourceConfig<UserDocument>) {
        super(options)
        this.loggedInUser = options.loggedInUser// if you wanna get context value to datasouces by super(options)
        this.tok = options.tok;// if you wanna get context value to datasouces
        this.MockurrentUserId = options.MockurrentUserId;
    }

    getUsers() {
        console.log(this.loggedInUser, 'loggedInUser', this.tok, 'tok') // output = { id: 'testid', username: 'ale', password: 'calabro', email: 'test' }
        return this.collection.find().toArray();
    }

    async getUser(userId: ObjectId) {

        // if (userId.toString() === this.MockurrentUserId) {
        //     console.log("user allowed");
        // } else {
        //     console.log("user not allowed");
        // } working
        // this.loggedInUser._id throw an error because the loggedInUser is of type
        const UserFind = await this.collection.findOne({ _id: new ObjectId(userId) });
        console.log(UserFind)
        return UserFind //this.collection.findOne({ _id: new ObjectId(userId) });
    }

    addUser(username: string, password: string, email: string) {
        return this.collection.insertMany([{ username, password, email }]); //this.collection.insertMany([{ username, password, email }]);
    }
}