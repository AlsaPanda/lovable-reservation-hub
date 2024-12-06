import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const Login = () => {
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate token validation
    if (token.length > 0) {
      localStorage.setItem("auth_token", token);
      toast.success("Connexion réussie");
      navigate("/dashboard");
    } else {
      toast.error("Token invalide");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-primary">
            Schmidt & Cuisinella
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="token" className="text-sm font-medium text-gray-700">
                Token d'authentification
              </label>
              <Input
                id="token"
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Entrez votre token"
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              Se connecter
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;