import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Heart, 
  ArrowLeft, 
  Eye, 
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Droplets,
  CheckCircle,
  Loader2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const bloodGroups = ["A", "B", "AB", "O"];
const rhFactors = ["+", "-"];

const Register = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    blood_group: "",
    rh_factor: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    date_of_birth: "",
    gender: "",
    weight: "",
    height: "",
    role: "donor",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (step === 1) {
      if (!formData.full_name || !formData.email || !formData.phone || !formData.password || !formData.date_of_birth || !formData.gender) {
        setError(t('register.fillAllFields'));
        return;
      }
      setStep(2);
      return;
    }

    if (!formData.blood_group || !formData.rh_factor || !formData.city) {
      setError(t('register.fillBloodAndLocation'));
      return;
    }

    setIsLoading(true);

    try {
      const bloodGroup = formData.blood_group;
      const rhFactor = formData.rh_factor;
      const userData = {
        ...formData,
        blood_group: bloodGroup,
        rh_factor: rhFactor,
      };

      const { error: registerError } = await signUp(userData);

      if (registerError) {
        setError(registerError.message || t('register.unexpectedError'));
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      alert(t('register.success'));
      navigate("/donor/dashboard");
    } catch (err) {
      console.error('Registration error:', err);
      setError(t('register.unexpectedError'));
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary to-secondary p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-primary-foreground blur-3xl" />
          <div className="absolute bottom-20 left-20 w-64 h-64 rounded-full bg-primary-foreground blur-3xl" />
        </div>

        <div className="text-center text-primary-foreground relative z-10">
          <Heart className="w-24 h-24 mx-auto mb-8 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">{t('register.heroTitle')}</h2>
          <p className="text-primary-foreground/80 max-w-md mx-auto mb-8">
            {t('register.heroSubtitle')}
          </p>

          <div className="space-y-4 text-left max-w-sm mx-auto">
            {[
              t('register.benefit1'),
              t('register.benefit2'),
              t('register.benefit3'),
              t('register.benefit4'),
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-primary-foreground/80" />
                <span className="text-primary-foreground/80">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-6 lg:p-12">
        <Button variant="ghost" size="sm" className="self-start mb-8" asChild>
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg border border-border p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-primary-foreground flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold text-primary-foreground mb-2">
                  {t('register.title')}
                </h1>
                <p className="text-primary-foreground/80">
                  Create your donor account and start saving lives today
                </p>
              </div>

              <div className="flex items-center justify-center gap-4 mb-8">
                <div className={`flex items-center gap-2 ${step >= 1 ? "text-primary-foreground" : "text-primary-foreground/60"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= 1 ? "bg-primary-foreground text-primary" : "bg-primary-foreground/30"
                  }`}>
                    1
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{t('register.step1')}</span>
                </div>
                <div className="w-12 h-0.5 bg-primary-foreground/30" />
                <div className={`flex items-center gap-2 ${step >= 2 ? "text-primary-foreground" : "text-primary-foreground/60"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= 2 ? "bg-primary-foreground text-primary" : "bg-primary-foreground/30"
                  }`}>
                    2
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{t('register.step2')}</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
              {step === 1 ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="text-primary-foreground">{t('register.firstName')}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-foreground/60" />
                      <Input
                        id="full_name"
                        type="text"
                        placeholder={t('register.placeholderName')}
                        className="pl-10 h-12 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-primary-foreground">{t('register.email')}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-foreground/60" />
                      <Input
                        id="email"
                        type="email"
                        placeholder={t('register.placeholderEmail')}
                        className="pl-10 h-12 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-primary-foreground">{t('register.phone')}</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-foreground/60" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder={t('register.placeholderPhone')}
                        className="pl-10 h-12 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth" className="text-primary-foreground">{t('register.dateOfBirth')}</Label>
                    <div className="relative">
                      <Input
                        id="date_of_birth"
                        type="date"
                        className="pl-10 h-12 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground"
                        value={formData.date_of_birth}
                        onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-primary-foreground">{t('register.gender')}</Label>
                    <div className="relative">
                      <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                        <SelectTrigger className="pl-10 h-12 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                          <SelectValue placeholder={t('register.selectGender')} />
                        </SelectTrigger>
                        <SelectContent className="bg-background">
                          <SelectItem value="male">{t('register.male')}</SelectItem>
                          <SelectItem value="female">{t('register.female')}</SelectItem>
                          <SelectItem value="other">{t('register.other')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-primary-foreground">{t('register.password')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-foreground/60" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={t('register.placeholderPassword')}
                        className="pl-10 pr-10 h-12 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-foreground/60 hover:text-primary-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="blood_group" className="text-primary-foreground">{t('register.bloodGroup')}</Label>
                    <div className="relative">
                      <Droplets className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-foreground/60 z-10" />
                      <Select
                        value={formData.blood_group}
                        onValueChange={(value) => setFormData({ ...formData, blood_group: value })}
                      >
                        <SelectTrigger className="pl-10 h-12 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                          <SelectValue placeholder={t('register.selectBloodGroup')} />
                        </SelectTrigger>
                        <SelectContent className="bg-background">
                          {bloodGroups.map((group) => (
                            <SelectItem key={group} value={group}>
                              {group}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rh_factor" className="text-primary-foreground">Rh Factor</Label>
                    <div className="relative">
                      <Select
                        value={formData.rh_factor}
                        onValueChange={(value) => setFormData({ ...formData, rh_factor: value })}
                      >
                        <SelectTrigger className="h-12 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                          <SelectValue placeholder="Select Rh Factor" />
                        </SelectTrigger>
                        <SelectContent className="bg-background">
                          {rhFactors.map((factor) => (
                            <SelectItem key={factor} value={factor}>
                              {factor}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-primary-foreground">{t('register.location')}</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-foreground/60" />
                      <Input
                        id="city"
                        type="text"
                        placeholder={t('register.placeholderLocation')}
                        className="pl-10 h-12 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight" className="text-primary-foreground">Weight (kg)</Label>
                    <div className="relative">
                      <Input
                        id="weight"
                        type="number"
                        placeholder="50"
                        className="h-12 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || '' })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="height" className="text-primary-foreground">Height (cm)</Label>
                    <div className="relative">
                      <Input
                        id="height"
                        type="number"
                        placeholder="170"
                        className="h-12 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40"
                        value={formData.height}
                        onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) || '' })}
                        required
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-primary-foreground/10 rounded-xl border border-primary-foreground/20">
                    <p className="text-sm text-primary-foreground/80">
                      {t('register.agreeTerms')}{" "}
                      <Link to="/terms" className="text-primary-foreground hover:underline">
                        {t('register.termsOfService')}
                      </Link>{" "}
                      {t('register.and')}{" "}
                      <Link to="/privacy" className="text-primary-foreground hover:underline">
                        {t('register.privacyPolicy')}
                      </Link>
                      .
                    </p>
                  </div>
                </>
              )}

              {error && (
                <div className="p-3 text-sm text-red-300 bg-red-900/30 rounded-md border border-red-500/30">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                {step === 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="flex-1 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
                    onClick={() => setStep(1)}
                    disabled={isLoading}
                  >
                    {t('register.back')}
                  </Button>
                )}
                <Button type="submit" variant="hero" size="lg" className="flex-1 bg-primary-foreground text-primary hover:bg-primary-foreground/90" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t('register.creatingAccount')}
                    </>
                  ) : (
                    step === 1 ? t('common.next') : t('common.completeRegistration')
                  )}
                </Button>
              </div>
            </form>

            <p className="text-center text-sm text-primary-foreground/80 mt-6">
              {t('register.alreadyHaveAccount')}{" "}
              <Link to="/login?role=donor" className="text-primary-foreground hover:underline font-medium">
                {t('register.signIn')}
              </Link>
            </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
