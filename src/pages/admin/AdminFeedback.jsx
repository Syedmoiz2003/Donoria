import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, MessageSquare, ShieldCheck, Trash2, ShieldAlert, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { adminApi } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";

const AdminFeedback = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ur';
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getFeedback();
      setFeedbacks(data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      toast.error(isRtl ? "تاثرات لوڈ کرنے میں غلطی ہوئی" : "Error loading feedbacks");
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id) => {
    try {
      await adminApi.resolveFeedback(id);
      setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, status: "resolved" } : f));
      toast.success(isRtl ? "تاثرات کو کامیابی سے حل کر دیا گیا ہے!" : "Feedback marked as resolved!");
    } catch (error) {
      console.error("Error resolving feedback:", error);
      toast.error(isRtl ? "تاثرات کو حل کرنے میں غلطی ہوئی" : "Error resolving feedback");
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminApi.deleteFeedback(id);
      setFeedbacks(prev => prev.filter(f => f.id !== id));
      toast.success(isRtl ? "تاثرات کو کامیابی سے حذف کر دیا گیا ہے۔" : "Feedback entry deleted.");
    } catch (error) {
      console.error("Error deleting feedback:", error);
      toast.error(isRtl ? "تاثرات حذف کرنے میں غلطی ہوئی" : "Error deleting feedback");
    }
  };

  const getRelativeTime = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };

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
            <MessageSquare className="w-5 h-5 text-primary" />
            {isRtl ? "صارفین کے تاثرات" : "Feedback Moderation"}
          </h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Main Container */}
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">{isRtl ? "لوڈ ہو رہا ہے..." : "Loading feedback..."}</p>
            </div>
          ) : feedbacks.length > 0 ? (
            feedbacks.map((item) => (
              <div 
                key={item.id} 
                className={`healthcare-card !p-6 border relative overflow-hidden transition-all duration-300 ${
                  item.status === "resolved" ? "opacity-60 border-success/30 bg-success/[0.01]" : "border-border hover:border-primary/30"
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        item.type === "bug" 
                          ? "bg-red-500/10 text-red-500 border border-red-500/20" 
                          : item.type === "complaint" 
                          ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" 
                          : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                      }`}>
                        {item.type}
                      </span>
                      <span className="text-xs text-muted-foreground">{getRelativeTime(item.created_at)}</span>
                    </div>

                    <h4 className="font-bold text-foreground text-sm">
                      {item.users ? `${item.users.full_name || 'User'} (${item.users.role})` : 'Anonymous User'}
                    </h4>
                  </div>

                  <span className={`text-xs font-bold uppercase ${item.status === "resolved" ? "text-success" : "text-muted-foreground"}`}>
                    {item.status}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-6">"{item.text}"</p>

                {/* Controls */}
                <div className="flex justify-end gap-2">
                  <Button onClick={() => handleDelete(item.id)} variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
                    <Trash2 className="w-4 h-4 mr-1" />
                    <span>{isRtl ? "حذف کریں" : "Delete"}</span>
                  </Button>
                  
                  {item.status !== "resolved" && (
                    <Button onClick={() => handleResolve(item.id)} size="sm" className="bg-success hover:bg-success/90 text-white">
                      <Check className="w-4 h-4 mr-1" />
                      <span>{isRtl ? "حل کریں" : "Resolve"}</span>
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 healthcare-card">
              <ShieldCheck className="w-10 h-10 text-success mx-auto mb-4" />
              <p className="font-semibold text-foreground">{isRtl ? "تمام تاثرات حل ہو گئے!" : "All Clean!"}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {isRtl ? "کسی صارف نے نیا مسئلہ رپورٹ نہیں کیا ہے۔" : "No pending user feedbacks or crash reports."}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminFeedback;

