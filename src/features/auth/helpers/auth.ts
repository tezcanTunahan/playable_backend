import CustomError from "../../../errors/CustomError";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function passwordMatchCheker(
  password: string,
  userPassword: string
) {
  const isMatch = await bcrypt.compare(password, userPassword);
  if (!isMatch) throw new CustomError(404, "invalid credentials");
}

export const createAccesToken = (id: any, role: string, username: string) => {
  return jwt.sign({ id, role, username }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};
