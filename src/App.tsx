import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Index';
import GameCategories from './pages/GameCategories';
import GamePlay from './pages/GamePlay';
import PrivateRoom from './pages/PrivateRoom';
import Leaderboard from './pages/Leaderboard';
import NotFound from './pages/NotFound';
import { AuthProvider } from './lib/auth';

const queryClient = new QueryClient();

const App = () => {
  console.log('App component loaded');
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter basename="/">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/categories" element={<GameCategories />} />
              <Route path="/play" element={<GamePlay />} />
              <Route path="/private" element={<PrivateRoom />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
