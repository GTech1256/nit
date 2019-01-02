import Joi from 'joi';
import joiSchema from './joiSchema';

// const apiCodes = require('../misc/apiCodes/index');

/**
 * Joi Validator Middleware
 * Создает инстанцию Joi мидлвара
 *
 */

export default (ctx, next) => {
  const path = ctx.request.path.replace('/api/', '').replace(/\//g, '_');
  const joiObject = joiSchema[path];
  if (joiObject) {
    let copyOfObjectForValidate = {};

    if (typeof joiObject.objectIn === 'string') {
      joiObject.objectIn = [joiObject.objectIn];
    }

    joiObject.objectIn.forEach((field) => {
      copyOfObjectForValidate = { ...copyOfObjectForValidate, ...ctx.request[field] };
    });

    const resultOfJoiValidate = Joi.validate(copyOfObjectForValidate, joiObject.rule);

    if (resultOfJoiValidate.error) {
      const message =				process.env.NODE_ENV === 'production'
				  ? resultOfJoiValidate.error.name
				  : resultOfJoiValidate.error.details;
      ctx.body = { message };
      ctx.status = 403;
      return;
    }

    ctx.state.joiValidValues = resultOfJoiValidate.value;
  }

  return next();
};
