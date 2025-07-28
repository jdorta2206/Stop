import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-600 text-white">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Página no encontrada</p>
      <Button 
        onClick={() => navigate('/')}
        className="bg-white text-red-600 hover:bg-white/90"
      >
        Volver al inicio
      </Button>
    </div>
  );
}