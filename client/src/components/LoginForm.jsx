import { useState } from 'react';
import { loginUser } from '../services/userService.js';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Logging in with', email, password);
        loginUser(email, password)
            .then(res => {
                console.log('Login successful', res);
            })
            .catch(error => {
                console.error('Login failed:', error);
            });
    };

    return <form>
        <label>
            <input type='email' value={email} placeholder='Email' onChange={e => setEmail(e.target.value)}/>
        </label><br/>
        <label>
            <input type='password' value={password} placeholder='Password' onChange={e => setPassword(e.target.value)}/>
        </label><br/>
        <button type='submit' onClick={handleSubmit}>Login</button>
    </form>
}

export default LoginForm;