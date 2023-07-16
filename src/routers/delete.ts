import express from 'express';
import renderView from '../helpers/renderView';
import Message from '../models/Message';
const router = express.Router();
router.get('/:id/confirm', async (req, res, next) => {
    await Message.findByIdAndDelete(req.params.id).exec();
    res.redirect('/');
});
router.get('/:id', async (req, res, next) => {
    const message = await Message.findById(req.params.id).lean().populate('author').exec();
    const view = await renderView('delete', {
        documentTitle: 'Delete Message',
        user: req.user,
        layoutUser: req.user,
        errors: null,
        messages: message,
    });
    res.send(view);
});
export default router;
