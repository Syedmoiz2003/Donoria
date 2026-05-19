import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, KeyRound, Mail, CheckCircle2 } from "lucide-react";

const ForgotPassword = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ur';
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Mesh */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-[40rem] h-[40rem] rounded-full bg-primary/5 blur-3xl animate-pulse" />
        <div className="absolute bottom-[10%] right-[5%] w-[35rem] h-[35rem] rounded-full bg-secondary/5 blur-3xl" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <KeyRound className="w-6 h-6" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
          {isRtl ? "پاس ورڈ دوبارہ حاصل کریں" : "Recover Password"}
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground max-w">
          {isRtl 
            ? "اپنا ای میل درج کریں اور ہم آپ کو لنک بھیجیں گے۔" 
            : "Enter your registered email address to receive recovery credentials."}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="glass-card p-8 rounded-2xl border border-border">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {isRtl ? "ای میل ایڈریس" : "Email Address"}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-11 font-semibold">
                {isRtl ? "بحالی کا لنک بھیجیں" : "Send Recovery Credentials"}
              </Button>
            </form>
          ) : (
            <div className="text-center py-4 space-y-4 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-success/10 text-success mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                {isRtl ? "لنک کامیابی سے بھیج دیا گیا!" : "Verification Sent!"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isRtl 
                  ? `${email} پر ہدایات بھیج دی گئی ہیں۔` 
                  : `Please check ${email} for further security recovery guidelines.`}
              </p>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-border flex justify-center">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/" className="gap-2 text-xs">
                <ArrowLeft className="w-4 h-4" />
                <span>{isRtl ? "ہوم پر واپس جائیں" : "Back to Home"}</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
