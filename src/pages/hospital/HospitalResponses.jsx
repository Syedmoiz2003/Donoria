import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { hospitalApi, responsesApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  LogOut,
  Settings,
} from "lucide-react";

const HospitalResponses = () => {
  const { t } = useLanguage();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle scroll behavior
  useEffect(() => {
    const controlHeader = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    window.addEventListener('scroll', controlHeader);
    return () => {
      window.removeEventListener('scroll', controlHeader);
    };
  }, [lastScrollY]);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const data = await hospitalApi.getResponses();
        const formatted = data.map(resp => ({
          id: resp.id,
          donorName: resp.donors?.users?.full_name || "Unknown Donor",
          bloodType: (resp.donors?.blood_group || "") + (resp.donors?.rh_factor || ""),
          phone: resp.donors?.users?.phone || "N/A",
          distance: "2.5 km away",
          time: new Date(resp.created_at).toLocaleDateString(),
          status: resp.status || "pending",
          request: {
            id: resp.request_id,
            bloodType: (resp.donation_requests?.blood_group || "") + (resp.donation_requests?.rh_factor || ""),
            units: resp.donation_requests?.quantity,
            urgency: resp.donation_requests?.urgency_level || "critical",
            hospital: "Your Hospital",
          },
        }));
        setResponses(formatted);
      } catch (error) {
        console.error("Failed to load responses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResponses();
  }, []);

  const filteredResponses = responses.filter((response) => {
    if (filterStatus === "all") return true;
    return response.status === filterStatus;
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background">Loading responses...</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className={`sticky top-0 z-50 glass border-b border-border transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
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
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full bg-muted/50 ml-2">
                    <User className="w-5 h-5 text-primary" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer flex items-center w-full">
                      <User className="w-4 h-4 mr-2" />
                      {t('navbar.editProfile') || 'Edit Profile'}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/hospital/settings" className="cursor-pointer flex items-center w-full">
                      <Settings className="w-4 h-4 mr-2" />
                      {t('navbar.settings') || 'Settings'}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={async () => {
                      await signOut();
                      navigate('/login');
                    }} 
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('navbar.signOut') || 'Sign Out'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Button
            variant={filterStatus === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilterStatus("all")}
          >
            {t('hospitalResponses.all')} ({responses.length})
          </Button>
          <Button
            variant={filterStatus === "pending" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilterStatus("pending")}
          >
            {t('hospitalResponses.pending')}
          </Button>
          <Button
            variant={filterStatus === "accepted" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilterStatus("accepted")}
          >
            Accepted
          </Button>
          <Button
            variant={filterStatus === "completed" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilterStatus("completed")}
          >
            Completed
          </Button>
        </div>

        <div className="grid gap-4">
          {filteredResponses.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground healthcare-card">
              <p>No responses found for this filter</p>
            </div>
          ) : (
            filteredResponses.map((response) => (
              <div key={response.id} className="healthcare-card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      response.status === "accepted" || response.status === "completed" ? "bg-success/10" : "bg-warning/10"
                    }`}>
                      {response.status === "accepted" || response.status === "completed" ? (
                        <CheckCircle className="w-5 h-5 text-success" />
                      ) : (
                        <Clock className="w-5 h-5 text-warning" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{response.donorName}</p>
                      <p className="text-sm text-muted-foreground">{response.bloodType}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-muted-foreground">{response.time}</span>
                    <div className={`mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold inline-block ${
                      response.status === 'accepted' ? 'bg-success/10 text-success' :
                      response.status === 'completed' ? 'bg-primary/10 text-primary' :
                      'bg-warning/10 text-warning'
                    }`}>
                      {response.status.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-primary" />
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
                  </div>
                </div>

                <div className="flex gap-2">
                  {response.status === 'pending' && (
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="flex-1"
                      onClick={async () => {
                        try {
                          await responsesApi.accept(response.id);
                          setResponses(prev => prev.map(r => r.id === response.id ? {...r, status: 'accepted'} : r));
                        } catch (err) {
                          alert(err.message);
                        }
                      }}
                    >
                      {t('hospitalResponses.acceptResponse')}
                    </Button>
                  )}
                  {response.status === 'accepted' && (
                    <Button 
                      variant="success" 
                      size="sm" 
                      className="flex-1"
                      onClick={async () => {
                        try {
                          await responsesApi.complete(response.id);
                          setResponses(prev => prev.map(r => r.id === response.id ? {...r, status: 'completed'} : r));
                        } catch (err) {
                          alert(err.message);
                        }
                      }}
                    >
                      Mark Completed
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={response.status === 'pending' || response.status === 'accepted' ? "" : "flex-1"}
                    asChild
                  >
                    <Link to={`/hospital/response/${response.id}/contact`}>
                      {t('hospitalResponses.contactDonor')}
                    </Link>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default HospitalResponses;
