import { MongoDataSource } from 'apollo-datasource-mongodb';
import { ObjectId } from 'mongodb';
import { genSaltSync, hashSync, compareSync } from "bcrypt-ts";
// import { GraphQLError } from 'graphql';
import jwt from "jsonwebtoken";
// npm i --save-dev @types/jsonwebtoken. so ts knows wich type package´s is
//import { JWT_SECRET } from '..';
export default class Users extends MongoDataSource {
    constructor(options) {
        super(options);
        this.loggedInUser = options.loggedInUser; // if you wanna get context value to datasouces by super(options)
        this.tok = options.tok; // if you wanna get context value to datasouces
        this.MockurrentUserId = options.MockurrentUserId;
    }
    ;
    async FindUser(username, password) {
        const findUser = await this.collection.findOne({ username });
        console.log(findUser, 'FindUser FindUser', password, 'password');
        if (findUser && compareSync(password, findUser.password)) {
            return findUser;
        }
        else {
            return false;
        }
    }
    ;
    async loginUser(username, password) {
        console.log(process.env.JWT_SECRET, 'LoginUser');
        //const secret = JWT_SECRET
        // const JWT_SECRET = 'MYJWTSECRET'
        const Getuser = await this.FindUser(username, password);
        if (Getuser && Getuser._id) {
            const UserId = Getuser._id.toString();
            const token = jwt.sign({
                user: Getuser.username,
                userId: UserId,
            }, process.env.JWT_SECRET, {
                expiresIn: "1800s"
            });
            // console.log(token, 'jwt token')
            return { token };
        }
        else {
            return 'not found';
        }
    }
    ;
    getUsers() {
        // console.log(this.loggedInUser, 'loggedInUser', this.tok, 'tok') // output = { id: 'testid', username: 'ale', password: 'calabro', email: 'test' }
        return this.collection.find().toArray();
    }
    ;
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
    ;
    addUser(username, password, email, roles) {
        console.log(roles, 'RolesAddUser');
        const salt = genSaltSync(10);
        const hash = hashSync(password, salt);
        password = ''; // we turn it to empty before have it equal to hasc. otherwise we get truble with the compare method
        password = hash;
        return this.collection.insertMany([{ username, password, email, roles }]); //this.collection.insertMany([{ username, password, email }]);
    }
    ;
}
;
// const findUser = await this.collection.findOne({ username });
// if (findUser && compareSync(password, findUser.password)) {
//     return this.createJwt(findUser)
// }
// else {
//     return false
//     // throw new GraphQLError(
//     //     `User not found.`
//     //     // this error ll be thrown in our react app UI
//     // );
// }
