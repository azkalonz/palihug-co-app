import axios from "axios";

const DOMAIN = "http://localhost";
const SOCKET_DOMAIN = "http://localhost:3001";

const Api = {
  get: (ENDPOINT, params = {}) =>
    axios
      .get(DOMAIN + ENDPOINT, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + Api.token,
        },
        cancelToken: new axios.CancelToken(function executor(c) {
          let url = window.location.pathname;
          params.cancelToken && params.cancelToken(c);
          window.onclick = () => {
            if (url !== window.location.pathname) {
              c();
            }
          };
        }),
        ...params.config,
      })
      .then((resp) => resp.data),
  post: (ENDPOINT, params = {}) => {
    return axios
      .post(DOMAIN + ENDPOINT, params.body, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + Api.token,
          ...params.headers,
        },
        onUploadProgress: (progressEvent) =>
          params.onUploadProgress
            ? params.onUploadProgress(progressEvent)
            : progressEvent,
        cancelToken: new axios.CancelToken(function executor(c) {
          if (params.cancelToken) params.cancelToken(c);
        }),
        ...params.config,
      })
      .then((resp) => resp.data);
  },
  delete: (ENDPOINT, params = {}) => {
    return axios
      .delete(DOMAIN + ENDPOINT, params.body, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + Api.token,
          ...params.headers,
        },
        ...params.config,
      })
      .then((resp) => resp.data);
  },
  auth: async (callback = {}) => {
    if (localStorage["auth"]) {
      let u = JSON.parse(localStorage["auth"]);
      Api.token = u.token;
      let res = await Api.post("/users/auth", {
        body: { token: Api.token },
      }).catch((e) => {
        callback.fail && callback.fail(e);
      });
      if (res?.success) {
        return callback.success ? callback.success(res) : res;
      }
    }
    localStorage.removeItem("auth");
    callback.fail && callback.fail();
    if (
      window.location.pathname !== "/login" &&
      window.location.pathname !== "/login/"
    )
      window.location = "/login?r=" + window.location.pathname;
  },
};

export const SocketApi = {
  get: (ENDPOINT, params = {}) =>
    axios
      .get(SOCKET_DOMAIN + ENDPOINT, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + Api.token,
        },
        cancelToken: new axios.CancelToken(function executor(c) {
          let url = window.location.pathname;
          params.cancelToken && params.cancelToken(c);
          window.onclick = () => {
            if (url !== window.location.pathname) {
              c();
            }
          };
        }),
        ...params.config,
      })
      .then((resp) => resp.data),
  post: (ENDPOINT, params = {}) => {
    return axios
      .post(SOCKET_DOMAIN + ENDPOINT, params.body, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + Api.token,
          ...params.headers,
        },
        onUploadProgress: (progressEvent) =>
          params.onUploadProgress
            ? params.onUploadProgress(progressEvent)
            : progressEvent,
        cancelToken: new axios.CancelToken(function executor(c) {
          if (params.cancelToken) params.cancelToken(c);
        }),
        ...params.config,
      })
      .then((resp) => resp.data);
  },
  auth: async (callback = {}) => {
    if (localStorage["auth"]) {
      let u = JSON.parse(localStorage["auth"]);
      Api.token = u.token;
      let res = await Api.post("/users/auth", {
        body: { token: Api.token },
      }).catch((e) => {
        callback.fail && callback.fail(e);
      });
      if (res?.success) {
        return callback.success ? callback.success(res) : res;
      }
    }
    localStorage.removeItem("auth");
    callback.fail && callback.fail();
    if (
      window.location.pathname !== "/login" &&
      window.location.pathname !== "/login/"
    )
      window.location = "/login?r=" + window.location.pathname;
  },
};
export default Api;
