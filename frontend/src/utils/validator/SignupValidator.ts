export interface SignupRequest {
    name: string
    email: string;
    password: string;
    role: string;
}

export interface FieldErrors {
    name?: string;
    email?: string;
    password?: string;
}

export const validateSignup = (data: SignupRequest): FieldErrors => {
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
