import { history } from "../App";

export default function logout(callback) {
  window.localStorage.clear();
  history.push("/login");
  if (callback) callback();
}
