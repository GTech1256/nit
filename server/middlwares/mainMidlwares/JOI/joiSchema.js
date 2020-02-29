import Joi from 'joi';
// const config = require('../config/appconfig').default;

const passwordJoiValidator = Joi.string()
  .regex(/^[a-zA-Z0-9_-]{6,30}$/)
  .required();
const textJoiValidator = Joi.string()
  .regex(/^[a-zA-Z0-9_-]{3,}$/)
  .required();

export default {
  'DELETE:private_news': {
    rule: Joi.object().keys({
      _id: Joi.required(),
    }),
    objectIn: 'query',
  },
  'POST:private_news_upload_text': {
    rule: Joi.object().keys({
      title: Joi.string().required(),
      text: Joi.string().required(),
      date: Joi.date().required(),
      // image: Joi.allow()
    }),
    objectIn: ['body', 'query'],
  },
  'PUT:private_news_upload_text': {
    rule: Joi.object().keys({
      _id: Joi.required(),
      title: Joi.string().required(),
      text: Joi.string().required(),
      date: Joi.date().required(),
    }),
    objectIn: 'body',
  },
  'PUT:private_news_upload_image': {
    rule: Joi.object().keys({
      _id: Joi.required(),
      // image: Joi.required()
    }),
    objectIn: ['body', 'query'],
  },
  'GET:public_news': {
    rule: Joi.object().keys({
      page: Joi

        .number()
        .integer()
        .min(1)
        .allow(null)
        .default(1),
      // .required(),
      // password: passwordJoiValidator,
    }),
    objectIn: 'query',
  },
  'POST:public_auth_refresh': {
    rule: Joi.object().keys({
      refreshToken: Joi.string().required(),
    }),
    objectIn: 'body',
  },
  'POST:public_auth_signin': {
    rule: Joi.object().keys({
      email: Joi.string()
        .email()
        .required(),
      password: passwordJoiValidator,
    }),
    objectIn: 'body',
  },
  'POST:public_auth_signup': {
    rule: Joi.object().keys({
      firstName: textJoiValidator,
      lastName: textJoiValidator,
      subName: textJoiValidator,
      birth_at: Joi.required(),
      email: Joi.string()
        .email()
        .required(),
      password: passwordJoiValidator,
      confirmationPassword: Joi.any()
        .valid(Joi.ref('password'))
        .required(),
    }),
    objectIn: 'body',
  },
};
