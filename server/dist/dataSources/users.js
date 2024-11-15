import { MongoDataSource } from 'apollo-datasource-mongodb';
import { ObjectId } from 'mongodb';
export default class Users extends MongoDataSource {
    constructor(options) {
        super(options);
        this.loggedInUser = options.loggedInUser; // if you wanna get context value to datasouces by super(options)
        this.tok = options.tok; // if you wanna get context value to datasouces
    }
    getUsers() {
        console.log(this.loggedInUser, 'loggedInUser', this.tok, 'tok'); // output = { id: 'testid', username: 'ale', password: 'calabro', email: 'test' }
        return this.collection.find().toArray();
    }
    async getUser(userId) {
        // if (this.loggedInUser.mockId !== userId.toString()) { // if you wanna check a real user id change to this.loggedInUser._id
        //     console.log(this.loggedInUser.mockId, " ", userId.toString(), " Not Authorized");
        // } else {
        //     console.log("authorized");
        // }
        // this.loggedInUser._id throw an error because the loggedInUser is of type
        const UserFind = await this.collection.findOne({ _id: new ObjectId(userId) });
        console.log(UserFind);
        return UserFind; //this.collection.findOne({ _id: new ObjectId(userId) });
    }
    addUser(username, password, email) {
        return this.collection.insertMany([{ username, password, email }]); //this.collection.insertMany([{ username, password, email }]);
    }
}
