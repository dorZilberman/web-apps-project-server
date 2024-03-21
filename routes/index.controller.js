var router = require('express').Router();

router.get('/', function(req, res) {
    res.send('OK!');
});

module.exports = router;