import express from 'express';
import {body, validationResult} from 'express-validator';
//
import renderView from '../helpers/renderView';
import passport from '../passport';

const router = express.Router();

router.get('/', async (req, res) => {
    if (req.user) res.redirect('/');
    else {
        const view = await renderView('signIn', {
            documentTitle: 'Log in clubhouse',
            user: req.user,
            errors: [req.flash('error')[0]],
            messages: [],
            layoutUser: req.user
        });
        res.send(view);
    }
});

router.post('/', async (req, res) => {
    const errors = await signInPost(req, res);
    if (errors) {
        const view = await renderView('signIn', {
            documentTitle: 'Log in clubhouse',
            user: {username: req.body.username, password: req.body.password},
            errors: errors,
            messages: [],
            layoutUser: req.user
        });
        res.send(view);
    } else {
        passport.authenticate('local', {
            failureFlash: true,
            successRedirect: '/',
            failureMessage: true,
            failureRedirect: '/sign_in',
        })(req, res);
    }
});

async function signInPost(req, res) {
    await Promise.all([
        body('username', 'Please enter a valid email').isEmail().escape().run(req),
        body('password', 'Please enter a password of more than 3 characters.')
            .trim()
            .isLength({min: 4})
            .escape()
            .run(req),
    ]);
    const errors = validationResult(req);
    if (errors.isEmpty()) return undefined;
    return errors.array();
}

export default router;
