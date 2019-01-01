const Joi = require('joi');
const config = require('../config/appconfig').default;

const passwordJoiValidator = Joi.string().regex(/^[a-zA-Z0-9_-]{6,30}$/).required();

module.exports = {
 public_auth_refresh: Joi.object().keys({
    refreshToken: Joi.string().required()
  }),
  public_account_restore: Joi.object().keys({
    email: Joi.string().email().required(),
    recaptcha: Joi.boolean().required().equal(true),
  }),
  public_account_change_confirm: Joi.object().keys({
    encodedToken: Joi.string().required(),
    type: Joi.string().required(),
    key: Joi.string().required(),
    value: Joi.string().required()
  }),
  public_galaxy_planets: Joi.object().keys({
    x: Joi.number().integer().required(),
    y: Joi.number().integer().required(),
    z: Joi.number().integer().required(),
    r: Joi.number().integer(),
  }),
  public_galaxy_star: Joi.object().keys({
    galaxyId: Joi.number().integer().min(0).required()
  }),
  public_signup: Joi.object().keys({
    username: Joi.string().regex(/^[a-zA-Z0-9_-]{3,30}$/).required(),
    email: Joi.string().email().required(),
    password: passwordJoiValidator,
    confirmationPassword: Joi.any().valid(Joi.ref('password')).required(),
    ref: Joi.string(),
    recaptcha: Joi.boolean().required().equal(true)
  }),
  public_store_planets_search: Joi.object().keys({
    query: Joi.string().max(50).required(),
    page: Joi.number().integer().min(1).max(9999).required()
  }),
  public_store_planets: Joi.object().keys({
    page: Joi.number().integer().min(1).max(9999).required(),
    priceFrom: Joi.number().min(0).max(9e9),
    priceTo: Joi.number().min(Joi.ref('priceFrom')).max(9e9),
    populationFrom: Joi.number().integer().min(0).max(config.store.maxPopulation),
    populationTo: Joi.number().integer().min(Joi.ref('populationFrom')).max(config.store.maxPopulation),
    sort: Joi.string(),         // validation check is performed out of Joi schema
    sortOrder: Joi.number(),    // validation check is performed out of Joi schema
    type: Joi.array().unique().items(Joi.number().integer().min(0).max(6)).single()
  }),
  private_account_withdraw: Joi.object().keys({
    address: Joi.string().regex(/^[A-Z0-9]{40}$/).required(),
    amount: Joi.number().min(0).max(8999999999).precision(6).required()
  }),
  private_account_transactions: Joi.object().keys({
    username: Joi.string().required(),
  }),
  private_account_info_address:Joi.object().keys({
    address: Joi.string().required(),
  }),
  private_account_changeEMAIL: Joi.object().keys({
    type: Joi.string().required(),
    oldValue: Joi.string().email().required(),
    newValue: Joi.string().email().required().disallow(Joi.ref('oldValue')),
    repeatValue: Joi.string().email().equal(Joi.ref('newValue')).required(),
  }),
  private_account_changePASSWORD: Joi.object().keys({
    type: Joi.string().required(),
    oldValue: Joi.string().regex(/^[a-zA-Z0-9_-]{6,30}$/).required(),
    newValue: Joi.string().regex(/^[a-zA-Z0-9_-]{6,30}$/).disallow(Joi.ref('oldValue')).required(),
    repeatValue: Joi.string().equal(Joi.ref('newValue')).required(),
  }),
  private_sale_planets: Joi.object().keys({
    page: Joi.number().integer().min(1).max(9999).required(),
    address: Joi.string().required()
  }),
  private_sale_planets_id: Joi.object().keys({
    forsale: Joi.number().integer().min(0).max(1),
    cost: Joi.number().min(0).max(8999999999).precision(6),
    desc: Joi.string().optional().allow('').max(config.sale.descMaxLength),
  }),
  public_signup_resend: Joi.object().keys({
    email: Joi.string().email().required()
  }),
  private_account_change_birthday: Joi.object().keys({
    newValue: Joi.date().required()
  }),
  /*
  private_sale_planets: Joi.object().keys({
    id: Joi.string().required()
  }),
  */
  private_store_planets_id: Joi.object().keys({
    id: Joi.string().required(),
    lou: Joi.number().required(),
  }),
  public_login: Joi.object().keys({
    recaptcha: Joi.boolean().required().equal(true),
    email: Joi.string().email().required(),
    password: passwordJoiValidator,
  }),
  public_signup_verify: Joi.object().keys({
    token: Joi.string().required(),
  }),
  public_store_planets_id: Joi.object().keys({
    id: Joi.string().required(),
  }),
  private_account_change_aboutMe: Joi.object().keys({
    newValue: Joi.string().required(),
  }),
  private_account_change_mySite: Joi.object().keys({
    newValue: Joi.string().required(),
  }),
  private_account_change_picture: Joi.object().keys({
    picture: Joi.required(), // pic base64?
  }),
}
