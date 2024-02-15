import { Schema, Document } from 'mongoose';
import { provewayDatabaseConnection } from '../config/database';

export type UserDocuments = Document & {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  profilePicture: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const users = new Schema(
  {
    firstName: {
      type: String,
      required: false
    },
    lastName: {
      type: String,
      required: false
    },
    email: {
      type: String,
      required: false,
      unique: true
    },

    profilePicture: {
      type: String,
      required: false
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    autoIndex: true
  }
);

export const Users = provewayDatabaseConnection.model<UserDocuments>('users', users);
