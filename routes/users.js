const router = require('express').Router();
const { getUser, createUser } = require('../controllers/users');

router.get('/', getUser);
router.get('/:id', getUser);
router.post('/', createUser);

module.exports = router;
