import { MongoDataSource } from 'apollo-datasource-mongodb';
import { ObjectId } from 'mongodb';
import { genSaltSync, hashSync } from "bcrypt-ts";
export default class Users extends MongoDataSource {
    constructor(options) {
        super(options);
        this.loggedInUser = options.loggedInUser; // if you wanna get context value to datasouces by super(options)
        this.tok = options.tok; // if you wanna get context value to datasouces
        this.MockurrentUserId = options.MockurrentUserId;
    }
    ;
    loginUser(user) {
        console.log(user);
    }
    getUsers() {
        console.log(this.loggedInUser, 'loggedInUser', this.tok, 'tok'); // output = { id: 'testid', username: 'ale', password: 'calabro', email: 'test' }
        return this.collection.find().toArray();
    }
    async getUser(userId) {
        // if (userId.toString() === this.MockurrentUserId) {
        //     console.log("user allowed");
        // } else {
        //     console.log("user not allowed");
        // } working
        // this.loggedInUser._id throw an error because the loggedInUser is of type
        const UserFind = await this.collection.findOne({ _id: new ObjectId(userId) });
        console.log(UserFind);
        return UserFind; //this.collection.findOne({ _id: new ObjectId(userId) });
    }
    addUser(username, password, email) {
        const salt = genSaltSync(10);
        const hash = hashSync(password, salt);
        password = hash;
        return this.collection.insertMany([{ username, password, email }]); //this.collection.insertMany([{ username, password, email }]);
    }
}
