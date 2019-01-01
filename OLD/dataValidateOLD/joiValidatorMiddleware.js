const Joi = require('joi');
const joiSchema = require('./joiSchema');
const apiCodes = require('../misc/apiCodes/index');

/**
 * Joi Validator Middleware
 * Создает инстанцию Joi мидлвара
 * Указываеться после инцилизации параметра objectForValidate.
 * @param  {String} routerPath - routerPath.
 * @param  {(Object|String)} objectForValidate - обьект для валидации или строку с именем обьекта внутри req[objectForValidate].
 * @param {...{name: String, value: *}} addationalFields - Обьект доболнительных данных для проверки
 * @return {function} middleware - Функция, которая проверяет Joi схемы с данными. При ошибках отправляет apiCode[5] иначе пропускает дальше next()
 */
function joiValidatorMiddleware(routerPath, objectForValidate, ...addationalFields) {
  return (req, res, next) => {
    try {
      let copyOfObjectForValidate = objectForValidate;

      if (typeof objectForValidate === 'string') {
        copyOfObjectForValidate = req[objectForValidate];
      }

      addationalFields.forEach((field) => {
        copyOfObjectForValidate[field.name] = field.value();
      })

      if (!joiSchema[routerPath]) {
        console.error('joiValidatorMiddleware error', 'Схема ',routerPath, 'не найдена');
        return apiCodes.SERVER_ERROR(res);
      }

      const resultOfJoiValidate = Joi.validate(copyOfObjectForValidate, joiSchema[routerPath]);

      if (resultOfJoiValidate.error) {
        return apiCodes.DATA_NOT_VALID(res, resultOfJoiValidate.error.details[0].message);
      }

      req.resultOfJoiValidate = resultOfJoiValidate;

      next();
    } catch(e) {
      console.error('joiValidatorMiddleware error', e);
      return apiCodes.SERVER_ERROR(res);
    }
  }
}
module.exports = joiValidatorMiddleware;
