import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Users, ShieldAlert, CheckCircle2, Ban, Search, Check } from "lucide-react";
import { toast } from "sonner";

const mockUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "donor", status: "active", region: "Islamabad" },
  { id: 2, name: "City General Hospital", email: "city@example.com", role: "hospital", status: "active", region: "Lahore" },
  { id: 3, name: "Ayesha Malik", email: "ayesha@example.com", role: "donor", status: "active", region: "Karachi" },
  { id: 4, name: "Metro Health Clinic", email: "metro@example.com", role: "hospital", status: "pending", region: "Rawalpindi" },
  { id: 5, name: "Zainab Bibi", email: "zainab@example.com", role: "donor", status: "blocked", region: "Peshawar" },
];

const AdminUsers = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ur';
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState("");

  const handleToggleStatus = (id, currentStatus) => {
    let newStatus = currentStatus === "active" ? "blocked" : "active";
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
    toast.success(newStatus === "blocked" 
      ? (isRtl ? "صارف کو کامیابی سے بلاک کر دیا گیا ہے۔" : "User blocked successfully!") 
      : (isRtl ? "صارف کو کامیابی سے بحال کر دیا گیا ہے۔" : "User restored successfully!"));
  };

  const filtered = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.region.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin/dashboard" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>{isRtl ? "ڈیش بورڈ پر واپس" : "Back to Dashboard"}</span>
            </Link>
          </Button>
          <h1 className="font-semibold text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            {isRtl ? "صارفین کا انتظام" : "User Administration"}
          </h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Main Container */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={isRtl ? "صارف کا نام، ای میل یا علاقہ تلاش کریں..." : "Search user by name, email or region..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* User List Cards */}
        <div className="space-y-4">
          {filtered.length > 0 ? (
            filtered.map((user) => (
              <div key={user.id} className="healthcare-card !p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
                <div className="flex gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black ${
                    user.role === "hospital" ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary"
                  }`}>
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground flex items-center gap-2 flex-wrap">
                      <span>{user.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        user.role === "hospital" ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary"
                      }`}>
                        {user.role}
                      </span>
                    </h3>
                    <p className="text-xs text-muted-foreground">{user.email} • {user.region}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    user.status === "active" ? "text-success" : "text-destructive"
                  }`}>
                    {user.status}
                  </span>
                  
                  <Button 
                    onClick={() => handleToggleStatus(user.id, user.status)} 
                    variant={user.status === "active" ? "destructive" : "success"}
                    size="sm"
                    className="ml-auto sm:ml-0 gap-1.5"
                  >
                    {user.status === "active" ? (
                      <>
                        <Ban className="w-3.5 h-3.5" />
                        <span>{isRtl ? "بلاک کریں" : "Suspend"}</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{isRtl ? "فعال کریں" : "Activate"}</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 healthcare-card">
              <ShieldAlert className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
              <p className="font-semibold text-foreground">{isRtl ? "کوئی صارف نہیں ملا" : "No users found"}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;
