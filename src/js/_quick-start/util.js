exports.getProps = (defaults, cxt) => Object.keys(defaults).reduce((memo, key) => {
  const setterKey = "set" + key.charAt(0).toUpperCase() + key.slice(1);
  memo[key] = cxt.state[key];
  memo[setterKey] = cxt.linkState(key);
  return memo;
}, {});
