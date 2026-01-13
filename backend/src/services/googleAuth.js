import passport from "passport";
import dotenv from "dotenv";
dotenv.config();
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const adminUsers = [
  "adminmu@gmail.com",
  "ranggaarifianto1@gmail.com",
  "alrizky2906@gmail.com",
];

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        "https://2nd-cafemydurian.vercel.app/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        if (!adminUsers.includes(email)) {
          return done(null, false, { message: "Not authorized as admin" });
        }

        const user = {
          googleId: profile.id,
          name: profile.displayName,
          email,
          role: "admin",
        };

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("SERIALIZE:", user);
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log("DESERIALIZE:", user);
  done(null, user);
});
