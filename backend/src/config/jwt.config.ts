export const jwtConfig = {
  secret: process.env.JWT_SECRET as string,
  expiresIn: process.env.JWT_EXPIRY as string,
};
