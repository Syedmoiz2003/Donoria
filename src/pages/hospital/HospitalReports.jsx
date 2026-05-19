import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, BarChart3, Download, RefreshCw, FileText } from "lucide-react";
import { toast } from "sonner";

const HospitalReports = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ur';
  const [downloading, setDownloading] = useState(false);

  const handleExport = (format) => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      toast.success(isRtl 
        ? `کلینکل رپورٹ کامیابی سے ${format} فارمیٹ میں ڈاؤن لوڈ ہو گئی ہے!` 
        : `Clinical matches reports successfully exported to ${format}!`);
    }, 1500);
  };

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
            <BarChart3 className="w-5 h-5 text-primary" />
            {isRtl ? "طبی تجزیات اور رپورٹ" : "Clinical Analytical Analytics"}
          </h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Main Reports Panel */}
      <main className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
        <div className="healthcare-card">
          <h3 className="font-bold text-lg text-foreground mb-6 flex items-center justify-between">
            <span>{isRtl ? "طبی کارکردگی کا جائزہ" : "Clinical Operational Efficiency"}</span>
            <Button variant="ghost" size="icon">
              <RefreshCw className="w-4 h-4 text-muted-foreground" />
            </Button>
          </h3>

          <div className="space-y-6">
            {[
              { label: isRtl ? "ڈونر کی حاضری کی شرح" : "Donor Attendance Fulfilment", value: "92%", color: "bg-success" },
              { label: isRtl ? "ہنگامی ہدف کے ملاپ کا وقت" : "Emergency Target Matching Speed", value: "86%", color: "bg-primary" },
              { label: isRtl ? "بلڈ بیگز کی بحالی" : "Blood Inventory Stability Ratio", value: "78%", color: "bg-secondary" },
            ].map((metric) => (
              <div key={metric.label} className="space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-muted-foreground">{metric.label}</span>
                  <span className="text-foreground">{metric.value}</span>
                </div>
                <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${metric.color} rounded-full`} style={{ width: metric.value }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="healthcare-card space-y-4">
          <h4 className="font-bold text-foreground text-sm uppercase tracking-wider mb-2">
            {isRtl ? "رپورٹ ایکسپورٹ کرنے کے اختیارات" : "Report Data Export"}
          </h4>

          <div className="grid grid-cols-2 gap-4">
            <Button onClick={() => handleExport("PDF")} variant="outline" className="py-8 font-semibold gap-2 border-border" disabled={downloading}>
              <FileText className="w-5 h-5 text-red-500" />
              <span>{downloading ? "Exporting..." : "Download Medical PDF"}</span>
            </Button>
            
            <Button onClick={() => handleExport("CSV")} variant="outline" className="py-8 font-semibold gap-2 border-border" disabled={downloading}>
              <Download className="w-5 h-5 text-blue-500" />
              <span>{downloading ? "Exporting..." : "Download Spreadsheet CSV"}</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HospitalReports;
