import api, {setAccessToken} from './api';

async function loginUser(email, password) {
  try {
    const res = await api.post('/auth/login', { email, password });
    const accessToken = res.data.accessToken;
    setAccessToken(accessToken);
  } catch (error) {
    throw new Error(error.response.data.error);
  }
}

async function registerUser(username, email, password) {
  try {
    await api.post('/auth/register', { username, email, password });
  } catch (error) {
    throw new Error(error.response.data.error);
  }
}

async function logoutUser() {
  await api.post('/auth/logout');
}

export { loginUser, registerUser, logoutUser };