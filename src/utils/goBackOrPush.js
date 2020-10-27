import { history } from "../App";

const historyManager = {
  locations: [],
  findAndPush: function (path) {
    let l = this.locations.findIndex((q) => q === path);
    if (l >= 0) {
      this.locations.splice(l, 1);
    }
    this.locations.push(path);
  },
};

export function updatePastLocations(location) {
  historyManager.findAndPush(location);
}
export function goBackOrPush(path) {
  if (historyManager.locations.length >= 1) {
    history.back();
  } else {
    history.push(path || "/");
  }
  return;
}
