import api from './api';

async function loginUser(email, password) {
  const res = await api.post('/auth/login', { email, password });
  if (res.status === 401) {
    throw new Error('Invalid email or password');
  }
  const accessToken = res.data.accessToken;
  return accessToken;
}

async function registerUser(username, email, password) {
  const res = await api.post('/auth/register', { username, email, password });
  if (res.status === 400) {
    throw new Error('Email already in use');
  } else if (res.status === 500) {
    throw new Error('Server error during registration: ' + res.data.error);
  }
}

async function logoutUser() {
  await api.post('/auth/logout');
}

export { loginUser, registerUser, logoutUser };