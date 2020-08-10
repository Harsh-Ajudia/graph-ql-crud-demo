import { Length, IsEmail } from "class-validator";
import { Field, InputType } from "type-graphql";
import { isEmailAlreadyExist } from "./isEmailAlreadyExist";

@InputType()
export class RegisterInput {
    @Field()
    @Length(1, 30)
    firstName: string;
    
    @Field()
    @Length(1, 30)
    lastName: string;

    @Field()
    @IsEmail()
    @isEmailAlreadyExist({
        message: "Email already Exist"
    })
    email: string;

    @Field()
    password: string;
}