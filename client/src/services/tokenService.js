let accessToken = null;
let logoutHandler = null;

 const setAccessToken = (token) => {
  accessToken = token;
};

const getAccessToken = () => accessToken;

const registerLogoutHandler = (fn) => {
  logoutHandler = fn;
}

const notifyLogout = () => {
  logoutHandler?.();
}

export { setAccessToken, getAccessToken, registerLogoutHandler, notifyLogout };