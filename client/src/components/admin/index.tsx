import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Helmet } from 'react-helmet';
import { useToast } from "@/hooks/use-toast";
import Sidebar from "./sidebar";
import Users from "./users";
import Merchants from "./merchants";
import Integrations from "./integrations";
import Cms from "./cms";
import FraudSettings from "./fraud-settings";

export default function AdminPanel({ tab = "users" }) {
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
      setLocation(`/admin/${currentTab}`);
    }
  }, [currentTab, setLocation]);

  // Simple auth check (in a real app, this would be more sophisticated)
  useEffect(() => {
    // This is just a placeholder - real auth would use JWT or similar
    const isLoggedIn = localStorage.getItem("fluxpay_user");
    
    if (!isLoggedIn) {
      toast({
        title: "Authentication required",
        description: "Please log in to access the admin panel",
        variant: "destructive"
      });
      setLocation("/login?redirect=/admin");
      return;
    }
    
    // Check if the user is an admin
    const userData = JSON.parse(localStorage.getItem("fluxpay_user") || "{}");
    if (userData.role !== "admin") {
      toast({
        title: "Access denied",
        description: "You don't have permission to access the admin panel",
        variant: "destructive"
      });
      setLocation("/dashboard");
    }
  }, []);

  // Render active tab content
  const renderTabContent = () => {
    switch (currentTab) {
      case "users":
        return <Users />;
      case "merchants":
        return <Merchants />;
      case "integrations":
        return <Integrations />;
      case "cms":
        return <Cms />;
      case "fraud-settings":
        return <FraudSettings />;
      default:
        return <Users />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Panel | FluxPay</title>
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
