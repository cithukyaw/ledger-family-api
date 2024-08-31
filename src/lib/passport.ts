import { Request } from 'express';
import {ExtractJwt, Strategy as JwtStrategy} from "passport-jwt";
import passport from "passport";
import {getUserById} from "../services/user.service";

// Custom cookie extractor function
const jwtCookieExtractor = (req: Request) => {
  let token = null;
  if (req && req.cookies && typeof process.env.JWT_COOKIE_NAME === 'string') {
    token = req.cookies[process.env.JWT_COOKIE_NAME]; // Extract the JWT token from the HTTP-only cookie
  }

  return token;
};

const opts = {
  jwtFromRequest: process.env.JWT_COOKIE_NAME ? jwtCookieExtractor : ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET as string,
}

passport.use(
  new JwtStrategy(opts, async(payload, done) => {
    try {
      const user = await getUserById(payload.id);
      if (user) {
        return done(null, user.id);
      }

      return done(null, false);
    } catch (error) {
      console.error(error);
      return done(error, false)
    }
  })
)

export default passport;
