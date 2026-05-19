import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Save, Edit2 } from "lucide-react";
import { toast } from "sonner";

const EditRequest = () => {
  const { t, language } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const isRtl = language === 'ur';
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    units: "3",
    urgency: "critical",
    description: "Urgent need of O- blood bags for clinical bypass surgery scheduled tomorrow morning.",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(isRtl ? "درخواست میں ترمیم کامیابی سے محفوظ کر دی گئی ہے!" : "Case requirements updated successfully!");
      navigate("/hospital/dashboard");
    }, 1000);
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
            <Edit2 className="w-5 h-5 text-primary" />
            {isRtl ? "درخواست میں ترمیم کریں" : `Modify Case #${id}`}
          </h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Main Panel */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="healthcare-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Units */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isRtl ? "مطلبہ مقدار (یونٹ)" : "Bags/Units Required"}</label>
                <Input
                  type="number"
                  required
                  min="1"
                  value={formData.units}
                  onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                />
              </div>

              {/* Urgency */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isRtl ? "شدت" : "Urgency Status"}</label>
                <select 
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                  className="w-full h-11 px-3 rounded-xl border border-input bg-card text-sm"
                >
                  <option value="critical">{isRtl ? "انتہائی نازک" : "Critical Emergency"}</option>
                  <option value="high">{isRtl ? "زیادہ اہم" : "High Priority"}</option>
                  <option value="medium">{isRtl ? "معمولی" : "Normal Match"}</option>
                </select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isRtl ? "طبی تفصیلات" : "Clinical Match Details"}</label>
                <textarea 
                  rows="5"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 rounded-xl border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Save */}
            <Button type="submit" className="w-full gap-2 py-6 text-sm font-bold bg-primary hover:bg-primary/90" disabled={loading}>
              <Save className="w-4 h-4" />
              {loading 
                ? (isRtl ? "محفوظ کیا جا رہا ہے..." : "Saving Requirements...") 
                : (isRtl ? "تبدیلیاں محفوظ کریں" : "Apply Case Updates")}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditRequest;
