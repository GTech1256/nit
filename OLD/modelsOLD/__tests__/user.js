require('dotenv').config();
require('../../utils/mongo/database');

const UserUtils = require('../../utils/models/userutils').default;
const User = require('../../utils/models/user').default;
const Planet = require('../../utils/models/planet').default;

describe('Test if models/users.js', () => {

  it('should hash password correct by compare password', async done => {
    const testPassword = 'q1w2e3r456';
    const hashedPassword = await UserUtils.hashPassword(testPassword);

    expect(hashedPassword).not.toBe(testPassword);

    const isComparePassword = await UserUtils.comparePasswords(testPassword, hashedPassword);
    expect(isComparePassword).toBeTruthy();

    done();
  });


  it.skip('should update user property "experience" correct', () => {

  });

  it('should return error by bad action name from update user "experience"', async done => {
    let errorFromCatch;
    try {
      await UserUtils.updateExpByUserEmailAndAct('voin.ics@yandex.ru', "INVALID");
    } catch(err) {
      errorFromCatch = err;
      console.log('ERROR')
    } finally {
      expect(errorFromCatch)
        .toMatchObject({
          message: expect.stringMatching(/not found in file/)
        });
      done()
    };

  });

  it('should return error by bad email user from update user "experience"', async done => {
    let errorFromCatch;
    try {
      await UserUtils.updateExpByUserEmailAndAct('INVALID', 'BUY_PLANET');
    } catch(err) {
      errorFromCatch = err;
      console.log('ERROR')
    } finally {
      expect(errorFromCatch)
        .toMatchObject({
          message: expect.stringMatching(/user with email/)
        });
      done()
    };
  });


})
