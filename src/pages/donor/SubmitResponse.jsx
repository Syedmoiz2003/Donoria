import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { donorApi } from "@/lib/api";
import {
  Heart,
  ArrowLeft,
  MapPin,
  Clock,
  CheckCircle,
  Phone,
  Mail,
  Building,
  AlertTriangle,
  Activity,
  Droplets,
  Calendar,
  User,
  Shield,
  Sparkles,
  HandHeart,
  ChevronRight,
  Star,
  FileText,
  Upload,
  Loader2,
} from "lucide-react";

export default function SubmitResponse() {
  const { t, language } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const [consent, setConsent] = useState(false);
  const [availability, setAvailability] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1); // 1 = info/availability, 2 = legal (for organ), 3 = confirm, 4 = success
  const [agreeHealth, setAgreeHealth] = useState(false);
  const [legalFile, setLegalFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [requestData, setRequestData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRequest = async () => {
      try {
        const res = await donorApi.getRequest(id);
        const req = res.request;
        setRequestData({
          id: req.id,
          hospital: req.hospitals?.hospital_name || "Hospital",
          type: req.request_type,
          bloodType: (req.blood_group || "") + (req.rh_factor || ""),
          organType: req.organ_type || "",
          units: req.quantity || 1,
          urgency: req.urgency_level || "high",
          verified: req.hospitals?.is_verified,
          distance: "2 km away",
          time: "10 mins",
          postedBy: "Hospital Staff",
          phone: req.hospitals?.emergency_contact || "N/A",
          email: req.hospitals?.users?.email || "N/A",
          address: req.hospitals?.address || "N/A",
          compatibility: 100,
          requirements: [
            "Must be feeling well today",
            "Bring a valid ID",
            "Eat a healthy meal before donation"
          ],
          recipientAge: "N/A"
        });
      } catch (err) {
        console.error("Failed to load request", err);
      } finally {
        setLoading(false);
      }
    };
    loadRequest();
  }, [id]);

  const isOrgan = requestData?.type === "organ";

  const availabilityOptions = [
    { label: "Today", sublabel: "Available now", icon: "⚡" },
    { label: "Tomorrow", sublabel: "Next day", icon: "📅" },
    { label: "This Week", sublabel: "Within 7 days", icon: "🗓️" },
    { label: "Flexible", sublabel: "Coordinate later", icon: "🤝" },
  ];

  const handleNext = async () => {
    if (step === 1 && availability) {
      if (isOrgan) {
        setStep(2); // Go to legal upload for organ
      } else {
        setStep(3); // Go to confirmation for blood
      }
    } else if (step === 2 && isOrgan && legalFile) {
      setStep(3);
    } else if (step === 3 && consent && agreeHealth) {
      try {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('request_id', id);
        formData.append('message', message ? `Availability: ${availability}. ${message}` : `Availability: ${availability}`);
        formData.append('estimated_arrival', new Date().toISOString());
        
        if (isOrgan && legalFile) {
          formData.append('document', legalFile);
          formData.append('document_type', 'Legal Consent');
          formData.append('document_name', `Organ Donation Consent - ${requestData.hospital}`);
        }

        await donorApi.submitResponse(formData);
        setStep(4);
      } catch (err) {
        console.error(err);
        alert(err.message || "Failed to submit response");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!requestData) return <div className="min-h-screen flex items-center justify-center">Request not found.</div>;

  const handleBack = () => {
    if (step > 1) {
      if (step === 3 && !isOrgan) {
        setStep(1);
      } else {
        setStep(step - 1);
      }
    }
  };

  // ─── Step 4: Success ───
  if (step === 4) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-lg w-full text-center">
          {/* Animated success ring */}
          <div className="relative mx-auto mb-8 w-32 h-32">
            <div className="absolute inset-0 rounded-full bg-success/20 animate-ping" style={{ animationDuration: "2s" }} />
            <div className="absolute inset-2 rounded-full bg-success/10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-success to-emerald-600 flex items-center justify-center shadow-lg">
                <Heart className="w-12 h-12 text-white fill-white" />
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-3">
            You're a Hero! 🎉
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            Your response has been submitted to
          </p>
          <p className="text-xl font-semibold text-primary mb-6">
            {requestData.hospital}
          </p>

          <div className="healthcare-card !p-6 mb-6 text-left">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-warning" />
              What Happens Next?
            </h3>
            <div className="space-y-4">
              {[
                { step: "1", text: "The hospital will review your response and eligibility", time: "Within 1-2 hours" },
                { step: "2", text: "You'll receive a confirmation call or notification", time: "Same day" },
                { step: "3", text: isOrgan ? "Schedule your medical evaluation" : "Visit the hospital for donation", time: "As per your availability" },
                { step: "4", text: "Complete your donation and save a life!", time: isOrgan ? "After evaluation" : "30-45 minutes" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary">
                    {item.step}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.text}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="healthcare-card !p-5 mb-6 border-2 border-primary/20 bg-primary/5">
            <div className="flex items-center gap-3">
              <Star className="w-6 h-6 text-warning" />
              <div className="text-left">
                <p className="font-semibold text-foreground text-sm">+50 Impact Points Earned</p>
                <p className="text-xs text-muted-foreground">Every response brings you closer to saving a life</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button className="w-full" size="lg" asChild>
              <Link to="/donor/dashboard">
                Return to Dashboard
              </Link>
            </Button>
            <Button variant="outline" className="w-full" size="lg" asChild>
              <Link to="/donor/dashboard">
                Browse More Requests
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" className="gap-2" onClick={() => step > 1 ? handleBack() : navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{step > 1 ? "Back" : "Go Back"}</span>
          </Button>
          <div className="flex items-center gap-2">
            <HandHeart className="h-6 w-6 text-primary" />
            <h1 className="font-semibold text-foreground">Submit Response & Save a Life</h1>
          </div>
          <div className="w-24" />
        </div>
      </header>

      {/* Progress Steps */}
      <div className="container mx-auto px-4 py-4 max-w-3xl">
        <div className="flex items-center justify-center gap-2 mb-8">
          {[
            { label: "Availability", show: true },
            { label: "Legal Docs", show: isOrgan },
            { label: "Confirm & Submit", show: true }
          ].filter(s => s.show).map((s, i, arr) => {
            const actualStep = isOrgan ? (i + 1) : (i === 0 ? 1 : 3);
            const isCurrent = step === actualStep;
            const isDone = step > actualStep;
            
            return (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  isDone
                    ? "bg-success text-white"
                    : isCurrent
                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {isDone ? <CheckCircle className="w-5 h-5" /> : (i + 1)}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${
                  isCurrent ? "text-foreground" : "text-muted-foreground"
                }`}>
                  {s.label}
                </span>
                {i < arr.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 rounded-full ${isDone ? "bg-success" : "bg-muted"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <main className="container mx-auto px-4 pb-12 max-w-3xl">
        {/* Request Summary (always visible) */}
        <div className={`healthcare-card !p-5 mb-6 ${
          requestData.urgency === "critical" ? "border-2 border-destructive/30" : ""
        }`}>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-bold ${
              requestData.urgency === "critical"
                ? "bg-destructive text-destructive-foreground"
                : requestData.urgency === "high"
                ? "bg-warning text-warning-foreground"
                : "bg-primary text-primary-foreground"
            }`}>
              {isOrgan ? (
                <>
                  <Heart className="w-5 h-5" />
                  <span className="text-[9px] mt-0.5">Organ</span>
                </>
              ) : (
                <>
                  <Droplets className="w-5 h-5" />
                  <span className="text-xs mt-0.5">{requestData.bloodType}</span>
                </>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground truncate">{requestData.hospital}</h3>
                {requestData.verified && <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />}
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ml-auto flex-shrink-0 ${
                  requestData.urgency === "critical"
                    ? "bg-destructive/10 text-destructive"
                    : requestData.urgency === "high"
                    ? "bg-warning/10 text-warning"
                    : "bg-primary/10 text-primary"
                }`}>
                  {requestData.urgency.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {isOrgan
                  ? `${requestData.organType} donor needed (Age: ${requestData.recipientAge}, Blood: ${requestData.bloodType})`
                  : `${requestData.units} units of ${requestData.bloodType} blood needed`
                }
              </p>
              <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{requestData.distance}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{requestData.time}</span>
                <span className="flex items-center gap-1"><User className="w-3 h-3" />{requestData.postedBy}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Step 1: Availability ─── */}
        {step === 1 && (
          <div className="space-y-6 fade-in">
            <div className="healthcare-card !p-6">
              <h2 className="text-lg font-bold text-foreground mb-1">When can you visit?</h2>
              <p className="text-sm text-muted-foreground mb-5">Select your preferred availability for this donation</p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {availabilityOptions.map((option) => (
                  <button
                    key={option.label}
                    onClick={() => setAvailability(option.label)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      availability === option.label
                        ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                        : "border-border hover:border-primary/40 hover:bg-muted/50"
                    }`}
                  >
                    <span className="text-2xl mb-2 block">{option.icon}</span>
                    <p className="font-semibold text-foreground text-sm">{option.label}</p>
                    <p className="text-xs text-muted-foreground">{option.sublabel}</p>
                  </button>
                ))}
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Additional message (optional)
                </label>
                <Textarea
                  placeholder="Any additional information for the hospital..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            {/* Contact info card */}
            <div className="healthcare-card !p-5">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Building className="w-4 h-4 text-primary" />
                Hospital Contact
              </h3>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>{requestData.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>{requestData.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground sm:col-span-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{requestData.address}</span>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full"
              disabled={!availability}
              onClick={handleNext}
            >
              Continue to Confirmation
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </div>
        )}

        {/* ─── Step 2: Legal Documents (Organ Only) ─── */}
        {step === 2 && isOrgan && (
          <div className="space-y-6 fade-in">
            <div className="healthcare-card !p-6">
              <h2 className="text-lg font-bold text-foreground mb-1">Legal Documentation</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Organ donation requires legal consent and identification. Please upload the necessary documents (PDF or Image).
              </p>

              <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-colors bg-muted/20">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                
                {legalFile ? (
                  <div className="mb-4">
                    <p className="font-semibold text-foreground">{legalFile.name}</p>
                    <p className="text-xs text-muted-foreground">{(legalFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    <Button variant="ghost" size="sm" onClick={() => setLegalFile(null)} className="mt-2 text-destructive">
                      Remove File
                    </Button>
                  </div>
                ) : (
                  <>
                    <p className="font-semibold text-foreground mb-1">Upload Consent Form / ID</p>
                    <p className="text-xs text-muted-foreground mb-6">PDF, PNG or JPG (max 5MB)</p>
                    <label>
                      <Input 
                        type="file" 
                        className="hidden" 
                        accept=".pdf,image/*" 
                        onChange={(e) => setLegalFile(e.target.files[0])}
                      />
                      <Button variant="outline" className="gap-2 pointer-events-none">
                        <Upload className="w-4 h-4" />
                        Select File
                      </Button>
                    </label>
                  </>
                )}
              </div>

              <div className="mt-6 p-4 bg-warning/5 border border-warning/20 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Your legal documents are required to verify the donation process. These will be reviewed by the hospital and admin team only.
                </p>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full"
              disabled={!legalFile}
              onClick={handleNext}
            >
              Continue to Confirmation
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </div>
        )}

        {/* ─── Step 3: Confirm ─── */}
        {step === 3 && (
          <div className="space-y-6 fade-in">
            {/* Summary */}
            <div className="healthcare-card !p-6">
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Review Your Response
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Hospital</span>
                  <span className="text-sm font-medium text-foreground">{requestData.hospital}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Request Type</span>
                  <span className="text-sm font-medium text-foreground">
                    {isOrgan ? `${requestData.organType} Donation` : `${requestData.bloodType} Blood (${requestData.units} units)`}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Urgency</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    requestData.urgency === "critical"
                      ? "bg-destructive/10 text-destructive"
                      : requestData.urgency === "high"
                      ? "bg-warning/10 text-warning"
                      : "bg-primary/10 text-primary"
                  }`}>
                    {requestData.urgency.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Your Availability</span>
                  <span className="text-sm font-medium text-primary">{availability}</span>
                </div>
                {isOrgan && legalFile && (
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Legal Document</span>
                    <span className="text-sm font-medium text-success flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {legalFile.name}
                    </span>
                  </div>
                )}
                {message && (
                  <div className="py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground block mb-1">Your Message</span>
                    <p className="text-sm text-foreground bg-muted/50 rounded-lg p-3">{message}</p>
                  </div>
                )}
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-muted-foreground">Compatibility</span>
                  <span className="text-sm font-bold text-success">{requestData.compatibility}% Match</span>
                </div>
              </div>
            </div>

            {/* Requirements reminder */}
            <div className="healthcare-card !p-5 border-2 border-warning/20 bg-warning/5">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Donation Requirements
              </h3>
              <ul className="space-y-2">
                {requestData.requirements.map((req, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                    <span className="text-foreground">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Consent checkboxes */}
            <div className="healthcare-card !p-6">
              <h3 className="font-semibold text-foreground mb-4">Consent & Agreement</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl">
                  <Checkbox
                    id="health-consent"
                    checked={agreeHealth}
                    onCheckedChange={(checked) => setAgreeHealth(checked)}
                  />
                  <label htmlFor="health-consent" className="text-sm text-foreground cursor-pointer leading-relaxed">
                    I confirm that I am in good health, meet the eligibility requirements listed above, and have not donated {isOrgan ? "an organ" : "blood"} recently.
                  </label>
                </div>
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl">
                  <Checkbox
                    id="data-consent"
                    checked={consent}
                    onCheckedChange={(checked) => setConsent(checked)}
                  />
                  <label htmlFor="data-consent" className="text-sm text-foreground cursor-pointer leading-relaxed">
                    I consent to sharing my contact information with {requestData.hospital} for coordination purposes and understand this is a voluntary commitment.
                  </label>
                </div>
              </div>
            </div>

            <Button
              variant="emergency"
              size="lg"
              className="w-full text-lg py-6"
              disabled={!consent || !agreeHealth || isSubmitting}
              onClick={handleNext}
            >
              {isSubmitting ? (
                <Loader2 className="w-6 h-6 mr-2 animate-spin" />
              ) : (
                <Heart className="w-6 h-6 mr-2" />
              )}
              Submit Response & Save a Life
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By submitting, you agree to be contacted by the hospital. You can cancel anytime before your appointment.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
