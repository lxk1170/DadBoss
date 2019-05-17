import mongoose from "mongoose";

export interface IUser {
  id: string, // unique id used to identify user
  name: string,
  picture: string, // url
  friends: Array<number>,
  goals: Array<string>
}

export type UserModel = mongoose.Document & IUser

const userSchema = new mongoose.Schema({
  id: String,
  name: String,
  picture: String,
  friends: [Number],
  goals: [String]
}, { timestamps: true });

// export const User: UserType = mongoose.model<UserType>('User', userSchema);
const User = mongoose.model("User", userSchema);
export default User;
