import { useState, type FormEvent } from "react";
import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) throw redirect({ to: "/admin" });
  },
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back.");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
        toast.success("Account created.");
      }
      navigate({ to: "/admin", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-scope flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#D61F3A]/15 ring-1 ring-[#D61F3A]/30">
            <ShieldCheck className="h-5 w-5 text-[#D61F3A]" />
          </div>
          <h1 className="text-xl font-semibold text-white">PROFIRA Back Office</h1>
          <p className="mt-1 text-sm text-[#B8B8B8]">Internal access only</p>
        </div>
        <form onSubmit={onSubmit} className="admin-card space-y-4 p-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#B8B8B8]">Email</Label>
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-[#1F2024] bg-[#0B0C10] text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#B8B8B8]">Password</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-[#1F2024] bg-[#0B0C10] text-white"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D61F3A] text-white hover:bg-[#B8172F]"
          >
            {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </Button>
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="block w-full text-center text-xs text-[#B8B8B8] hover:text-white"
          >
            {mode === "signin" ? "First admin? Create the bootstrap account →" : "Have an account? Sign in"}
          </button>
        </form>
        <p className="mt-4 text-center text-[11px] text-[#5b5b5b]">
          The first account created automatically becomes the admin.
        </p>
      </div>
    </div>
  );
}
