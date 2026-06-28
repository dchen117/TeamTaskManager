import { Button } from "@/components/ui/button"
import { useState, useContext } from "react"
import { AuthContext } from "@/contexts/AuthContext.jsx"
import { useNavigate, Link } from "react-router-dom"
import { Spinner } from "@/components/ui/spinner"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function SignupForm({
  ...props
}) {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);
  const [displayname, setDisplayname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register(displayname, username, email, password, confirmPassword);
      console.log('Registration successful');
      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Display Name</FieldLabel>
              <Input id="name" type="text" placeholder="John Doe" onChange={(e) => setDisplayname(e.target.value)} />
            </Field>
            <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <Input id ="username" type="text" placeholder="johndoe" onChange={(e) => setUsername(e.target.value)} required />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" type="email" placeholder="m@example.com" onChange={(e) => setEmail(e.target.value)} required />
              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" onChange={(e) => setPassword(e.target.value)} required />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input id="confirm-password" type="password" onChange={(e) => setConfirmPassword(e.target.value)} required />
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>
            <FieldGroup>
              {error && (
                <Field>
                  <FieldDescription className="text-red-500 text-center">
                    {error}
                  </FieldDescription>
                </Field>
              )}
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? (<><Spinner data-icon="inline-start"/> Creating Account...</>) : 'Create Account'}
                </Button>
                {/* <Button variant="outline" type="button">
                  Sign up with Google
                </Button> */}
                <FieldDescription className="px-6 text-center">
                  Already have an account? <Link to="/login">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
