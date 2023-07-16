import express from 'express';
import Message from '../models/Message';
import renderView from '../helpers/renderView';

const router = express.Router();

router.get('/', async (req, res) => {
    const messages = await fetchMessages(req.user);
    const view = await renderView('home', {
        documentTitle: 'Members Only',
        messages: messages,
        user: req.user,
        errors: null,
        layoutUser: req.user,
    });
    res.send(view);
});
async function fetchMessages(user: any) {
    let messages: any;
    if (user && user.isMember) {
        messages = await Message.find({}, 'content title timeStamp').lean().populate('author').exec();
    } else {
        messages = await Message.find({}, 'content title').lean().exec();
    }
    return messages;
}

export default router;
