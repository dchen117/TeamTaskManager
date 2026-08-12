import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useState, useContext } from "react"
import { AuthContext } from "@/contexts/AuthContext.jsx"
import { useNavigate, Link } from "react-router-dom"

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
  FieldError,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useQueryClient } from "@tanstack/react-query"
import { getWorkspaces } from "@/services/workspaces"

export function LoginForm({
  className,
  ...props
}) {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      // fetch the workspaces and projects before navigating to home page
      await queryClient.fetchQuery({
        queryKey: ["workspaces"],
        queryFn: () => getWorkspaces(),
      });      
      navigate('/workspaces');
    }
    catch (error) {
      setError(error.message);
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email" className={error ? "text-red-400" : ""}>
                  Email
                </FieldLabel>
                <Input id="email" type="email" placeholder="m@example.com" onChange={(e) => setEmail(e.target.value)} required aria-invalid={!!error} />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password" className={error ? "text-red-400" : ""}>
                    Password
                  </FieldLabel>
                  <a
                    href="#"  
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" onChange={(e) => setPassword(e.target.value)} required aria-invalid={!!error} />
                <FieldError>{error}</FieldError>
              </Field>
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? (<><Spinner data-icon="inline-start" className="text-black"  /> Logging in...</>) : 'Login'}
                </Button>
                {/* <Button variant="outline" type="button">
                  Login with Google
                </Button> */}
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <Link to="/register">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
