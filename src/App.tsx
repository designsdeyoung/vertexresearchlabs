import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { InquiryCartProvider } from "@/contexts/InquiryCartContext";
import { ComplianceProvider } from "@/contexts/ComplianceContext";
import InquiryCart from "@/components/InquiryCart";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import ResearchAccess from "./pages/ResearchAccess";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Disclaimer from "./pages/Disclaimer";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Shipping from "./pages/Shipping";
import Quality from "./pages/Quality";
import TestingCOAs from "./pages/TestingCOAs";
import Methods from "./pages/Methods";
import ChainOfCustody from "./pages/ChainOfCustody";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ComplianceProvider>
          <InquiryCartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <InquiryCart />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/product/:productId" element={<ProductDetail />} />
                <Route path="/research-access" element={<ResearchAccess />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/disclaimer" element={<Disclaimer />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/shipping" element={<Shipping />} />
                <Route path="/quality" element={<Quality />} />
                <Route path="/quality/testing" element={<TestingCOAs />} />
                <Route path="/quality/methods" element={<Methods />} />
                <Route path="/quality/chain-of-custody" element={<ChainOfCustody />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </InquiryCartProvider>
        </ComplianceProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
