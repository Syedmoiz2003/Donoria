import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Heart, ArrowRight, Shield, Clock, Users, Droplets, Activity, MapPin } from "lucide-react";

const RealisticBloodBag = ({ className }) => (
  <svg className={className} viewBox="0 0 140 180" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="15" y="20" width="110" height="130" rx="8" fill="url(#bagBody)" stroke="#1e293b" strokeWidth="1.5"/>
    <rect x="15" y="20" width="110" height="130" rx="8" fill="url(#plasticSheen)"/>
    <path d="M15 90 L15 140 Q15 150 25 150 L115 150 Q125 150 125 140 L125 90 Q125 95 115 95 L25 95 Q15 95 15 90Z" fill="url(#bloodGradient)"/>
    <ellipse cx="70" cy="90" rx="55" ry="8" fill="#b91c1c"/>
    <rect x="30" y="8" width="12" height="18" rx="2" fill="#334155"/>
    <rect x="58" y="8" width="12" height="18" rx="2" fill="#334155"/>
    <rect x="86" y="8" width="12" height="18" rx="2" fill="#334155"/>
    <rect x="33" y="0" width="6" height="12" rx="1" fill="url(#tubeGradient)"/>
    <rect x="61" y="0" width="6" height="12" rx="1" fill="url(#tubeGradient)"/>
    <rect x="89" y="0" width="6" height="12" rx="1" fill="url(#tubeGradient)"/>
    <rect x="25" y="35" width="90" height="45" rx="4" fill="white" fillOpacity="0.95"/>
    <rect x="28" y="38" width="84" height="39" rx="2" fill="none" stroke="#dc2626" strokeWidth="1"/>
    <path d="M40 58 C40 58 36 64 36 68 C36 71 38 73 40 73 C42 73 44 71 44 68 C44 64 40 58 40 58Z" fill="#dc2626"/>
    <text x="48" y="70" fontSize="10" fill="#1e293b" fontWeight="600" fontFamily="system-ui">BLOOD</text>
    <circle cx="30" cy="130" r="6" fill="#e2e8f0" stroke="#64748b" strokeWidth="1"/>
    <circle cx="110" cy="130" r="6" fill="#e2e8f0" stroke="#64748b" strokeWidth="1"/>
    <path d="M20 25 Q25 25 25 35 L25 45 Q25 55 20 55" stroke="white" strokeWidth="2" strokeOpacity="0.4" fill="none" strokeLinecap="round"/>
    <ellipse cx="50" cy="30" rx="15" ry="8" fill="white" fillOpacity="0.15"/>
    <defs>
      <linearGradient id="bagBody" x1="70" y1="20" x2="70" y2="150" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#f8fafc"/>
        <stop offset="100%" stopColor="#e2e8f0"/>
      </linearGradient>
      <linearGradient id="plasticSheen" x1="70" y1="20" x2="70" y2="150" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="white" stopOpacity="0.6"/>
        <stop offset="30%" stopColor="white" stopOpacity="0.1"/>
        <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.1"/>
      </linearGradient>
      <linearGradient id="bloodGradient" x1="70" y1="90" x2="70" y2="150" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#dc2626"/>
        <stop offset="50%" stopColor="#b91c1c"/>
        <stop offset="100%" stopColor="#991b1b"/>
      </linearGradient>
      <linearGradient id="tubeGradient" x1="36" y1="0" x2="36" y2="12" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#64748b"/>
        <stop offset="100%" stopColor="#334155"/>
      </linearGradient>
    </defs>
  </svg>
);

