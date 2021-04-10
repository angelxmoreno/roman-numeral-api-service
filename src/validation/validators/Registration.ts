import {IsEmail, Length, Matches, Validate,} from 'class-validator';
import IsUniqueInTable from "../custom/IsUniqueInTable";
import UserEntity from "../../database/entities/UserEntity";

export default class Registration {
    @Length(1, 200)
    name!: string

    @IsEmail()
    @Validate(IsUniqueInTable, ['email', UserEntity])
    email!: string

    @Length(8, 32)
    @Matches(new RegExp(/[A-Z]/), {message: 'Password must contain at least 1 upper case letter'})
    @Matches(new RegExp(/[a-z]/), {message: 'Password must contain at least 1 lower case letter'})
    @Matches(new RegExp(/[0-9]/), {message: 'Password must contain at least 1 number'})
    password!: string
}
