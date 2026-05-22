import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MessengerButton from "@/components/MessengerButton";

import Home from "@/pages/home";
import About from "@/pages/about";
import MenuPage from "@/pages/menu";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";
import Contact from "@/pages/contact";
import Gallery from "@/pages/gallery";
import Admin from "@/pages/admin";
import LogoPreview from "@/pages/logo-preview";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  const isLogoPreview = typeof window !== "undefined" &&
    window.location.pathname.endsWith("/logo-preview");

  if (isLogoPreview) {
    return <LogoPreview />;
  }

  return (
    <>
      <Navbar />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/menu" component={MenuPage} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route path="/contact" component={Contact} />
        <Route path="/gallery" component={Gallery} />
        <Route path="/admin" component={Admin} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
      <MessengerButton />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
