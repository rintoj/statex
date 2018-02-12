export default process.env.NODE_ENV === 'development' ?
  require('seamless-immutable/seamless-immutable.development.min') :
  require('seamless-immutable/seamless-immutable.production.min')