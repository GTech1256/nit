import user from './user';

import * as bcryptjs from 'bcryptjs';
import userLevelConfigJson = require('../settings/userLevel.config.json'); // tslint:disable-line

async function hashPassword(password: any) {
  try {
    const salt = await bcryptjs.genSalt(10);
    return await bcryptjs.hash(password, salt);
  } catch (err) {
    throw new Error(`Password hashing failed ${err}`);
  }
}

async function comparePasswords(inputPassword: any, hashedPassword: any) {
  try {
    return await bcryptjs.compare(inputPassword, hashedPassword);
  } catch (err) {
    return err;
  }
}

/**
 * Update user experience by name of action
 * @param  {string} userEmail - user email from req.user.email for search and update
 * @param  {string} actName - name of action for search in userLevelConfig
 * @param  {number} coefficient - not necessary.
 * Used for make coefficient ( coefficient ? coefficient * userLevelConfig[actName] : expByAct)
 */
async function updateExpByUserEmailAndAct(userEmail: any, actName: any, coefficient = 1) {
  // get experience from userLevelConfig by actName
  const expByAct = parseInt((userLevelConfigJson.actions as any)[actName], 10);

  // Verification of validity
  if (isNaN(expByAct)) {
    throw new Error(`act ${actName} not found in file 'userLevelConfig'`);
  }

  // calculate of newExperience
  const newExperience = coefficient * expByAct;

  // get user from DB
  const updatedUser = await user.findOneAndUpdate(
    {
      email: userEmail,
    },
    {
      $inc: {
        experience: newExperience,
      },
    }
  );

  // Verification of validity
  if (!updatedUser) {
    throw new Error(`user with email ${userEmail} not found`);
  }

  return updatedUser;
}

export default { updateExpByUserEmailAndAct, comparePasswords, hashPassword };
