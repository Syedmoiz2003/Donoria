import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Building2, Save, FileSpreadsheet, Plus, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const PostRequest = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ur';
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    type: "blood",
    bloodType: "O+",
    organType: "",
    units: "2",
    urgency: "critical",
    recipientAge: "",
    description: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(isRtl ? "درخواست کامیابی سے براڈکاسٹ کر دی گئی ہے!" : "Case broadcasted to active donors successfully!");
      setFormData({
        type: "blood",
        bloodType: "O+",
        organType: "",
        units: "2",
        urgency: "critical",
        recipientAge: "",
        description: "",
      });
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
            <Plus className="w-5 h-5 text-secondary" />
            {isRtl ? "نئی ہنگامی درخواست بھیجیں" : "Broadcast Emergency Case"}
          </h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Form Area */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="healthcare-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Type Select */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isRtl ? "عطیہ کی قسم" : "Donation Type"}</label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant={formData.type === "blood" ? "default" : "outline"}
                    onClick={() => setFormData({ ...formData, type: "blood" })}
                    className="w-full py-6 font-bold"
                  >
                    {isRtl ? "خون" : "Blood Bag"}
                  </Button>
                  <Button
                    type="button"
                    variant={formData.type === "organ" ? "default" : "outline"}
                    onClick={() => setFormData({ ...formData, type: "organ" })}
                    className="w-full py-6 font-bold"
                  >
                    {isRtl ? "اعضاء" : "Organ Match"}
                  </Button>
                </div>
              </div>

              {/* Blood Type & Organ */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isRtl ? "بلڈ گروپ" : "Blood Group"}</label>
                  <select
                    value={formData.bloodType}
                    onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                    className="w-full h-11 px-3 rounded-xl border border-input bg-card text-sm"
                  >
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bt => (
                      <option key={bt} value={bt}>{bt}</option>
                    ))}
                  </select>
                </div>

                {formData.type === "organ" ? (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isRtl ? "اعضاء کی قسم" : "Organ Specifics"}</label>
                    <Input
                      type="text"
                      required
                      placeholder="e.g. Kidney, Liver"
                      value={formData.organType}
                      onChange={(e) => setFormData({ ...formData, organType: e.target.value })}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isRtl ? "مطلوبہ یونٹس" : "Bags Required"}</label>
                    <Input
                      type="number"
                      required
                      min="1"
                      value={formData.units}
                      onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                    />
                  </div>
                )}
              </div>

              {/* Age & Urgency */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isRtl ? "مریض کی عمر" : "Recipient Age"}</label>
                  <Input
                    type="number"
                    required
                    placeholder="e.g. 35"
                    value={formData.recipientAge}
                    onChange={(e) => setFormData({ ...formData, recipientAge: e.target.value })}
                  />
                </div>

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
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{isRtl ? "طبی تفصیلات" : "Clinical Match Criteria"}</label>
                <textarea
                  rows="4"
                  placeholder={isRtl ? "مریض کی حالت اور دیگر ضروری معلومات لکھیں..." : "Details regarding patient clinical history..."}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 rounded-xl border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Broadcast */}
            <Button type="submit" className="w-full gap-2 py-6 text-sm font-bold bg-secondary hover:bg-secondary/90 text-secondary-foreground" disabled={loading}>
              <Plus className="w-4 h-4" />
              {loading
                ? (isRtl ? "براڈکاسٹ بھیجا جا رہا ہے..." : "Initiating Match Network...")
                : (isRtl ? "ہنگامی الرٹ براڈکاسٹ کریں" : "Broadcast Emergency Case")}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default PostRequest;
