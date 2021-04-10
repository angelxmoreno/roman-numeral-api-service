import {DeepPartial, getManager} from "typeorm";
import {validateOrReject, ValidationError} from "class-validator";
import {ClassConstructor, plainToClass} from "class-transformer";
import ValidatorInterface from "./ValidatorInterface";

type Class<T = any> = new (...args: any[]) => T;

interface ErrorMessages {
    property: string
    messages: string[]
}

const normalizeValidationErrors = (errors: ValidationError[]): ErrorMessages[] => {
    return errors.map(error => {
        const {property, constraints} = error;
        const messages = constraints
            ? Object.values(constraints)
            : [];
        return {property, messages}
    })
}
export type ValidationInstance<Entity> = [boolean, Entity | undefined, ErrorMessages[]]

export const validateInstance = async <Entity>(
    data: Record<string, unknown>,
    validationClass: ClassConstructor<ValidatorInterface>,
    entityClass: ClassConstructor<Entity>
): Promise<ValidationInstance<Entity>> => {
    const entityManager = getManager();
    const validator = plainToClass(validationClass, data);
    let isValid = false;
    let entity: Entity | undefined = undefined;
    let errors: ErrorMessages[] = [];
    try {
        await validateOrReject(validator);
        entity = entityManager.create<Entity>(entityClass, data as DeepPartial<Entity>);
        isValid = true;
    } catch (error) {
        if (Array.isArray(error)) {
            errors = normalizeValidationErrors(error);
        } else {
            throw error;
        }
    }

    return [isValid, entity, errors];
}
