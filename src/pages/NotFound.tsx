import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { BookOpen, Home } from "lucide-react";
import { useEffect } from "react";

export default function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-fitness-50 to-energy-50 flex items-center justify-center">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-4">
          <BookOpen className="h-24 w-24 mx-auto text-primary" />
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700">
            Page Not Found
          </h2>
          <p className="text-gray-600">
            Sorry, we couldn't find the page you're looking for. The book you're
            looking for might have been moved or doesn't exist.
          </p>
        </div>

        <Button onClick={() => navigate("/")} className="gradient-bg">
          <Home className="h-4 w-4 mr-2" />
          Go back home
        </Button>
      </div>
    </div>
  );
}
