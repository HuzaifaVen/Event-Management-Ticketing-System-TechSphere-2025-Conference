export interface LoginRequest {
    email: string;
    password: string;
}

export interface FieldErrors {
    email?: string;
    password?: string;
}

export const validateLogin = (data: LoginRequest): FieldErrors => {
    const errors: FieldErrors = {};

    if (!data.email) {
        errors.email = 'Email is required';
    } else if (!/^[\w.+-]+@gmail\.com$/.test(data.email)) {
        errors.email = 'Only gmail addresses are allowed';
    }


    // Password validation
    if (!data.password) {
        errors.password = 'Password is required';
    } else if (data.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
    }

    return errors;
};
