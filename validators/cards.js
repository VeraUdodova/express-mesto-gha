const { celebrate, Joi } = require('celebrate');
const { urlRegExp } = require('../utils/utils');

module.exports.validateCardIdParam = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
});

module.exports.validateCreateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(
      urlRegExp,
    ),
  }),
});
