import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ["user", "admin"] },
  },
  {
    timestamps: true,
  }
);

export const UserModal = mongoose.model("User", UserSchema);

// export const getUsers = () => UserModal.find();
export const getUserByUsername = (username: string) =>
  UserModal.findOne({ username });
// export const getUserBySessionToken = (sessionToken: string) =>
//   UserModal.findOne({ "authentacition.sessionToken": sessionToken });
// export const getUserById = (id: string) => UserModal.findById(id);
export const createUser = (values: Record<string, any>) =>
  new UserModal(values).save().then((user) => user.toObject());
// export const deleteUserById = (id: string) => UserModal.findByIdAndDelete(id);
// export const updateUserById = (id: string, values: Record<string, any>) =>
//   UserModal.findByIdAndUpdate(id, values);
