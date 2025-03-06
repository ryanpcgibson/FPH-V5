import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabaseClient } from "../db/supabaseClient";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (error) throw error;
      navigate("/app");
    } catch (err) {
      setError("Invalid credentials or user does not exist");
    } finally {
      form.reset({ email: values.email, password: "" });
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
    console.log("Base URL:", baseUrl); // For debugging

    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${baseUrl}/app`,
        queryParams: {
          prompt: "select_account",
        },
        // Ensure we return to the same site we started from
        skipBrowserRedirect: false,
        flowType: "pkce",
      },
    });

    if (error) {
      console.error("Error logging in with Google:", error.message);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Loading..." : "Sign in"}
        </Button>
        <Button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full"
          variant="outline"
        >
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            class="LgbsSe-Bz112c"
          >
            <g>
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              ></path>
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              ></path>
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              ></path>
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              ></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </g>
          </svg>
          Sign in with Google
        </Button>
      </form>
    </Form>
  );
}

export default LoginForm;

{
  /* <body class="qJTHM"><div id="container" class="haAclf" style="padding: 6px 10px;"><div tabindex="0" role="button" aria-labelledby="button-label" class="nsm7Bb-HzV7m-LgbsSe  pSzOP-SxQuSe i5vt6e-Ia7Qfc uaxL4e-RbRzK"><div class="nsm7Bb-HzV7m-LgbsSe-MJoBVe"></div><div class="nsm7Bb-HzV7m-LgbsSe-bN97Pc-sM5MNb "><div class="nsm7Bb-HzV7m-LgbsSe-Bz112c"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="LgbsSe-Bz112c"><g><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></g></svg></div><span class="nsm7Bb-HzV7m-LgbsSe-BPrWId">Sign in with Google</span><span class="L6cTce" id="button-label">Sign in with Google</span></div></div></div><script nonce="">gis.provider.button.bootstrap('CiIKFlNTMjB4eWE2M193OWtwUnV4Q3dENlESBHdhcm4aAmVuGsMBCkg2MTIzNTg1NTcwNjItcGxvOG4xNjA1ZnQzNmR1Zmo4YW9tZW9hMGRjNHUzZW0uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20SMmh0dHBzOi8vZGV2ZWxvcGVycy1kb3QtZGV2c2l0ZS12Mi1wcm9kLmFwcHNwb3QuY29tGipkZXZlbG9wZXJzLWRvdC1kZXZzaXRlLXYyLXByb2QuYXBwc3BvdC5jb206F2FtaWVscmV2ZWNoZUBnb29nbGUuY29tIhFnc2lfNzk4NDcxXzUxMDAwODIOCAIQARgBKAIwATgBUAE\x3d');</script></body> */
}
