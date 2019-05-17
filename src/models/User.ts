import mongoose from "mongoose";

export type UserModel = mongoose.Document & {
  id: number, // unique id used to identify user
  name: string,
  picture: string, // url
  friends: Array<number>
};

const userSchema = new mongoose.Schema({
  id: Number,
  name: String,
  picture: String,
  friends: [Number]
}, { timestamps: true });

// export const User: UserType = mongoose.model<UserType>('User', userSchema);
const User = mongoose.model("User", userSchema);
export default User;
