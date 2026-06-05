import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { hospitalApi } from "@/lib/api";
import { ArrowLeft, Clock, Heart, Edit, Trash2, ShieldAlert, Plus } from "lucide-react";
import { toast } from "sonner";

const HospitalRequests = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ur';
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await hospitalApi.getRequests();
        const formatted = data.map(req => ({
          id: req.id,
          bloodType: (req.blood_group || "") + (req.rh_factor || ""),
          organType: req.organ_type || "",
          units: req.quantity || 1,
          urgency: req.urgency_level || "critical",
          responses: req.responsesCount || 0,
          posted: new Date(req.created_at).toLocaleDateString(),
          type: req.request_type,
          recipientAge: "N/A"
        }));
        setRequests(formatted);
      } catch (error) {
        console.error("Failed to load requests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleClose = async (id) => {
    try {
      await hospitalApi.deleteRequest(id);
      setRequests(prev => prev.filter(r => r.id !== id));
      toast.success(isRtl ? "درخواست کامیابی سے بند کر دی گئی ہے۔" : "Case successfully marked as fulfilled & closed.");
    } catch (error) {
      toast.error(error.message || "Failed to close request");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background">Loading requests...</div>;

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/hospital/dashboard" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>{isRtl ? "ڈیش بورڈ پر واپس" : "Back to Dashboard"}</span>
            </Link>
          </Button>
          <h1 className="font-semibold text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            {isRtl ? "تمام فعال درخواستیں" : "Active Case Management"}
          </h1>
          <Button variant="hero" size="sm" asChild>
            <Link to="/hospital/post-request">
              <Plus className="w-4 h-4 mr-1" />
              {isRtl ? "نئی پوسٹ" : "Post Case"}
            </Link>
          </Button>
        </div>
      </header>

      {/* Requests Panel */}
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="space-y-4">
          {requests.length > 0 ? (
            requests.map((request) => (
              <div
                key={request.id}
                className={`healthcare-card !p-5 relative overflow-hidden transition-all duration-300 hover:border-primary/30 ${request.urgency === "critical" ? "border-2 border-destructive/30" : ""
                  }`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${request.urgency === "critical"
                        ? "bg-destructive text-destructive-foreground"
                        : "bg-primary text-primary-foreground"
                      }`}>
                      {request.type === "organ" ? <Heart className="w-6 h-6" /> : request.bloodType}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">
                        {request.type === "organ"
                          ? `${request.organType} needed (Recipient Age: ${request.recipientAge}, Blood: ${request.bloodType})`
                          : `${request.units} units of ${request.bloodType} requested`
                        }
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Posted: {request.posted}</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${request.urgency === "critical" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                    }`}>
                    {request.urgency}
                  </span>
                </div>

                {/* Response rate and control */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-border">
                  <span className="text-sm font-semibold text-muted-foreground">
                    {request.responses} {isRtl ? "ڈونرز کے جوابات" : "Active Donor matches"}
                  </span>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button variant="outline" size="sm" asChild className="flex-1 sm:flex-none">
                      <Link to={`/hospital/request/${request.id}/edit`}>
                        <Edit className="w-4 h-4 mr-1.5" />
                        {isRtl ? "ترمیم کریں" : "Edit"}
                      </Link>
                    </Button>
                    <Button onClick={() => handleClose(request.id)} variant="destructive" size="sm" className="flex-1 sm:flex-none">
                      <Trash2 className="w-4 h-4 mr-1.5" />
                      {isRtl ? "بند کریں" : "Fulfill / Close"}
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 healthcare-card">
              <ShieldAlert className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
              <p className="font-semibold text-foreground">{isRtl ? "کوئی فعال درخواست نہیں ہے" : "No Active Case Alerts"}</p>
              <Button className="mt-4" asChild>
                <Link to="/hospital/post-request">{isRtl ? "پہلی درخواست پوسٹ کریں" : "Broadcast First Case"}</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HospitalRequests;
