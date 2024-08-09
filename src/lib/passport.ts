import {ExtractJwt, Strategy as JwtStrategy} from "passport-jwt";
import passport from "passport";
import {getUserById} from "../services/user.service";

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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
