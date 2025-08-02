import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IndexWithSupabase from "./pages/Index-with-supabase";
import IndexSimple from "./pages/Index-simple";
import IndexDebug from "./pages/Index-debug";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppWorking = () => {
  console.log("AppWorking is rendering");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<IndexWithSupabase />} />
            <Route path="/debug" element={<IndexDebug />} />
            <Route path="/simple" element={<IndexSimple />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default AppWorking; 