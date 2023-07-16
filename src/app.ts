import express from 'express';
import serverless from 'serverless-http';
import 'dotenv/config';
import passport from './passport';
import session from 'express-session';
import flash from 'connect-flash';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
//
import indexRouter from './routers/index';
import signUpRouter from './routers/signUp';
import signInRouter from './routers/signIn';
import signOutRouter from './routers/signOut';
import messageRouter from './routers/message';
import memberRouter from './routers/member';
import deleteRouter from './routers/delete';
initiateMongoDb();
const app = express();
app.use(flash()); // to leverage messages from passport
app.use(express.urlencoded({extended: false})); // to be able to read req body
app.use(cookieParser());
app.set('trust proxy', 1);
app.use(
    session({
        secret: 'cat',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: true,
            sameSite: 'none',
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use('/', indexRouter);
app.use('/sign_up', signUpRouter);
app.use('/sign_in', signInRouter);
app.use('/sign_out', signOutRouter);
app.use('/message', messageRouter);
app.use('/member', memberRouter);
app.use('/delete', deleteRouter);
app.use(function (err, req, res, next) {
    res.send(err);
    return;
});
async function initiateMongoDb() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
    } catch (error) {
        console.log(error);
    }
}
export const handler = serverless(app);