const RealisticKidney = ({ className }) => (
  <svg className={className} viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 30 C30 30 20 50 20 80 C20 110 25 140 35 160 C45 180 60 190 75 185 C90 180 100 160 105 140 C110 120 115 100 115 80 C115 50 100 30 80 30 C70 30 60 30 50 30Z" fill="url(#kidneyBody)" stroke="#9a3412" strokeWidth="1"/>
    <path d="M45 50 C50 60 55 80 52 100 C49 120 42 140 48 160" fill="none" stroke="#7c2d12" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M60 25 C65 35 70 45 68 55" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" fill="none"/>
    <path d="M75 22 C82 32 85 42 82 52" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" fill="none"/>
    <path d="M55 35 C60 45 65 55 62 65" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" fill="none"/>
    <path d="M48 160 C45 170 50 185 55 195" stroke="#f97316" strokeWidth="5" strokeLinecap="round" fill="none"/>
    <ellipse cx="70" cy="50" rx="20" ry="12" fill="url(#highlight1)"/>
    <ellipse cx="85" cy="90" rx="12" ry="8" fill="url(#highlight2)"/>
    <ellipse cx="65" cy="130" rx="8" ry="6" fill="url(#highlight3)"/>
    <path d="M35 45 Q40 45 40 55" stroke="white" strokeWidth="2" strokeOpacity="0.3" fill="none" strokeLinecap="round"/>
    <path d="M90 40 Q95 40 95 50" stroke="white" strokeWidth="1.5" strokeOpacity="0.25" fill="none" strokeLinecap="round"/>
    <defs>
      <radialGradient id="kidneyBody" cx="80" cy="100" r="70" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#c2410c"/>
        <stop offset="40%" stopColor="#9a3412"/>
        <stop offset="70%" stopColor="#7c2d12"/>
        <stop offset="100%" stopColor="#5c2211"/>
      </radialGradient>
      <radialGradient id="highlight1" cx="70" cy="50" r="20" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ea580c" stopOpacity="0.4"/>
        <stop offset="100%" stopColor="#c2410c" stopOpacity="0"/>
      </radialGradient>
      <radialGradient id="highlight2" cx="85" cy="90" r="12" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ea580c" stopOpacity="0.3"/>
        <stop offset="100%" stopColor="#c2410c" stopOpacity="0"/>
      </radialGradient>
      <radialGradient id="highlight3" cx="65" cy="130" r="8" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ea580c" stopOpacity="0.25"/>
        <stop offset="100%" stopColor="#c2410c" stopOpacity="0"/>
      </radialGradient>
    </defs>
  </svg>
);

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/hero-bg.jpg')" }} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-background" />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute top-1/4 left-0 w-full h-32 opacity-30" viewBox="0 0 1200 100" preserveAspectRatio="none">
          <path d="M0,50 L200,50 L220,50 L240,20 L260,80 L280,50 L300,50 L400,50 L420,50 L440,20 L460,80 L480,50 L500,50 L600,50 L620,50 L640,20 L660,80 L680,50 L700,50 L800,50 L820,50 L840,20 L860,80 L880,50 L900,50 L1000,50 L1020,50 L1040,20 L1060,80 L1080,50 L1100,50 L1200,50" stroke="#22c55e" strokeWidth="2" fill="none" className="animate-pulse"/>
        </svg>
        <svg className="absolute top-1/3 left-0 w-full h-32 opacity-20" viewBox="0 0 1200 100" preserveAspectRatio="none" style={{ animationDelay: '0.5s' }}>
          <path d="M0,50 L150,50 L170,50 L190,30 L210,70 L230,50 L250,50 L350,50 L370,50 L390,30 L410,70 L430,50 L450,50 L550,50 L570,50 L590,30 L610,70 L630,50 L650,50 L750,50 L770,50 L790,30 L810,70 L830,50 L850,50 L950,50 L970,50 L990,30 L1010,70 L1030,50 L1050,50 L1200,50" stroke="#3b82f6" strokeWidth="2" fill="none" className="animate-pulse"/>
        </svg>
      </div>
      <div className="absolute top-20 left-10 w-16 h-16 text-white/10 animate-bounce" style={{ animationDuration: '3s' }}>
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 10h-4V6h-6v4H5v6h4v4h6v-4h4v-6z"/></svg>
      </div>
      <div className="absolute top-40 right-20 w-12 h-12 text-white/10 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 10h-4V6h-6v4H5v6h4v4h6v-4h4v-6z"/></svg>
      </div>
      <div className="absolute bottom-40 left-20 w-14 h-14 text-white/10 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 10h-4V6h-6v4H5v6h4v4h6v-4h4v-6z"/></svg>
      </div>
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive mb-6">
            <span className="w-2 h-2 rounded-full bg-destructive animate-ping" />
            <span className="text-sm font-medium">{t('home.emergencyNeeded')}</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {t('home.saveLives')}{" "}
            <span className="gradient-text">{t('home.bloodOrganDonation')}</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            {t('home.connectWithHospitals')}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10 mb-10">
          <div className="hidden lg:flex flex-col items-center">
            <div className="healthcare-card p-5 float">
              <RealisticKidney className="w-24 h-32" />
            </div>
            <span className="mt-3 text-sm font-semibold text-white">{t('home.organDonation')}</span>
          </div>
          <div className="flex justify-center">
            <Button variant="hero" size="xl" asChild>
              <Link to="/role-select">
                <Heart className="w-5 h-5 mr-2" />
                {t('role.selectRole')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
          <div className="hidden lg:flex flex-col items-center">
            <div className="healthcare-card p-5 float" style={{ animationDelay: "1s" }}>
              <RealisticBloodBag className="w-24 h-32" />
            </div>
            <span className="mt-3 text-sm font-semibold text-white">{t('home.bloodDonation')}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 justify-center mb-12">
          <div className="flex items-center gap-2 text-white">
            <Shield className="w-5 h-5 text-green-400" />
            <span className="text-sm font-medium">{t('home.verifiedHospitals')}</span>
          </div>
          <div className="flex items-center gap-2 text-white">
            <Clock className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-medium">{t('home.support247')}</span>
          </div>
          <div className="flex items-center gap-2 text-white">
            <Users className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-medium">50K+ {t('home.donors')}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
          <div className="healthcare-card text-center p-5">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">15K+</p>
            <p className="text-sm text-muted-foreground">{t('home.livesSaved')}</p>
          </div>
          <div className="healthcare-card text-center p-5">
            <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center mx-auto mb-3">
              <Droplets className="w-6 h-6 text-destructive" />
            </div>
            <p className="text-3xl font-bold text-foreground">50K+</p>
            <p className="text-sm text-muted-foreground">{t('home.donors')}</p>
          </div>
          <div className="healthcare-card text-center p-5">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mx-auto mb-3">
              <Activity className="w-6 h-6 text-secondary" />
            </div>
            <p className="text-3xl font-bold text-foreground">200+</p>
            <p className="text-sm text-muted-foreground">{t('home.hospitals')}</p>
          </div>
          <div className="healthcare-card text-center p-5">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mx-auto mb-3">
              <MapPin className="w-6 h-6 text-success" />
            </div>
            <p className="text-3xl font-bold text-foreground">50+</p>
            <p className="text-sm text-muted-foreground">{t('home.cities')}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="healthcare-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Droplets className="w-5 h-5 text-destructive" />
              </div>
              <h3 className="font-semibold text-foreground">{t('home.bloodDonation')}</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><span className="text-success mt-0.5">✓</span><span>{t('home.bloodInfo1')}</span></li>
              <li className="flex items-start gap-2"><span className="text-success mt-0.5">✓</span><span>{t('home.bloodInfo2')}</span></li>
              <li className="flex items-start gap-2"><span className="text-success mt-0.5">✓</span><span>{t('home.bloodInfo3')}</span></li>
            </ul>
          </div>
          <div className="healthcare-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Heart className="w-5 h-5 text-secondary" />
              </div>
              <h3 className="font-semibold text-foreground">{t('home.organDonation')}</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><span className="text-success mt-0.5">✓</span><span>{t('home.organInfo1')}</span></li>
              <li className="flex items-start gap-2"><span className="text-success mt-0.5">✓</span><span>{t('home.organInfo2')}</span></li>
              <li className="flex items-start gap-2"><span className="text-success mt-0.5">✓</span><span>{t('home.organInfo3')}</span></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
