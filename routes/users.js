const router = require('express').Router();
const {
  getUser, getUsers, updateUser, updateAvatar, getMe,
} = require('../controllers/users');
const { validateUpdateUserBody, validateUpdateAvatarBody, validateUserIdParam } = require('../validators/users');

router.get('/', getUsers);
router.get('/me', getMe);
router.get('/:userId', validateUserIdParam, getUser);
router.patch('/me', validateUpdateUserBody, updateUser);
router.patch('/me/avatar', validateUpdateAvatarBody, updateAvatar);

module.exports = router;
