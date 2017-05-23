const Immutable = require('seamless-immutable');
const {
  Reflux,
} = require('react-reflux/dist/constance');

module.exports = function hotLoad(appName) {
  const STATE_KEY = `${appName}-hmr-application-state-cache`;

  // load state when reloaded
  try {
    const cachedState = JSON.parse(window.localStorage.getItem(STATE_KEY) || '{}');
    Reflux.state = Immutable.from(cachedState);
    Reflux.stateStream.next(Reflux.state);
  } catch (e) {
    window.localStorage.setItem(STATE_KEY, undefined);
  }

  // save state on each change
  Reflux.stateStream.subscribe(state => window.localStorage
    .setItem(STATE_KEY, JSON.stringify(state)), undefined, undefined);
};
