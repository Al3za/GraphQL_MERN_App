import { MongoDataSource, MongoDataSourceConfig } from 'apollo-datasource-mongodb';
import { ObjectId } from 'mongodb';
import { UserDocument } from '../types';
import { genSaltSync, hashSync, compareSync, compare } from "bcrypt-ts";
// import { GraphQLError } from 'graphql';
import jwt from "jsonwebtoken";
// npm i --save-dev @types/jsonwebtoken. so ts knows wich type package´s is

export default class Users extends MongoDataSource<UserDocument> {

    protected loggedInUser: UserDocument;
    protected tok: String;
    protected MockurrentUserId: String | null

    constructor(options: { MockurrentUserId: String | null, tok: String, loggedInUser: UserDocument } & MongoDataSourceConfig<UserDocument>) {
        super(options)
        this.loggedInUser = options.loggedInUser// if you wanna get context value to datasouces by super(options)
        this.tok = options.tok;// if you wanna get context value to datasouces
        this.MockurrentUserId = options.MockurrentUserId;
    };

    async FindUser(username: string, password: string)/*: Promise<UserDocument | boolean>*/ {

        const findUser = await this.collection.findOne({ username });
        // console.log(findUser, 'FindUser FindUser', password, 'password')

        if (findUser && compareSync(password, findUser.password)) {
            return findUser
        } else {
            return false
        }
    };


    async loginUser(username: string, password: any) {

        const Getuser = await this.FindUser(username, password);
        if (Getuser && Getuser._id) {
            const UserId = Getuser._id.toString();
            const token = jwt.sign(
                {
                    user: Getuser.username,
                    userId: UserId,
                    userRole: Getuser.roles
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1800s"
                }
            );
            // console.log(token, 'jwt token')
            return { token }
        } else {
            return 'not found'
        }
    };

    getUsers() {
        // console.log(this.loggedInUser, 'loggedInUser', this.tok, 'tok') // output = { id: 'testid', username: 'ale', password: 'calabro', email: 'test' }
        return this.collection.find().toArray();
    };

    async getUser(userId: ObjectId) {

        const UserFind = await this.collection.findOne({ _id: new ObjectId(userId) });
        // console.log(UserFind)
        return UserFind //this.collection.findOne({ _id: new ObjectId(userId) });
    };

    addUser(username: string, password: string, email: string, roles: string[]) {
        console.log(roles, 'RolesAddUser')
        const salt = genSaltSync(10);
        const hash = hashSync(password, salt);
        password = ''; // we turn it to empty before have it equal to hasc. otherwise we get truble with the compare method
        password = hash;
        return this.collection.insertMany([{ username, password, email, roles }]); //this.collection.insertMany([{ username, password, email }]);
    };
};


