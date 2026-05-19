import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Building2, Check, X, ShieldAlert, FileText, Download } from "lucide-react";
import { toast } from "sonner";

const pendingHospitals = [
  {
    id: "1",
    name: "Metro Health Center",
    registrationNo: "MHC-2024-5678",
    submittedDate: "2 days ago",
    documents: [
      { name: "Medical License.pdf", size: "2.4 MB" },
      { name: "Clinical Registration Cert.pdf", size: "1.8 MB" },
      { name: "On-Duty Coordinators Credentials.pdf", size: "1.1 MB" },
    ],
  },
  {
    id: "2",
    name: "Community Medical",
    registrationNo: "CMC-2024-9012",
    submittedDate: "5 days ago",
    documents: [
      { name: "Institutional Certification.pdf", size: "3.2 MB" },
      { name: "Verification compliance log.pdf", size: "800 KB" },
    ],
  },
];

const AdminVerify = () => {
  const { t, language } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const isRtl = language === 'ur';
  const [hospitals, setHospitals] = useState(pendingHospitals);

  const selected = id ? hospitals.find(h => h.id === id) : null;

  const handleAction = (hId, approve) => {
    toast.success(approve 
      ? (isRtl ? "ہسپتال کی درخواست منظور کر لی گئی ہے!" : "Hospital credentials successfully approved!") 
      : (isRtl ? "درخواست مسترد کر دی گئی ہے۔" : "Hospital registration rejected."));
    
    setHospitals(prev => prev.filter(h => h.id !== hId));
    if (id) {
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1000);
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
          <h1 className="font-semibold text-lg">
            {selected 
              ? (isRtl ? "دستاویز کا جائزہ" : "Review Documents") 
              : (isRtl ? "ہسپتالوں کی تصدیق" : "Hospital Verifications")}
          </h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Main Panel */}
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {selected ? (
          // Individual Review View
          <div className="space-y-6 animate-fade-in">
            <div className="healthcare-card !p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-foreground mb-1">{selected.name}</h2>
                <p className="text-sm text-muted-foreground">Registration: <span className="font-bold text-foreground">{selected.registrationNo}</span></p>
                <p className="text-xs text-muted-foreground mt-1">Submitted: {selected.submittedDate}</p>
              </div>
            </div>

            {/* Document List */}
            <div className="healthcare-card">
              <h3 className="font-bold text-sm text-foreground uppercase tracking-wider mb-4">{isRtl ? "منسلک دستاویزات" : "Compliance Files"}</h3>
              <div className="space-y-3">
                {selected.documents.map((doc, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-border/80 bg-muted/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold text-foreground">{doc.name}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1 text-xs">
                      <Download className="w-3.5 h-3.5" />
                      <span>{doc.size}</span>
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Decision Controls */}
            <div className="flex gap-4">
              <Button onClick={() => handleAction(selected.id, false)} variant="destructive" className="flex-1 py-6 text-sm font-bold gap-2">
                <X className="w-5 h-5" />
                {isRtl ? "مسترد کریں" : "Reject Hospital"}
              </Button>
              <Button onClick={() => handleAction(selected.id, true)} className="flex-1 py-6 text-sm font-bold bg-success hover:bg-success/90 text-white gap-2">
                <Check className="w-5 h-5" />
                {isRtl ? "منظور کریں" : "Approve & Activate"}
              </Button>
            </div>
          </div>
        ) : (
          // Verifications list view
          <div className="space-y-4">
            {hospitals.length > 0 ? (
              hospitals.map((hospital) => (
                <div key={hospital.id} className="healthcare-card !p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground mb-1">{hospital.name}</h3>
                      <p className="text-xs text-muted-foreground">ID: {hospital.registrationNo} • Submitted: {hospital.submittedDate}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="outline" size="sm" asChild className="flex-1 sm:flex-none">
                      <Link to={`/admin/verify/${hospital.id}`}>
                        {isRtl ? "جائزہ لیں" : "Review Documents"}
                      </Link>
                    </Button>
                    <Button onClick={() => handleAction(hospital.id, true)} className="flex-1 sm:flex-none bg-success hover:bg-success/95 text-white">
                      <Check className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 healthcare-card">
                <ShieldAlert className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                <p className="font-semibold text-foreground">{isRtl ? "کوئی تصدیق التوا میں نہیں ہے" : "No Pending Hospital Verifications"}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {isRtl ? "تمام ہسپتال کامیابی کے ساتھ تصدیق شدہ ہیں!" : "All medical institution credentials are up to date."}
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminVerify;
