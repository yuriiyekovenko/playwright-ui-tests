import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
    path: path.resolve(
        process.cwd(),
        process.env.TEST_ENV ? `.env.${process.env.TEST_ENV}` : '.env',
    ),
});

function requiredEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

export const env = {
    baseUrl: requiredEnv('BASE_URL'),
    username: requiredEnv('USERNAME'),
    lockedOutUsername: requiredEnv('LOCKED_OUT_USERNAME'),
    password: requiredEnv('PASSWORD'),
    apiBaseUrl: requiredEnv('API_BASE_URL'),
    apiAdminUsername: requiredEnv('API_ADMIN_USERNAME'),
    apiAdminPassword: requiredEnv('API_ADMIN_PASSWORD'),
};
