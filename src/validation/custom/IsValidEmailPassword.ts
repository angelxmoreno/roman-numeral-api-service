import {ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface} from 'class-validator';
import {EntityTarget, getManager} from "typeorm";
import bcrypt from 'bcryptjs';

@ValidatorConstraint({name: 'validEmailPassword', async: true})
export default class IsValidEmailPassword implements ValidatorConstraintInterface {
    async validate(text: string, args: ValidationArguments) {
        const {constraints, object} = args
        const [emailColumn, passwordColumn, EntityClass] = constraints as [string, string, EntityTarget<any>];
        const email = object[emailColumn as keyof typeof object];
        const password = object[passwordColumn as keyof typeof object];
        const where = {email}

        const em = getManager()
        const user = await em.findOne(EntityClass, {where});
        // Even if user is undefined, run the hash check to avoid Timing Attacks
        return bcrypt.compareSync(password, user?.password || '');
    }

    defaultMessage(args: ValidationArguments) {
        return 'Wrong email/password';
    }
}
