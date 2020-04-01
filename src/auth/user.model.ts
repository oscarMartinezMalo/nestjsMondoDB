import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, min: 6, max: 255 },
    password: { type: String, required: true, min: 6, max: 1024 },
    date: { type: String, default: Date.now }
});

export interface User extends mongoose.Document {
    id: string,
    email: string;
    password: string;
    date: string;
}