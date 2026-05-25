import { useState } from 'react';
import { loginUser, registerUser } from '../services/userService.js';

function LoginRegistrationForm() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true); // true for login, false for registration
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (isLogin) {
                await loginUser(email, password);
                console.log('login successful');
            } else {
                await registerUser(username, email, password);
                console.log('registration successful');
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    function changeForm() {
        setIsLogin(!isLogin);
        setError(null);
        setEmail('');
        setPassword('');
    }

    function getMessage() {
        if (isLogin) {
            return <p>No account? <a onClick={changeForm}>Sign up!</a></p>;
        } else {
            return <p>Already have an account? <a onClick={changeForm}>Sign in!</a></p>;
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            {!isLogin && (
                <>
                    <label>
                        <input type='text' value={username} placeholder='Username' onChange={e => setUsername(e.target.value)}/>
                    </label><br/>
                </>
            )}
            <label>
                <input type='email' value={email} placeholder='Email' onChange={e => setEmail(e.target.value)}/>
            </label><br/>
            <label>
                <input type='password' value={password} placeholder='Password' onChange={e => setPassword(e.target.value)}/>
            </label><br/>
            <span style={{ color: 'red'}}>{error}</span>
            {getMessage()}
            <button type='submit' disabled={loading}>{loading ? 'Loading...' : (isLogin ? 'Log in' : 'Register')}</button>
        </form>
    );
}

export default LoginRegistrationForm;