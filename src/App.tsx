import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Loader2 } from "lucide-react";
import { InquiryCartProvider } from "@/contexts/InquiryCartContext";
import { ComplianceProvider } from "@/contexts/ComplianceContext";
import { AuthProvider } from "@/contexts/AuthContext";
import InquiryCart from "@/components/InquiryCart";
import ScrollToTop from "@/components/ScrollToTop";
import RequireResearchAccess from "@/components/RequireResearchAccess";
import ReferralCapture from "@/components/ReferralCapture";
import ChatWidget from "@/components/ChatWidget";
// Landing page stays eager for the fastest first paint; every other route is
// code-split so it only downloads when visited.
import Index from "./pages/Index";

const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const ResearchAccess = lazy(() => import("./pages/ResearchAccess"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const Disclaimer = lazy(() => import("./pages/Disclaimer"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Shipping = lazy(() => import("./pages/Shipping"));
const Quality = lazy(() => import("./pages/Quality"));
const TestingCOAs = lazy(() => import("./pages/TestingCOAs"));
const Methods = lazy(() => import("./pages/Methods"));
const ChainOfCustody = lazy(() => import("./pages/ChainOfCustody"));
const Auth = lazy(() => import("./pages/Auth"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Learn = lazy(() => import("./pages/Learn"));
const TrackOrder = lazy(() => import("./pages/TrackOrder"));
const ArticlePage = lazy(() => import("./pages/ArticlePage"));
const Fulfillment = lazy(() => import("./pages/Fulfillment"));
const CashOrder = lazy(() => import("./pages/admin/CashOrder"));
const Welcome = lazy(() => import("./pages/Welcome"));
const Magic = lazy(() => import("./pages/Magic"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const RouteFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <Loader2 className="h-6 w-6 animate-spin text-primary" aria-label="Loading" />
  </div>
);

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <ComplianceProvider>
            <InquiryCartProvider>
              <Toaster />
              <Sonner />
                <BrowserRouter>
                <ScrollToTop />
                <ReferralCapture />
                <InquiryCart />
                <ChatWidget />
                <Suspense fallback={<RouteFallback />}>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <RequireResearchAccess>
                        <Index />
                      </RequireResearchAccess>
                    }
                  />
                  <Route
                    path="/product/:productId"
                    element={
                      <RequireResearchAccess>
                        <ProductDetail />
                      </RequireResearchAccess>
                    }
                  />
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
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/learn" element={<Learn />} />
                  <Route path="/track" element={<TrackOrder />} />
                  <Route path="/learn/:slug" element={<ArticlePage />} />
                  <Route path="/fulfillment" element={<Fulfillment />} />
                  <Route path="/admin/cash-order" element={<CashOrder />} />
                  <Route path="/welcome" element={<Welcome />} />
                  <Route path="/magic" element={<Magic />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                </Suspense>
              </BrowserRouter>
            </InquiryCartProvider>
          </ComplianceProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
