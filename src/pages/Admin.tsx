/**
 * Admin Login Page Component
 * 
 * Provides authentication for blog administrators to access the dashboard.
 * Uses environment variables for credentials (not suitable for production).
 * 
 * Security Note:
 * - Currently uses basic email/password check with env variables
 * - Session stored in sessionStorage (clears on tab close)
 * - For production, implement proper authentication (OAuth, JWT, etc.)
 * 
 * Environment Variables Required:
 * - VITE_ADMIN_EMAIL: Admin email address
 * - VITE_ADMIN_PASSWORD: Admin password
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const Admin = () => {
  // Form state for email and password inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  /**
   * Handles login form submission
   * - Validates credentials against environment variables
   * - Sets session flag on success
   * - Redirects to dashboard or shows error
   * 
   * @param e - Form submission event
   */
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get admin credentials from environment variables
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    // Basic credential check
    if (email === adminEmail && password === adminPassword) {
      // Store authentication flag in session storage
      sessionStorage.setItem("admin_authenticated", "true");
      toast.success("Login successful!");
      navigate("/admin/dashboard");
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-hero-bg via-primary to-hero-bg px-6">
      <Card className="w-full max-w-md p-8 shadow-luxury">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Login</h1>
          <p className="text-muted-foreground">
            Sign in to manage your blog content
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" size="lg">
            Sign In
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Admin;