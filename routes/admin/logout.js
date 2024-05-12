var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    req.session.destroy();
    res.redirect(302, process.env.REDIRECT_FRONTEND );
});

module.exports = router;