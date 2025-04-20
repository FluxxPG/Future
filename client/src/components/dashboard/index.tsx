import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Helmet } from 'react-helmet';
import { useToast } from "@/hooks/use-toast";
import Sidebar from "./sidebar";
import Overview from "./overview";
import Analytics from "./analytics";
import PaymentLinks from "./payment-links";
import Subscriptions from "./subscriptions";
import ApiKeys from "./api-keys";
import Kyc from "./kyc";

export default function Dashboard({ tab = "overview" }) {
  const [currentTab, setCurrentTab] = useState(tab);
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Update URL when tab changes
  useEffect(() => {
    if (tab !== currentTab) {
      setCurrentTab(tab);
    }
  }, [tab]);

  // Redirect if changing from the URL
  useEffect(() => {
    if (currentTab !== tab) {
      setLocation(`/dashboard/${currentTab}`);
    }
  }, [currentTab, setLocation]);

  // Simple auth check (in a real app, this would be more sophisticated)
  useEffect(() => {
    // This is just a placeholder - real auth would use JWT or similar
    const isLoggedIn = localStorage.getItem("fluxpay_user");
    
    if (!isLoggedIn) {
      toast({
        title: "Authentication required",
        description: "Please log in to access the dashboard",
        variant: "destructive"
      });
      setLocation("/login?redirect=/dashboard");
    }
  }, []);

  // Render active tab content
  const renderTabContent = () => {
    switch (currentTab) {
      case "overview":
        return <Overview />;
      case "analytics":
        return <Analytics />;
      case "payment-links":
        return <PaymentLinks />;
      case "subscriptions":
        return <Subscriptions />;
      case "api-keys":
        return <ApiKeys />;
      case "kyc":
        return <Kyc />;
      default:
        return <Overview />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Dashboard | FluxPay</title>
      </Helmet>
      <div className="flex h-screen bg-background overflow-hidden">
        <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
        
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="container mx-auto px-4 py-6">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </>
  );
}
