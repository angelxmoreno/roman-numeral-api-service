import * as jwt from 'jsonwebtoken';
import Env from "./Env";
import UserEntity from "../database/entities/UserEntity";

interface DecodedToken {
  uid: string;
  iat: number;
  exp: number;
}

const JWT_KEY = Env.getString('JWT_KEY', '__SET_THIS__');
const EXPIRY_SECONDS = Env.getInteger('JWT_EXPIRY_MINUTES') * 60;
const JwtService = {
  fromUser: (user: UserEntity): string => {
    return jwt.sign({ uid: user.id }, JWT_KEY, {
      algorithm: 'HS256',
      expiresIn: EXPIRY_SECONDS,
    });
  },
  toUser: async (token: string): Promise<UserEntity | undefined> => {
    try {
      const payload = jwt.verify(token, JWT_KEY) as DecodedToken;
      return UserEntity.findOne(payload.uid);
    } catch (e) {
      return undefined;
    }
  },
};

export default JwtService;
