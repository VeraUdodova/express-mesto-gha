const router = require('express').Router();
const {
  getUser, getUsers, updateUser, updateAvatar, getMe,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.get('/me', getMe);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
