import { Query, Resolver, Mutation, Arg } from "type-graphql";
import bcrypt from 'bcryptjs';
import { User } from "../../entity/User";
import { RegisterInput } from "./register/RegisterInput";

@Resolver()
export class RegisterResolver {

    @Query(() => String)
    async hello() {
        return "Hello World!";
    }

    @Query(() => [User], { nullable: true })
    async getAllUsers(
        //@Arg("leadId") leadId: number
    ): Promise<User[]> {
        const action = await User.find();
        return action;
    }

    @Mutation(() => User)
    async registerUser(
        @Arg("data") {
            email,
            firstName,
            lastName,
            password
        }: RegisterInput,
    ): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        }).save();

        return user;
    }

    @Mutation(() => Boolean)
    async deleteUser(@Arg("id") id: number): Promise<Boolean> {
        const user = await User.findOne({ where: { id } });

        if (!user) {
            throw new Error("user not found");
        }

        await User.delete({ id: user.id });
        return true;
    }

    @Mutation(() => Boolean)
    async updateUser(
        @Arg("id") id: number,
        @Arg("email", { nullable: true }) email: string,
        @Arg("firstName", { nullable: true }) firstName: string,
        @Arg("lastName", { nullable: true }) lastName: string
    ): Promise<Boolean> {
        const user = await User.findOne({ where: { id } });

        if (!user) {
            throw new Error("User Not found");
        }

        await User.update(user.id, {
            firstName: firstName ? firstName : user.firstName,
            lastName: lastName ? lastName : user.lastName,
            email: email ? email : user.email,
        });

        return true;
    }
}