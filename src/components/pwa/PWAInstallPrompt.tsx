import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { usePWA } from '@/hooks/usePWA';
import { 
  Download, 
  Smartphone, 
  Wifi, 
  WifiOff, 
  Zap, 
  Shield, 
  X,
  Check
} from 'lucide-react';
import { toast } from 'sonner';

export default function PWAInstallPrompt() {
  const { isInstallable, isInstalled, isOnline, installApp } = usePWA();
  const [showPrompt, setShowPrompt] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Mostrar prompt de instalación después de un tiempo si es instalable
    if (isInstallable && !isInstalled && !dismissed) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 10000); // Mostrar después de 10 segundos

      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled, dismissed]);

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      toast.success('¡App instalada correctamente!');
      setShowPrompt(false);
    } else {
      toast.error('Error al instalar la app');
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    // Recordar que el usuario dismissió el prompt
    localStorage.setItem('pwa_install_dismissed', 'true');
  };

  const features = [
    {
      icon: <Zap className="h-5 w-5 text-yellow-500" />,
      title: 'Acceso instantáneo',
      description: 'Inicia el juego desde tu pantalla de inicio'
    },
    {
      icon: <WifiOff className="h-5 w-5 text-blue-500" />,
      title: 'Juega sin internet',
      description: 'Modo offline con todas las funciones básicas'
    },
    {
      icon: <Smartphone className="h-5 w-5 text-green-500" />,
      title: 'Experiencia nativa',
      description: 'Interfaz optimizada para móvil y escritorio'
    },
    {
      icon: <Shield className="h-5 w-5 text-purple-500" />,
      title: 'Seguro y rápido',
      description: 'Sin necesidad de tiendas de aplicaciones'
    }
  ];

  // Mini prompt flotante
  if (isInstallable && !isInstalled && !showPrompt && !dismissed) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="shadow-xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Download className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  Instalar STOP Game
                </p>
                <p className="text-xs text-gray-600">
                  Acceso rápido desde tu inicio
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => setShowPrompt(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Dialog principal de instalación
  return (
    <>
      <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <div className="p-2 bg-red-100 rounded-full">
                  <img src="/images/STOP.jpg" alt="STOP" className="w-6 h-6" />
                </div>
                Instalar STOP Game
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Instala STOP Game como una aplicación en tu dispositivo para una mejor experiencia
              </p>
              
              <div className="flex justify-center gap-2 mb-4">
                <Badge variant={isOnline ? "default" : "secondary"} className="text-xs">
                  {isOnline ? (
                    <>
                      <Wifi className="h-3 w-3 mr-1" />
                      Conectado
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-3 w-3 mr-1" />
                      Sin conexión
                    </>
                  )}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  PWA Ready
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 rounded-lg text-center"
                >
                  <div className="flex justify-center mb-2">
                    {feature.icon}
                  </div>
                  <h4 className="text-sm font-medium text-gray-800 mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleInstall}
                className="w-full bg-red-600 hover:bg-red-700"
                size="lg"
              >
                <Download className="h-5 w-5 mr-2" />
                Instalar aplicación
              </Button>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowFeatures(true)}
                  className="flex-1"
                  size="sm"
                >
                  Ver características
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleDismiss}
                  className="flex-1"
                  size="sm"
                >
                  No, gracias
                </Button>
              </div>
            </div>

            <div className="text-center text-xs text-gray-500">
              💡 La instalación no requiere tiendas de aplicaciones
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de características detalladas */}
      <Dialog open={showFeatures} onOpenChange={setShowFeatures}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Características de la App</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="mt-0.5">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                <Check className="h-4 w-4" />
                Beneficios adicionales
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Notificaciones push para invitaciones</li>
                <li>• Almacenamiento local de puntuaciones</li>
                <li>• Sincronización automática cuando hay conexión</li>
                <li>• Menor uso de datos móviles</li>
                <li>• Carga más rápida</li>
              </ul>
            </div>
            
            <Button
              onClick={() => {
                setShowFeatures(false);
                handleInstall();
              }}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              <Download className="h-5 w-5 mr-2" />
              Instalar ahora
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}