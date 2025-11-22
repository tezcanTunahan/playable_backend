import User from "../entitiy/userModel.js";

export const getUserByUsername = async (username: string) => {
  await User.findOne({ username });
};
