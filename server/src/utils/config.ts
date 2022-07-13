import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT as string;
export const JWT_SECRET = process.env.JWT_SECRET as string;

export const EMAIL = process.env.EMAIL_ADRESS_SENDER as string;
export const PASSWORD = process.env.EMAIL_ADRESS_SENDER_PASSWORD as string;
