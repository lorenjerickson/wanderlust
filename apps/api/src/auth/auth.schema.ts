import * as mongoose from 'mongoose';

export interface Auth {
  username: string;
  jwt: string;
}

export const AuthSchema = new mongoose.Schema({
  username: String,
  jwt: String,
});
