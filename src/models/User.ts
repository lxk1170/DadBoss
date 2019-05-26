import mongoose from "mongoose";

export interface IUser {
  _id: string, // unique id used to identify user
  username: string,
  picture: string, // url
  friends: Array<string>,
  activeGoal: string,
  queue: Array<string>,
  achieved: Array<string> // ordered from past to most recent, .pop to get last
}

export type UserModel = mongoose.Document & IUser

const userSchema = new mongoose.Schema({
  _id: String,
  username: String,
  picture: String,
  friends: [String],
  activeGoal: String,
  queue: [String],
  achieved: [String]
}, { timestamps: true });

// export const User: UserType = mongoose.model<UserType>('User', userSchema);
const User = mongoose.model("User", userSchema);
export default User;
