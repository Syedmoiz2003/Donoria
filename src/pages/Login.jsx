import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Droplets, 
  Building2, 
  Shield, 
  ArrowLeft, 
  Eye, 
  EyeOff,
  Mail,
  Lock,
  Loader2,
  Heart
} from "lucide-react";

const ADMIN_EMAIL = "admin@lifelink.com";
const ADMIN_PASSWORD = "admin123";

const roleConfig = {
  donor: {
    icon: Droplets,
    titleKey: 'login.title',
    subtitleKey: 'login.donorSubtitle',
    color: "bg-primary",
    registerLink: "",
    dashboardLink: "/donor/dashboard",
  },
  hospital: {
    icon: Building2,
    titleKey: 'login.hospitalTitle',
    subtitleKey: 'login.hospitalSubtitle',
    color: "bg-secondary",
    registerLink: "",
    dashboardLink: "/hospital/dashboard",
  },
  admin: {
    icon: Shield,
    titleKey: 'login.adminTitle',
    subtitleKey: 'login.adminSubtitle',
    color: "bg-foreground",
    registerLink: "",
    dashboardLink: "/admin/dashboard",
  },
};

const Login = () => {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  let role = "donor";
  if (pathname.includes("/admin")) {
    role = "admin";
  } else if (pathname.includes("/hospital")) {
    role = "hospital";
  } else {
    role = searchParams.get("role") || "donor";
  }

  const config = roleConfig[role];
  const { t } = useLanguage();
  const { signIn, user, profile } = useAuth();

  useEffect(() => {
    if (user && profile) {
      if (user.role === 'donor') {
        navigate("/donor/dashboard");
      } else if (user.role === 'hospital') {
        navigate("/hospital/dashboard");
      } else if (user.role === 'admin') {
        navigate("/admin/dashboard");
      }
    }
  }, [user, profile, navigate]);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error: signInError } = await signIn(formData.email, formData.password, role);

    if (signInError) {
      setError(signInError.message || t('login.invalidCredentials'));
      setIsLoading(false);
      return;
    }

    navigate(config.dashboardLink);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel */}
      <div className="flex-1 flex flex-col p-6 lg:p-12">
        <Button variant="ghost" size="sm" className="self-start mb-8" asChild>
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('login.backToHome')}
          </Link>
        </Button>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg border border-border p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-primary-foreground flex items-center justify-center mx-auto mb-4">
                  <config.icon className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold text-primary-foreground mb-2">
                  {role === 'donor' ? 'Donor Login' : t(config.titleKey)}
                </h1>
                <p className="text-primary-foreground/80">
                  {t(config.subtitleKey)}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-primary-foreground">{t('login.email')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-foreground/60" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10 h-12 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-primary-foreground">{t('login.password')}</Label>
                    <Link to="/forgot-password" className="text-sm text-primary-foreground hover:underline">
                      {t('login.forgotPassword')}
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-foreground/60" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="•••••••"
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

                {error && (
                  <div className="p-3 text-sm text-red-300 bg-red-900/30 rounded-md border border-red-500/30">
                    {error}
                  </div>
                )}

                <Button type="submit" variant="hero" size="lg" className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t('login.signingIn')}
                    </>
                  ) : (
                    t('login.signIn')
                  )}
                </Button>
              </form>

              <p className="text-center text-sm text-primary-foreground/80 mt-6">
                {t('login.noAccount')}{" "}
                <Link to="/register" className="text-primary-foreground hover:underline font-medium">
                  {t('register.registerHere')}
                </Link>
              </p>

              <div className="mt-6 pt-6 border-t border-primary-foreground/20">
                <p className="text-center text-sm text-primary-foreground/80 mb-4">
                  {t('login.loginAs')}
                </p>
                <div className="flex justify-center gap-2">
                  {["donor", "hospital"].map((key) => {
                    const value = roleConfig[key];
                    return (
                      <Button
                        key={key}
                        variant={key === role ? "default" : "ghost"}
                        size="sm"
                        className={key === role ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90" : "bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"}
                        asChild
                      >
                        <Link to={`/login?role=${key}`}>
                          <value.icon className="w-4 h-4 mr-1" />
                          {t(`roleSelect.${key}`)}
                        </Link>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>{/* closes card div */}
          </div>{/* closes max-w-md div */}
        </div>{/* closes flex-1 center div */}
      </div>{/* closes left panel div */}

      {/* Right Panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary to-secondary p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-primary-foreground blur-3xl" />
          <div className="absolute bottom-20 left-20 w-64 h-64 rounded-full bg-primary-foreground blur-3xl" />
        </div>

        <div className="text-center text-primary-foreground relative z-10">
          <Heart className="w-24 h-24 mx-auto mb-8 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">{t('login.everyBloodAndOrganCounts')}</h2>
          <p className="text-primary-foreground/80 max-w-md mx-auto">
            {t('login.joinNetwork')}
          </p>

          <div className="mt-12 grid grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold">15K+</p>
              <p className="text-sm text-primary-foreground/70">{t('login.bloodDonations')}</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold">3.2K+</p>
              <p className="text-sm text-primary-foreground/70">{t('login.organDonations')}</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold">200+</p>
              <p className="text-sm text-primary-foreground/70">{t('login.hospitals')}</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold">50K+</p>
              <p className="text-sm text-primary-foreground/70">{t('login.donors')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;