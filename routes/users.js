const router = require('express').Router();
const {getUser, createUser, updateUser, updateAvatar} = require('../controllers/users');

router.get('/', getUser);
router.get('/:userId', getUser);
router.post('/', createUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
