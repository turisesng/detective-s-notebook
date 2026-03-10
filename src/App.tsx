import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "../Index"; // Reverted to your original working path
import SceneAnalysis from "./pages/SceneAnalysis"; 
import WitnessPortal from './pages/WitnessPortal';
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* Dynamic Scene Analysis Route */}
          <Route path="/case/:id" element={<Index />} />
          <Route path="/case/:id/analysis" element={<SceneAnalysis />} />
          <Route path="/case/:id/witnesses" element={<WitnessPortal />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;