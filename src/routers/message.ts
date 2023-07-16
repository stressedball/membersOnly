import express from 'express';
import {body, validationResult} from 'express-validator';
// 
import renderView from '../helpers/renderView';
import Message from '../models/Message';

const router = express.Router();

router.get('/', async (req, res) => {
    const view = await renderView('message', {
        documentTitle: 'Create New Message',
        user: req.user,
        layoutUser: req.user,
        errors: null,
        messages: [],
    });
    res.send(view);
});

router.post('/', messagePost);

async function messagePost(req, res) {
    await Promise.all([
        body('title', 'Please enter a title of a length of at least 1 character.')
            .trim()
            .isLength({min: 1})
            .escape()
            .run(req),
        body('content', 'Please enter a message of a length of at least 1 character.')
            .trim()
            .isLength({min: 1})
            .escape()
            .run(req),
    ]);
    const errors = validationResult(req);
    if (!req.user) {
        res.redirect('/');
        return;
    }
    const message = new Message({
        author: req.user._id,
        timeStamp: new Date(),
        title: req.body.title,
        content: req.body.content,
    });
    if (errors.isEmpty()) {
        await message.save();
        res.redirect('/');
    } else {
        const view = await renderView('message', {
            documentTitle: 'Create New Message',
            layoutUser: req.user,
            user: req.user,
            errors: errors.array(),
            messages: message,
        });
        res.send(view);
    }
}

export default router;