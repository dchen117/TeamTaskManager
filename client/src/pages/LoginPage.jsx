import { useState } from "react";
import AuthForm from "../components/AuthForm.jsx";
import { authFields } from "../components/AuthFields.js";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../services/AuthContext.jsx";

const loginFields = [
  authFields.email,
  authFields.password,
];

export default function Login() {
  const [values, setValues] = useState({});
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  function handleChange(e) {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await login(values.email, values.password);
    console.log('login successful');
    navigate('/home');
  }

  return (
    <AuthForm
      fields={loginFields}
      values={values}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitLabel="Login"
      message={<p>No account? <a href="/register">Sign up!</a></p>}
    />
  );
}