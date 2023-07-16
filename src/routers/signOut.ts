import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    req.logout((err) => {
        if (err) return err;
        else res.redirect('/');
    });
});

export default router;