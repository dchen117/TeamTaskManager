import { useState } from "react";
import AuthForm from "../components/AuthForm.jsx";
import { authFields } from "../components/AuthFields.js";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../services/AuthContext.jsx";

const registrationFields = [
  authFields.displayname,
  authFields.username,
  authFields.email,
  authFields.password,
  authFields.confirmPassword,
];

export default function Registration() {
  const [values, setValues] = useState({});
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  function handleChange(e) {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await register(values.displayname, values.username, values.email, values.password, values.confirmPassword);
    console.log('Registration successful');
    navigate('/home');
  }

  return (
    <AuthForm
      fields={registrationFields}
      values={values}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitLabel="Register"
      message={<p>Already have an account? <a href="/">Sign in!</a></p>}
    />
  );
}