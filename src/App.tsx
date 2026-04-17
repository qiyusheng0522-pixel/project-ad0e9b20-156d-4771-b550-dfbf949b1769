import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import DoctorDashboard from "./pages/DoctorDashboard.tsx";
import NurseLayout from "./pages/nurse/NurseLayout.tsx";
import NurseHome from "./pages/nurse/NurseHome.tsx";
import NurseTasks from "./pages/nurse/NurseTasks.tsx";
import NurseHandover from "./pages/nurse/NurseHandover.tsx";
import NurseEducation from "./pages/nurse/NurseEducation.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/nurse" element={<NurseLayout />}>
            <Route index element={<NurseHome />} />
            <Route path="tasks" element={<NurseTasks />} />
            <Route path="handover" element={<NurseHandover />} />
            <Route path="education" element={<NurseEducation />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

