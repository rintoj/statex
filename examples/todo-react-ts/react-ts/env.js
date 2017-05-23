// Grab NODE_ENV and REACT_APP_* environment variables and prepare them to be
// injected into the application via DefinePlugin in Webpack configuration.

const REACT_APP = /^REACT_APP_/i;
module.exports = function getClientEnvironment(publicUrl) {
  const raw = Object
    .keys(process.env)
    .filter(key => REACT_APP.test(key))
    .reduce((env, key) => {
      const update = {};
      update[key] = raw[key];
      return Object.assign(env, update);
    }, {
      NODE_ENV: process.env.NODE_ENV || 'development',
      PUBLIC_URL: publicUrl,
    });

  const stringified = {
    'process.env': Object
      .keys(raw)
      .reduce((env, key) => {
        const update = {};
        update[key] = JSON.stringify(raw[key]);
        return Object.assign(env, update);
      }, {}),
  };

  return {
    raw,
    stringified,
  };
};
