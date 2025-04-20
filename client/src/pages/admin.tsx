import AdminPanel from "@/components/admin/index";
import { useParams } from "wouter";

export default function AdminPage() {
  const params = useParams();
  const tab = params?.tab || "users";
  
  return <AdminPanel tab={tab} />;
}