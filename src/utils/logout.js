import { history } from "../App";
import { routingRules } from "./route-rules";

export default function logout(callback) {
  window.localStorage.clear();
  routingRules["IF_LOGGED_IN"].set(() => false);
  history.push("/login");
  if (callback) callback();
}
