export interface CreateUserResponse {
    message: string;
    user: {
        password: string;
        // Add other user properties if needed
    };
}