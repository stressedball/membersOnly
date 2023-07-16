import passport from 'passport';
import passportLocal from 'passport-local';
import bcrypt from 'bcryptjs';
import User from './models/User';

const LocalStrategy = passportLocal.Strategy;
passport.use(
    new LocalStrategy(async (username, password, cb) => {
        try {
            const user = await User.findOne({username: username});
            if (!user) return cb(null, false, {message: "User doesn't seem to exist"});
            bcrypt.compare(password, user.password, (err, res) => {
                if (err) return cb(err);
                if (!res) return cb(null, false, {message: 'Incorrect password'});
                return cb(null, user);
            });
        } catch (error) {
            return cb(error);
        }
    })
);
passport.serializeUser((user, cb) => {
    cb(null, user._id);
});
passport.deserializeUser(async (id, cb) => {
    try {
        const user = await User.findById(id).exec();
        cb(null, user);
    } catch (err) {
        cb(err);
    }
});

export default passport;
