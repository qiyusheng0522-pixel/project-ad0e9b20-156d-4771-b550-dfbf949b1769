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
import NursePatients from "./pages/nurse/NursePatients.tsx";
import NursePatientDetail from "./pages/nurse/NursePatientDetail.tsx";
import NurseHandover from "./pages/nurse/NurseHandover.tsx";
import NurseEducation from "./pages/nurse/NurseEducation.tsx";
import NurseChat from "./pages/nurse/NurseChat.tsx";
import NurseChatList from "./pages/nurse/NurseChatList.tsx";
import NursePlans from "./pages/nurse/NursePlans.tsx";
import NurseProfile from "./pages/nurse/NurseProfile.tsx";
import CommunityLayout from "./pages/community/CommunityLayout.tsx";
import CommunityHome from "./pages/community/CommunityHome.tsx";
import CommunityPatients from "./pages/community/CommunityPatients.tsx";
import CommunityEducation from "./pages/community/CommunityEducation.tsx";
import CommunityMessages from "./pages/community/CommunityMessages.tsx";
import CommunityChat from "./pages/community/CommunityChat.tsx";

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
            <Route path="patients" element={<NursePatients />} />
            <Route path="patients/:id" element={<NursePatientDetail />} />
            <Route path="handover" element={<NurseHandover />} />
            <Route path="education" element={<NurseEducation />} />
            <Route path="chat" element={<NurseChatList />} />
            <Route path="chat/:type/:id" element={<NurseChat />} />
            <Route path="plans" element={<NursePlans />} />
            <Route path="profile" element={<NurseProfile />} />
          </Route>
          <Route path="/community" element={<CommunityLayout />}>
            <Route index element={<CommunityHome />} />
            <Route path="patients" element={<CommunityPatients />} />
            <Route path="education" element={<CommunityEducation />} />
            <Route path="messages" element={<CommunityMessages />} />
            <Route path="chat/:type/:id" element={<CommunityChat />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

