import express from 'express';
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import {body, validationResult} from 'express-validator';
//
import User from '../models/User';
import renderView from '../helpers/renderView';
const router = express.Router();
router.get('/', async (req, res) => {
    const view = await renderView('member', {
        documentTitle: 'Become A Member',
        user: req.user,
        layoutUser: req.user,
        errors: null,
        messages: [],
    });
    res.send(view);
});
router.post('/', async (req, res, next) => {
    const errors = await memberPost(req, res);
    let view: any;
    if (errors) {
        view = await renderView('member', {
            documentTitle: 'Become A Member',
            layoutUser: req.user,
            user: req.user,
            messages: [],
            errors: errors,
        });
        res.send(view);
        return;
    }
    const userInput: string = req.body.memberPassword;
    const secret: string = process.env.MEMBER_PASSWORD;
    const memberPassword = await new Promise<string>((res, rej) => {
        bcrypt.hash(secret, 10, async (err, hashedPassword) => {
            if (err) rej(err);
            else res(hashedPassword);
        });
    });
    const isMember = await new Promise((resolve, rej) => {
        bcrypt.compare(userInput, memberPassword, (err, res) => {
            if (res) resolve(true);
            else resolve(false);
        });
    });
    if (isMember) {
        await User.findByIdAndUpdate(req.user.id, {isMember: true}).exec();
        res.redirect('/');
        return;
    } else {
        view = await renderView('member', {
            documentTitle: 'Become A Member',
            layoutUser: req.user,
            user: req.user,
            errors: ['Incorrect Password'],
            messages: [],
        });
        res.send(view);
    }
});
async function memberPost(req, res) {
    await new Promise((res) => {
        body('memberPassword', 'Please enter a password of 6 characters or more.').trim().isLength({min: 1}).escape()
            .run;
        res(null);
    });
    const errors = validationResult(req);
    if (!errors.isEmpty()) return errors.array();
    else return undefined;
}

export default router;
