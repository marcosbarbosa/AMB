import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contato" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  );
}

export default App;
