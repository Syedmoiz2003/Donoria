import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, MessageSquare, ShieldCheck, Trash2, ShieldAlert, Check } from "lucide-react";
import { toast } from "sonner";

const mockFeedback = [
  { id: 1, user: "City General (Coordinator)", type: "suggestion", text: "Adding a WhatsApp integration for active blood match calls would drastically increase the speed.", date: "1 day ago", status: "unread" },
  { id: 2, user: "Ayesha Malik (Donor)", type: "bug", text: "Unable to upload my latest clinical lab report in PDF. It says file size exceeded but the file is only 1.2MB.", date: "2 days ago", status: "unread" },
  { id: 3, user: "Metro Health Center", type: "complaint", text: "A donor registered for kidney match failed to show up twice without any cancellation alert.", date: "3 days ago", status: "resolved" },
];

const AdminFeedback = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ur';
  const [feedbacks, setFeedbacks] = useState(mockFeedback);

  const handleResolve = (id) => {
    setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, status: "resolved" } : f));
    toast.success(isRtl ? "تاثرات کو کامیابی سے حل کر دیا گیا ہے!" : "Feedback marked as resolved!");
  };

  const handleDelete = (id) => {
    setFeedbacks(prev => prev.filter(f => f.id !== id));
    toast.success(isRtl ? "تاثرات کو کامیابی سے حذف کر دیا گیا ہے۔" : "Feedback entry deleted.");
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
          {feedbacks.length > 0 ? (
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
                      <span className="text-xs text-muted-foreground">{item.date}</span>
                    </div>

                    <h4 className="font-bold text-foreground text-sm">{item.user}</h4>
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
