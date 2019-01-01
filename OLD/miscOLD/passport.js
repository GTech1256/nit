const config = require('../config/appconfig').default;
const passport = require('passport');
const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');
const User = require('../utils/models/user').default;

const opts = {
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.secretOrKey,
  jsonWebTokenOptions: {
    expiresIn: config.authentication.exp
  }
};

const strategy = new passportJWT.Strategy(opts, (payload, done) => {
  User.findOne({ email: payload.sub }, (err, user) => {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user.toObject(), { payload });
    }
    return done(null, false);
  });
});

passport.use(strategy);

module.exports = {
  authenticate: (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) {
        return next(err);
      };

      if (!user || (user && !user.active)) {
        return next();
      };

      // TODO: rename req.user to passportUser. We got user from DB, not from request data!

      req.user = {                                  // TODO: populate req.user
        locale: req.cookies.locale,
        email: user.email,
        username: user.username,
        wallet: {
          privateKey: user.wallet.privateKey,
          iv: user.wallet.iv,
          address: user.wallet.address,
        },
        roles: user.roles,
      };
      if (user.ref1) {
        req.user.ref1 = user.ref1
      }
      if (user.ref2) {
        req.user.ref2 = user.ref2
      }
      next();
      /*
      if (Date.now() / 1000 - info.payload.iat > config.authentication.touchAfter) {
        let jwtPayload = { sub: user.email };
        let opts = { expiresIn: config.authentication.exp };

        jwt.sign(jwtPayload, config.secretOrKey, opts, (err, token) => {
          if (err) throw err;

          // attach token to response

          res.append('Prolong-Session', token);
          next();
        });
      } else {
        next();
      }
      */
    })(req, res, next);
  }
};
