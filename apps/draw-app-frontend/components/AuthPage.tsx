"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Mail, Lock, User, ArrowRight, LogIn, UserPlus, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { signup, signin, storeToken } from "@/lib/api";

export function AuthPage({ isSignin }: { isSignin: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isSignin) {
        // Sign in
        const response = await signin({
          username: email,
          password,
        });
        
        // Store token
        storeToken(response.token);
        
        // Redirect to home or dashboard
        router.push("/");
      } else {
        // Sign up
        await signup({
          username: email,
          name,
          password,
        });
        
        // After successful signup, automatically sign in
        try {
          const signinResponse = await signin({
            username: email,
            password,
          });
          
          storeToken(signinResponse.token);
          router.push("/");
        } catch {
          // If auto signin fails, redirect to signin page
          router.push("/signin");
        }
      }
    } catch (err) {
      // Handle error
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
      
      <div className="w-full max-w-md relative z-10">
        <Card className="border-2 shadow-2xl">
          <CardHeader className="space-y-1 text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                {isSignin ? (
                  <LogIn className="h-6 w-6 text-primary" />
                ) : (
                  <UserPlus className="h-6 w-6 text-primary" />
                )}
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">
              {isSignin ? "Welcome back" : "Create an account"}
            </CardTitle>
            <CardDescription className="text-base">
              {isSignin
                ? "Sign in to your account to continue"
                : "Enter your information to get started"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isSignin && (
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-foreground flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError(null);
                    }}
                    required={!isSignin}
                    disabled={isLoading}
                    className="w-full px-4 py-3 rounded-lg border-2 border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-lg border-2 border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground flex items-center gap-2"
                >
                  <Lock className="h-4 w-4" />
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  required
                  minLength={8}
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-lg border-2 border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {!isSignin && (
                  <p className="text-xs text-muted-foreground">
                    Must be at least 8 characters
                  </p>
                )}
              </div>

              {isSignin && (
                <div className="flex items-center justify-end">
                  <Link
                    href="#"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isLoading}
                className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {isSignin ? "Signing in..." : "Creating account..."}
                  </>
                ) : (
                  <>
                    {isSignin ? "Sign in" : "Create account"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                {isSignin ? (
                  <>
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/signup"
                      className="font-semibold text-primary hover:underline"
                    >
                      Sign up
                    </Link>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <Link
                      href="/signin"
                      className="font-semibold text-primary hover:underline"
                    >
                      Sign in
                    </Link>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
