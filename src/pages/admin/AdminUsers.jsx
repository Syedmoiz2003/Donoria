import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { adminApi } from "@/lib/api";
import { ArrowLeft, Users, ShieldAlert, CheckCircle2, Ban, Search, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

const AdminUsers = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ur';
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error(isRtl ? "صارفین لوڈ کرنے میں ناکامی" : "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, isActive) => {
    try {
      setActionLoading(id);
      if (isActive) {
        await adminApi.suspendUser(id);
        toast.success(isRtl ? "صارف کو کامیابی سے بلاک کر دیا گیا ہے۔" : "User suspended successfully!");
      } else {
        await adminApi.activateUser(id);
        toast.success(isRtl ? "صارف کو کامیابی سے بحال کر دیا گیا ہے۔" : "User activated successfully!");
      }
      
      // Update local state
      setUsers(prev => prev.map(u => u.id === id ? { ...u, is_active: !isActive } : u));
    } catch (error) {
      console.error("Action failed:", error);
      toast.error(isRtl ? "کارروائی مکمل نہیں ہو سکی" : "Failed to update user status");
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = users.filter(u => 
    u.role !== 'admin' && (
      (u.full_name || "").toLowerCase().includes(search.toLowerCase()) || 
      (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.role || "").toLowerCase().includes(search.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
            placeholder={isRtl ? "صارف کا نام یا ای میل تلاش کریں..." : "Search user by name or email..."}
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
                    {(user.full_name || "U").charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground flex items-center gap-2 flex-wrap">
                      <span>{user.full_name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        user.role === "hospital" ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary"
                      }`}>
                        {user.role}
                      </span>
                    </h3>
                    <p className="text-xs text-muted-foreground">{user.email} • {new Date(user.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    user.is_active ? "text-success" : "text-destructive"
                  }`}>
                    {user.is_active ? (isRtl ? "فعال" : "Active") : (isRtl ? "معطل" : "Suspended")}
                  </span>
                  
                  <Button 
                    onClick={() => handleToggleStatus(user.id, user.is_active)} 
                    variant={user.is_active ? "destructive" : "success"}
                    size="sm"
                    className="ml-auto sm:ml-0 gap-1.5"
                    disabled={actionLoading === user.id}
                  >
                    {actionLoading === user.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : user.is_active ? (
                      <Ban className="w-3.5 h-3.5" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {user.is_active 
                        ? (isRtl ? "بلاک کریں" : "Suspend") 
                        : (isRtl ? "فعال کریں" : "Activate")}
                    </span>
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
