const router = require('express').Router();
const {
  getUser, getUsers, updateUser, updateAvatar, getMe,
} = require('../controllers/users');
const { validateUpdateUserBody, validateUpdateAvatarBody, validateUserIdParam } = require('../validators/users');

router.get('/', getUsers);
router.get('/me', getMe);
router.get('/:userId', validateUserIdParam, getUser);
router.patch('/me', validateUpdateAvatarBody, updateUser);
router.patch('/me/avatar', validateUpdateUserBody, updateAvatar);

module.exports = router;
