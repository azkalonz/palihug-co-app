export default function logout() {
  window.localStorage.clear();
  window.location = "/";
}
