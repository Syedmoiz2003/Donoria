import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
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
import { toast } from "sonner";
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
  Loader2,
  Activity,
  FileText,
  Phone,
  Mail,
  XCircle,
  LogOut,
  Settings,
} from "lucide-react";

const HospitalRequestDetails = () => {
  const { t } = useLanguage();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [request, setRequest] = useState(null);
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
    loadRequestDetails();
  }, [id]);

  const loadRequestDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await hospitalApi.getRequest(id);
      setRequest(data);
    } catch (err) {
      console.error('Error loading request details:', err);
      setError('Failed to load request details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptResponse = async (responseId) => {
    try {
      await responsesApi.accept(responseId);
      toast.success('Response accepted! Donor has been notified.');
      // Refresh request to update response statuses
      await loadRequestDetails();
    } catch (err) {
      console.error('Failed to accept response:', err);
      toast.error(err.message || 'Failed to accept response');
    }
  };

  const handleRejectResponse = async (responseId) => {
    try {
      await responsesApi.reject(responseId);
      toast.success('Response rejected.');
      await loadRequestDetails();
    } catch (err) {
      console.error('Failed to reject response:', err);
      toast.error(err.message || 'Failed to reject response');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
        <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2">{error || 'Request not found'}</h2>
        <Button asChild variant="outline">
          <Link to="/hospital/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  const responses = request.responses || [];
  const bloodType = request.blood_group ? `${request.blood_group}${request.rh_factor}` : 'N/A';

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
                    request.urgency_level === "critical" ? "bg-destructive text-destructive-foreground" :
                    request.urgency_level === "high" ? "bg-orange-500 text-white" :
                    "bg-yellow-500 text-white"
                  }`}>
                    {request.urgency_level?.toUpperCase()}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(request.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    {request.request_type === 'organ' ? <Heart className="w-5 h-5 text-primary" /> : <Droplets className="w-5 h-5 text-primary" />}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {request.request_type === 'organ' ? `Organ: ${request.organ_type}` : `Blood Type: ${bloodType}`}
                    </p>
                    <p className="text-sm text-muted-foreground">{t('hospitalRequestDetails.unitsNeeded')}: {request.quantity} {request.unit}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Status</p>
                    <p className="text-sm text-muted-foreground uppercase">{request.status}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Deadline</p>
                    <p className="text-sm text-muted-foreground">{new Date(request.deadline).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Description</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{request.description || 'No description provided'}</p>
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
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">{t('hospitalRequestDetails.donorResponses')} ({responses.length})</h2>
          </div>

        <div className="grid gap-4">
          {responses.length === 0 ? (
            <div className="healthcare-card text-center py-12">
              <p className="text-muted-foreground">No responses received yet.</p>
            </div>
          ) : (
            responses.map((response) => {
              const donor = response.donors || {};
              const donorUser = donor.users || {};
              const donorBloodType = donor.blood_group ? `${donor.blood_group}${donor.rh_factor}` : 'N/A';
              
              return (
                <div key={response.id} className="healthcare-card">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        response.status === "completed" ? "bg-success/10" : "bg-primary/10"
                      }`}>
                        {response.status === "completed" ? (
                          <CheckCircle className="w-5 h-5 text-success" />
                        ) : (
                          <UserCheck className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{donorUser.full_name || 'Anonymous Donor'}</p>
                        <p className="text-sm text-muted-foreground">Blood Type: {donorBloodType}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-muted-foreground">{new Date(response.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Activity className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">Compatibility: {response.compatibility_score}%</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-muted-foreground">{donorUser.phone || 'No phone'}</span>
                    </div>
                  </div>

                  {response.message && (
                    <div className="mb-4 p-3 bg-muted/30 rounded-lg text-sm italic">
                      "{response.message}"
                    </div>
                  )}

                  {response.document_url && (
                    <div className="mb-4 flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-xl">
                      <FileText className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">Legal Documentation Attached</p>
                        <p className="text-xs text-muted-foreground">Required for organ donation verification</p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={response.document_url} target="_blank" rel="noopener noreferrer">
                          View Document
                        </a>
                      </Button>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {response.status === 'pending' && (
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="flex-1"
                        onClick={async () => {
                          try {
                            await responsesApi.accept(response.id);
                            loadRequestDetails();
                          } catch (err) {
                            alert(err.message);
                          }
                        }}
                      >
                        {t('hospitalRequestDetails.acceptResponse')}
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
                            loadRequestDetails();
                          } catch (err) {
                            alert(err.message);
                          }
                        }}
                      >
                        Mark Completed
                      </Button>
                    )}
                    {response.status === 'completed' && (
                      <Button variant="outline" size="sm" className="flex-1" disabled>
                        Donation Completed
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={response.status === 'completed' ? "hidden" : ""}
                      asChild
                    >
                      <Link to={`/hospital/response/${response.id}/contact`}>
                        {t('hospitalRequestDetails.contactDonor')}
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
        </div>
      </main>
    </div>
  );
};

export default HospitalRequestDetails;
