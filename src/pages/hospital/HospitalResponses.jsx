import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  ArrowLeft,
  UserCheck,
  MessageCircle,
  Droplets,
  Clock,
  MapPin,
  Shield,
  CheckCircle,
  AlertTriangle,
  Heart,
  Filter,
  Search,
  Building2,
  Bell,
  User,
} from "lucide-react";

const HospitalResponses = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const responses = [
    {
      id: 1,
      donorName: "John Doe",
      bloodType: "O+",
      phone: "+1 (555) 987-6543",
      distance: "2.5 km",
      time: "15 min ago",
      status: "available",
      request: {
        id: 1,
        bloodType: "O-",
        units: 3,
        urgency: "critical",
        hospital: "City General Hospital",
      },
    },
    {
      id: 2,
      donorName: "Jane Smith",
      bloodType: "O-",
      phone: "+1 (555) 234-5678",
      distance: "3.2 km",
      time: "30 min ago",
      status: "available",
      request: {
        id: 2,
        bloodType: "AB+",
        units: 2,
        urgency: "high",
        hospital: "Memorial Medical Center",
      },
    },
    {
      id: 3,
      donorName: "Mike Johnson",
      bloodType: "O+",
      phone: "+1 (555) 456-7890",
      distance: "1.8 km",
      time: "1 hour ago",
      status: "available",
      request: {
        id: 3,
        bloodType: "B+",
        units: 4,
        urgency: "medium",
        hospital: "St. Mary's Hospital",
      },
    },
  ];

  const filteredResponses = responses.filter((response) => {
    if (filterStatus === "all") return true;
    return response.status === filterStatus;
  });

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
                <MessageCircle className="w-5 h-5" />
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
              {t('hospitalResponses.backToDashboard')}
            </Link>
          </Button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{t('hospitalResponses.title')}</h1>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                placeholder={t('hospitalResponses.searchPlaceholder')}
                className="pl-10 h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <Button
            variant={filterStatus === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilterStatus("all")}
          >
            {t('hospitalResponses.all')} ({responses.length})
          </Button>
          <Button
            variant={filterStatus === "available" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilterStatus("available")}
          >
            {t('hospitalResponses.available')}
          </Button>
          <Button
            variant={filterStatus === "pending" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilterStatus("pending")}
          >
            {t('hospitalResponses.pending')}
          </Button>
        </div>

        <div className="grid gap-4">
          {filteredResponses.map((response) => (
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

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Droplets className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t('hospitalResponses.request')}: {response.request.bloodType}</p>
                    <p className="text-xs text-muted-foreground">{response.request.units} {t('hospitalResponses.units')}</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-muted/10 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">{response.request.hospital}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="default" size="sm" className="flex-1">
                  {t('hospitalResponses.acceptResponse')}
                </Button>
                <Button variant="outline" size="sm">
                  {t('hospitalResponses.contactDonor')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default HospitalResponses;
