// src/common/decorators/password.decorator.ts
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function Password(validationOptions?: ValidationOptions) {
  const passwordRegex =
    /^(?=.*[0-9])(?=.*[A-Za-z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
  // At least 8 characters, one letter, one number, one special character

  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'password',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string' && passwordRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          // Safely handle validationOptions.message whether it's string or function
          if (typeof validationOptions?.message === 'function') {
            return validationOptions.message(args);
          }
          return (
            validationOptions?.message ||
            `${args.property} must be at least 8 characters long and contain at least one letter, one number, and one special character`
          );
        },
      },
    });
  };
}
