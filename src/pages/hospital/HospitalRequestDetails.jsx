import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  ArrowLeft,
  UserCheck,
  Edit,
  Droplets,
  Clock,
  MapPin,
  Shield,
  CheckCircle,
  AlertTriangle,
  Heart,
  ChevronRight,
  Building2,
  Bell,
  User,
} from "lucide-react";

const HospitalRequestDetails = () => {
  const { t } = useLanguage();
  const [request] = useState({
    id: 1,
    bloodType: "O-",
    units: 3,
    urgency: "critical",
    responses: 5,
    posted: "2 hours ago",
    status: "active",
    type: "blood",
    hospital: "City General Hospital",
    contact: "+1 (555) 123-4567",
    location: "123 Main St, City, State",
  });

  const responses = [
    {
      id: 1,
      donorName: "John Doe",
      bloodType: "O+",
      phone: "+1 (555) 987-6543",
      distance: "2.5 km",
      time: "15 min ago",
      status: "available",
    },
    {
      id: 2,
      donorName: "Jane Smith",
      bloodType: "O-",
      phone: "+1 (555) 234-5678",
      distance: "3.2 km",
      time: "30 min ago",
      status: "available",
    },
    {
      id: 3,
      donorName: "Mike Johnson",
      bloodType: "O+",
      phone: "+1 (555) 456-7890",
      distance: "1.8 km",
      time: "1 hour ago",
      status: "available",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/hospital/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">
                Donoria
              </span>
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
            <Link to="/hospital/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('hospitalRequestDetails.backToDashboard')}
            </Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="healthcare-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">{t('hospitalRequestDetails.title')}</h2>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    request.urgency === "critical" ? "bg-destructive text-destructive-foreground" :
                    request.urgency === "high" ? "bg-orange-500 text-white" :
                    "bg-yellow-500 text-white"
                  }`}>
                    {request.posted}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {request.urgency}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Droplets className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{t('hospitalRequestDetails.bloodType')}: {request.bloodType}</p>
                    <p className="text-sm text-muted-foreground">{t('hospitalRequestDetails.unitsNeeded')}: {request.units}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{t('hospitalRequestDetails.hospital')}</p>
                    <p className="text-sm text-muted-foreground">{request.hospital}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{t('hospitalRequestDetails.location')}</p>
                    <p className="text-sm text-muted-foreground">{request.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{t('hospitalRequestDetails.contact')}</p>
                    <p className="text-sm text-muted-foreground">{request.contact}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="healthcare-card">
              <h3 className="font-semibold text-foreground mb-4">{t('hospitalRequestDetails.quickActions')}</h3>
              <div className="space-y-2">
                <Button variant="secondary" className="w-full justify-start" asChild>
                  <Link to={`/hospital/request/${request.id}/edit`}>
                    <Edit className="w-4 h-4 mr-2" />
                    {t('hospitalRequestDetails.editRequest')}
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to={`/hospital/request/${request.id}/responses`}>
                    <UserCheck className="w-4 h-4 mr-2" />
                    {t('hospitalRequestDetails.viewResponses')}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">{t('hospitalRequestDetails.donorResponses')} ({responses.length})</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/hospital/responses">
                {t('hospitalRequestDetails.viewAllResponses')}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>

        <div className="grid gap-4">
          {responses.map((response) => (
            <div key={response.id} className="healthcare-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    response.status === "available" ? "bg-success/10" : "bg-muted/10"
                  }`}>
                    {response.status === "available" ? (
                      <CheckCircle className="w-5 h-5 text-success" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{response.donorName}</p>
                    <p className="text-sm text-muted-foreground">{response.bloodType}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm text-muted-foreground">{response.time}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Heart className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">{response.distance}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm text-muted-foreground">{response.phone}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="default" size="sm" className="flex-1">
                  {t('hospitalRequestDetails.acceptResponse')}
                </Button>
                <Button variant="outline" size="sm">
                  {t('hospitalRequestDetails.contactDonor')}
                </Button>
              </div>
            </div>
          ))}
        </div>
        </div>
      </main>
    </div>
  );
};

export default HospitalRequestDetails;
