export const routingRules = {};

export function createRoutingRule(name, defVal = false) {
  routingRules[name] = {
    set: function (rule) {
      this.response = rule();
    },
    response: defVal,
  };
  return routingRules[name];
}

export function notForThisRoute(name, callback) {
  if (routingRules[name]?.response) {
    callback(routingRules[name]);
  }
}
