import mongoose from "mongoose";

export interface IUser {
  _id: string, // unique id used to identify user
  name: string,
  picture: string, // url
  friends: Array<number>,
  hasGoal: boolean, // whether or not the user has an active goal
  queue: Array<string>,
  achieved: Array<string> // ordered from past to most recent, .pop to get last
}

export type UserModel = mongoose.Document & IUser

const userSchema = new mongoose.Schema({
  _id: String,
  name: String,
  picture: String,
  friends: [Number],
  hasGoal: Boolean,
  queue: [String],
  achieved: [String]
}, { timestamps: true });

// export const User: UserType = mongoose.model<UserType>('User', userSchema);
const User = mongoose.model("User", userSchema);
export default User;
