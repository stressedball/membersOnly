import express from 'express';
import {body, validationResult} from 'express-validator';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import renderView from '../helpers/renderView';

const router = express.Router();

router.get('/', async (req, res) => {
    if (req.user) res.redirect('/');
    else {
        const view = await renderView('signUp', {
            documentTitle: 'Register',
            messages: [],
            errors: null,
            user: req.user,
            layoutUser: req.user,
        });
        return res.send(view);
    }
});

router.post('/', async (req, res, next) => {
    if (!req.user) {
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            password: req.body.password,
        });
        const errors = await signUpPost(req, res);
        if (errors) {
            const view = await renderView('signUp', {
                documentTitle: 'Register',
                messages: [],
                errors: errors,
                user: user,
                layoutUser: req.user,
            });
            res.send(view);
        } else {
            bcrypt.hash(user.password, 10, async (err, hashedPassword) => {
                if (err) console.log(err);
                else {
                    user.password = hashedPassword;
                    await user.save();
                    req.login(user, function (err) {
                        if (err) return next(err);
                        res.redirect('/');
                    });
                }
            });
        }
        return;
    }
    res.redirect('/');
});

async function signUpPost(req, res) {
    await Promise.all([
        body('firstName', 'First name must be at least 1 character long.').trim().isLength({min: 1}).escape().run(req),
        body('lastName', 'Last name must be at least 1 character long.').trim().isLength({min: 1}).escape().run(req),
        body('username', 'Please enter a valid email.').isEmail().escape().run(req),
        body('password', 'Password must be at least 4 characters long.').trim().isLength({min: 4}).escape().run(req),
    ]);
    const errors = validationResult(req);
    if (errors.isEmpty()) return undefined;
    else return errors.array();
}

export default router;
