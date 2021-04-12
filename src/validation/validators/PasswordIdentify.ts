import {IsEmail, Length, Matches, Validate,} from 'class-validator';
import UserEntity from "../../database/entities/UserEntity";
import IsValidEmailPassword from "../custom/IsValidEmailPassword";

export default class PasswordIdentify {
    @IsEmail()
    email!: string

    @Length(8, 32)
    @Matches(new RegExp(/[A-Z]/), {message: 'Password must contain at least 1 upper case letter'})
    @Matches(new RegExp(/[a-z]/), {message: 'Password must contain at least 1 lower case letter'})
    @Matches(new RegExp(/[0-9]/), {message: 'Password must contain at least 1 number'})
    @Validate(IsValidEmailPassword, ['email', 'password', UserEntity])
    password!: string
}
