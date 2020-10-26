import { Action, Location, LocationState, Path } from "history";
import { history } from "../App";

class PathLocationManager {
  private pastLocations: Location[] = [];
  private readonly key = "appLocationHistory";

  constructor() {
    const jsonFromSessionStorage = sessionStorage.getItem(this.key);
    this.pastLocations = jsonFromSessionStorage
      ? (JSON.parse(jsonFromSessionStorage) as Location[])
      : [];
  }

  public removeDuplicate(index) {
    this.pastLocations.splice(index, 1);
  }

  public push(location: Location) {
    let duplicateLocation = this.pastLocations?.findIndex(
      (q) => q.pathname === location.pathname
    );
    if (duplicateLocation >= 0) this.removeDuplicate(duplicateLocation);
    else {
      this.pastLocations.push(location);
      this.dumpToSessionStorage();
    }
  }

  public pop() {
    this.pastLocations.pop();
    this.dumpToSessionStorage();
  }

  public length() {
    return this.pastLocations.length;
  }

  public setLocation(index: number, location: Location) {
    this.pastLocations[index] = location;
    this.dumpToSessionStorage();
  }

  public getLocation(index: number) {
    return this.pastLocations[index];
  }

  public setLocations(locations: Location[]) {
    this.pastLocations = locations;
    this.dumpToSessionStorage();
  }

  private dumpToSessionStorage() {
    sessionStorage.setItem(this.key, JSON.stringify(this.pastLocations));
  }
}

const pastLocations = new PathLocationManager();

export function updatePastLocations(location: Location, action: Action) {
  switch (action) {
    case "PUSH":
      // first location when app loads and when pushing onto history
      pastLocations.push(location);
      break;
    case "REPLACE":
      // only when using history.replace
      pastLocations.setLocation(pastLocations.length() - 1, location);
      break;
    case "POP": {
      // happens when using the back button, or forward button
      pastLocations.pop();
      // location according to pastLocations
      const appLocation = pastLocations.getLocation(pastLocations.length() - 1);
      if (!(appLocation && appLocation.key === location.key)) {
        // If the current location doesn't match what the app thinks is the current location,
        // blow up the app history.
        pastLocations.setLocations([location]);
      }
      break;
    }
    default:
  }
}

function isPreviousLocationWithinApp(): boolean {
  return pastLocations.length() > 1;
}

export function goBackOrPush(location: Path, state?: LocationState): void {
  if (isPreviousLocationWithinApp()) {
    history.goBack();
  } else {
    history.push(location, state);
  }
}
