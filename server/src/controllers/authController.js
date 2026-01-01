import User from '../models/user.js';
import bcrypt from 'bcrypt';

function login(req, res) {
  const { email, password } = req.body;
  User.findOne({ email })
    .then(user => {
      if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      res.json({ message: 'Login successful' });
    });
}

function register(req, res) {
  const { name, email, password } = req.body;
  const passwordHash = bcrypt.hashSync(password, 10);
  User.create({ name, email, passwordHash: passwordHash })
    .then(user => {
      res.status(201).json({ message: 'User registered successfully', user });
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
}

export { login, register };