import { UserModal } from "../models/users";

export const userRepo = {
  createUser: (values: Record<string, any>) =>
    new UserModal(values).save().then((user) => user.toObject()),

  getUserByUsername: (username: string) => UserModal.findOne({ username }),

  // const createUser = (values: Record<string, any>) =>
  //   new UserModal(values).save().then((user) => user.toObject());
  // const getUserByUsername = (username: string) =>
  //   UserModal.findOne({ username });
  // return { createUser, getUserByUsername };
};

// export const getUsers = () => UserModal.find();
// export const getUserBySessionToken = (sessionToken: string) =>
//   UserModal.findOne({ "authentacition.sessionToken": sessionToken });
// export const getUserById = (id: string) => UserModal.findById(id);
// export const deleteUserById = (id: string) => UserModal.findByIdAndDelete(id);
// export const updateUserById = (id: string, values: Record<string, any>) =>
//   UserModal.findByIdAndUpdate(id, values);
