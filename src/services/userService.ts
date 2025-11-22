import User from "../entitiy/User.js";

export const getUserByUsername = async (username: string) => {
  await User.findOne({ username });
};
