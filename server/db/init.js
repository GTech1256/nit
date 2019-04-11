import User from './models/User';

export default async () => {
    const admin = await User.findOne({ email: 'Superadmin@nit.ru' });

    if (admin) {
        console.log('admin exist')
        return;
    }
    console.log('trying create admin accound')
    // create admin account if admin not exist
    User.create({
        firstName: 'Superadmin',
        lastName: 'lastname',
        subName: 'subName',
        birth_at: 0,
        email: 'Superadmin@nit.ru',
        password: await User.hashPassword('Secret') ,
        roles: ['superadmin']
    }).exec((data, err) => {
        if (err) {
            console.log(err);
            return;
        };

        console.log('admin account created')
    })
}