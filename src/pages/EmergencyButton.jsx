import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Phone,
  MapPin,
  Clock,
  Droplets,
  AlertTriangle,
  Shield,
  Ambulance,
  Heart,
  ArrowLeft,
  Bell,
  User,
  CheckCircle,
} from "lucide-react";

const EmergencyButton = () => {
  const { t } = useLanguage();
  const [isActivated, setIsActivated] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [alertSent, setAlertSent] = useState(false);
  const [emergencyType, setEmergencyType] = useState("");

  const emergencyTypes = [
    {
      id: "blood",
      title: t('emergency.bloodEmergency'),
      description: t('emergency.bloodEmergencyDesc'),
      icon: Droplets,
      color: "bg-red-500",
      urgency: "critical",
    },
    {
      id: "organ",
      title: t('emergency.organTransplant'),
      description: t('emergency.organTransplantDesc'),
      icon: Heart,
      color: "bg-purple-500",
      urgency: "critical",
    },
    {
      id: "accident",
      title: t('emergency.accidentEmergency'),
      description: t('emergency.accidentEmergencyDesc'),
      icon: Ambulance,
      color: "bg-blue-500",
      urgency: "critical",
    },
    {
      id: "other",
      title: t('emergency.otherEmergency'),
      description: t('emergency.otherEmergencyDesc'),
      icon: AlertTriangle,
      color: "bg-orange-500",
      urgency: "high",
    },
  ];

  const handleEmergencyActivate = (type) => {
    setEmergencyType(type);
    setIsActivated(true);
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setAlertSent(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelEmergency = () => {
    setIsActivated(false);
    setCountdown(10);
    setEmergencyType("");
  };

  if (isActivated) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 glass border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center overflow-hidden">
                  <img src="/favicon.ico" alt="Donoria Logo" className="w-7 h-7 object-contain" />
                </div>
                <span className="font-bold text-lg">Donoria</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          <div className="max-w-2xl mx-auto">
            <div className="emergency-card text-center p-8">
              <div className="w-24 h-24 rounded-full bg-destructive flex items-center justify-center mx-auto mb-6 pulse-emergency">
                <AlertTriangle className="w-12 h-12 text-white" />
              </div>
              
              <h1 className="text-3xl font-bold text-foreground mb-4">
                {t('emergency.alertActivated')}
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                {emergencyType === "blood" && t('emergency.bloodAlertSending')}
                {emergencyType === "organ" && t('emergency.organAlertSending')}
                {emergencyType === "accident" && t('emergency.accidentAlertSending')}
                {emergencyType === "other" && t('emergency.generalAlertSending')}
              </p>

              <div className="text-6xl font-bold text-destructive mb-8">
                {countdown}
              </div>

              <p className="text-lg text-muted-foreground mb-8">
                {t('emergency.sendingAlert')}
              </p>

              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={cancelEmergency}
                  className="px-8"
                >
                  {t('emergency.cancelEmergency')}
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center overflow-hidden">
                  <img src="/favicon.ico" alt="Donoria Logo" className="w-7 h-7 object-contain" />
                </div>
                <span className="font-bold text-lg">Donoria</span>
              </Link>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
              </Button>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('emergency.backToHome')}
            </Link>
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {t('emergency.emergencyAssistance')}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t('emergency.emergencyAssistanceDesc')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {emergencyTypes.map((type) => {
              const Icon = type.icon;
              return (
                <div
                  key={type.id}
                  className="healthcare-card p-6 cursor-pointer hover:border-destructive/50 transition-all duration-300"
                  onClick={() => handleEmergencyActivate(type.id)}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-16 h-16 rounded-xl ${type.color} flex items-center justify-center`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{type.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        type.urgency === "critical" 
                          ? "bg-destructive text-destructive-foreground" 
                          : "bg-warning text-warning-foreground"
                      }`}>
                        {type.urgency.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{type.description}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Button
              variant="emergency"
              size="xl"
              className="px-12 py-6 text-2xl font-bold"
              onClick={() => handleEmergencyActivate("blood")}
            >
              <AlertTriangle className="w-8 h-8 mr-3" />
              {t('emergency.emergencyButton')}
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              {t('emergency.clickToActivate')}
            </p>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <div className="stat-card text-center">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{t('emergency.locationSharing')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('emergency.locationSharingDesc')}
              </p>
            </div>

            <div className="stat-card text-center">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-success" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{t('emergency.verifiedNetwork')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('emergency.verifiedNetworkDesc')}
              </p>
            </div>

            <div className="stat-card text-center">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{t('emergency.available247')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('emergency.available247Desc')}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmergencyButton;
