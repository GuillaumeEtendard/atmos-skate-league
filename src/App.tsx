import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EventSlotProvider } from "./contexts/EventSlotContext";
import Index from "./pages/Index";
import Registration from "./pages/Registration";
import RegistrationSpectateur from "./pages/RegistrationSpectateur";
import Confirmation from "./pages/Confirmation";
import ConfirmationSpectateur from "./pages/ConfirmationSpectateur";
import Admin from "./pages/Admin";
import AdminSpectateurs from "./pages/AdminSpectateurs";
import AdminStock from "./pages/AdminStock";
import TestRegistration from "./pages/TestRegistration";
import InscriptionLibre from "./pages/InscriptionLibre";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <EventSlotProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/inscription" element={<Registration />} />
            <Route path="/inscription/:eventId" element={<Registration />} />
            <Route path="/inscription-spectateur/:eventId" element={<RegistrationSpectateur />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/confirmation-spectateur" element={<ConfirmationSpectateur />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin-spectateurs" element={<AdminSpectateurs />} />
            <Route path="/admin-stock" element={<AdminStock />} />
            <Route path="/test" element={<TestRegistration />} />
            <Route path="/inscription-libre/:eventId" element={<InscriptionLibre />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </EventSlotProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
