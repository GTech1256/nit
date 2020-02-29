import User from './models/User';

export default async () => {
  const { SUPERADMIN_EMAIL = 'Superadmin@nit.ru', SUPERADMIN_PASSWORD = 'Secret' } = process.env;

  const admin = await User.findOne({ email: SUPERADMIN_EMAIL });

  if (admin) {
    console.log('admin exist');
    return;
  }


  console.log('trying create admin accound');
  // create admin account if admin not exist
  User.create({
    firstName: 'Superadmin',
    lastName: 'lastname',
    subName: 'subName',
    birth_at: 0,
    email: SUPERADMIN_EMAIL,
    password: await User.hashPassword(SUPERADMIN_PASSWORD),
    roles: ['superadmin'],
  }).exec((data, err) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log('admin account created');
  });
};
