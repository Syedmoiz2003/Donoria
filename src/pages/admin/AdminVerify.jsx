import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { adminApi } from "@/lib/api";
import { ArrowLeft, Building2, Check, X, ShieldAlert, FileText, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

const AdminVerify = () => {
  const { t, language } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const isRtl = language === 'ur';
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchPendingHospitals();
  }, []);

  const fetchPendingHospitals = async () => {
    try {
      setLoading(true);
      // Fetch all hospitals and filter manually to be safe, or use the filter if supported
      const data = await adminApi.getHospitals();
      
      // Filter for hospitals that are NOT verified
      const pending = data.filter(h => h.is_verified === false || h.isVerified === false);
      
      setHospitals(pending.map(h => ({
        id: h.id,
        name: h.hospital_name || h.hospitalName,
        registrationNo: h.license_number || h.licenseNumber,
        submittedDate: new Date(h.created_at || h.createdAt).toLocaleDateString(),
        documents: []
      })));
    } catch (error) {
      console.error("Failed to fetch pending hospitals:", error);
      toast.error(isRtl ? "ڈیٹا لوڈ کرنے میں ناکامی" : "Failed to load pending hospitals");
    } finally {
      setLoading(false);
    }
  };

  const [selectedHospital, setSelectedHospital] = useState(null);
  const [docsLoading, setDocsLoading] = useState(false);

  useEffect(() => {
    if (id && hospitals.length > 0) {
      const hospital = hospitals.find(h => h.id === id);
      if (hospital) {
        setSelectedHospital(hospital);
        fetchDocuments(id);
      }
    } else {
      setSelectedHospital(null);
    }
  }, [id, hospitals]);

  const fetchDocuments = async (hospitalId) => {
    try {
      setDocsLoading(true);
      // In a real app, we might have an endpoint for docs by hospital
      // For now, let's fetch pending and filter, or fetch all if needed
      const allDocs = await adminApi.getDocuments();
      const hospitalDocs = allDocs.filter(doc => (doc.hospital_id || doc.hospitalId) === hospitalId);
      
      setSelectedHospital(prev => prev ? {
        ...prev,
        documents: hospitalDocs.map(d => ({
          id: d.id,
          name: d.document_name || d.documentName,
          size: d.file_size ? `${(d.file_size / 1024 / 1024).toFixed(1)} MB` : "N/A",
          url: d.file_url || d.fileUrl
        }))
      } : null);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    } finally {
      setDocsLoading(false);
    }
  };

  const handleAction = async (hId, approve) => {
    try {
      setActionLoading(true);
      if (approve) {
        // Approve the hospital
        await adminApi.verifyHospital(hId);
        
        // Also approve all documents for this hospital if we have them loaded
        if (selectedHospital && selectedHospital.id === hId && selectedHospital.documents) {
          await Promise.all(selectedHospital.documents.map(doc => 
            adminApi.approveDocument(doc.id).catch(err => console.error("Failed to approve doc:", doc.id, err))
          ));
        }
        
        toast.success(isRtl ? "ہسپتال کی درخواست منظور کر لی گئی ہے!" : "Hospital credentials successfully approved!");
      } else {
        await adminApi.rejectHospital(hId);
        toast.success(isRtl ? "درخواست مسترد کر دی گئی ہے۔" : "Hospital registration rejected.");
      }
      
      setHospitals(prev => prev.filter(h => h.id !== hId));
      if (id) {
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 1000);
      }
    } catch (error) {
      console.error("Action failed:", error);
      toast.error(isRtl ? "کارروائی مکمل نہیں ہو سکی" : "Failed to complete action");
    } finally {
      setActionLoading(false);
    }
  };

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
          <h1 className="font-semibold text-lg">
            {selectedHospital 
              ? (isRtl ? "دستاویز کا جائزہ" : "Review Documents") 
              : (isRtl ? "ہسپتالوں کی تصدیق" : "Hospital Verifications")}
          </h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Main Panel */}
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {selectedHospital ? (
          // Individual Review View
          <div className="space-y-6 animate-fade-in">
            <div className="healthcare-card !p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-foreground mb-1">{selectedHospital.name}</h2>
                <p className="text-sm text-muted-foreground">Registration: <span className="font-bold text-foreground">{selectedHospital.registrationNo}</span></p>
                <p className="text-xs text-muted-foreground mt-1">Submitted: {selectedHospital.submittedDate}</p>
              </div>
            </div>

            {/* Document List */}
            <div className="healthcare-card">
              <h3 className="font-bold text-sm text-foreground uppercase tracking-wider mb-4">{isRtl ? "منسلک دستاویزات" : "Compliance Files"}</h3>
              {docsLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : selectedHospital.documents.length > 0 ? (
                <div className="space-y-3">
                  {selectedHospital.documents.map((doc, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-border/80 bg-muted/20 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-foreground">{doc.name}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-1 text-xs" asChild>
                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                          <Download className="w-3.5 h-3.5" />
                          <span>{doc.size}</span>
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">{isRtl ? "کوئی دستاویز نہیں ملی" : "No documents uploaded"}</p>
              )}
            </div>

            {/* Decision Controls */}
            <div className="flex gap-4">
              <Button 
                onClick={() => handleAction(selectedHospital.id, false)} 
                variant="destructive" 
                className="flex-1 py-6 text-sm font-bold gap-2"
                disabled={actionLoading}
              >
                <X className="w-5 h-5" />
                {isRtl ? "مسترد کریں" : "Reject Hospital"}
              </Button>
              <Button 
                onClick={() => handleAction(selectedHospital.id, true)} 
                className="flex-1 py-6 text-sm font-bold bg-success hover:bg-success/90 text-white gap-2"
                disabled={actionLoading}
              >
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
                    <Button 
                      onClick={() => handleAction(hospital.id, true)} 
                      className="flex-1 sm:flex-none bg-success hover:bg-success/95 text-white"
                      disabled={actionLoading}
                    >
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
