import Dashboard from "@/components/dashboard/index";
import { useParams } from "wouter";

export default function DashboardPage() {
  const params = useParams();
  const tab = params?.tab || "overview";
  
  return <Dashboard tab={tab} />;
}