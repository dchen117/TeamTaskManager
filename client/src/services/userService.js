import api, {setAccessToken} from './api';

async function loginUser(email, password) {
  try {
    const res = await api.post('/auth/login', { email, password });
    const accessToken = res.data.accessToken;
    setAccessToken(accessToken);
  } catch (error) {
    const message = error.response?.data?.error || error.message || 'Something went wrong';
    throw new Error(message);
  }
}

async function registerUser(name, email, password) {
  try {
    await api.post('/auth/register', { name, email, password });
  } catch (error) {
    const message = error.response?.data?.error || error.message || 'Something went wrong';
    throw new Error(message);
  }
}

async function logoutUser() {
  await api.post('/auth/logout');
}

export { loginUser, registerUser, logoutUser };