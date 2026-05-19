import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { hospitalApi } from "@/lib/api";
import {
  Heart,
  Bell,
  Building2,
  Plus,
  Users,
  Activity,
  CheckCircle,
  Clock,
  AlertTriangle,
  Settings,
  LogOut,
  ChevronRight,
  Droplets,
  UserCheck,
  FileText,
  TrendingUp,
  Home,
  Loader2,
} from "lucide-react";

const HospitalDashboard = () => {
  const { t, language } = useLanguage();
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [responses, setResponses] = useState([]);
  const [stats, setStats] = useState({
    activeRequests: 0,
    donorResponses: 0,
    requestsFulfilled: 0,
    avgResponseTime: '2.1h',
  });

  const translate = (text) => {
    if (language === 'ur') {
      const dict = {
        'Home': 'ہوم',
        'City General Hospital': 'سٹی جنرل ہسپتال',
        'responses': 'جوابات',
        'Jan 2024': 'جنوری 2024',
      };
      return dict[text] || text;
    }
    return text;
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [requestsData, responsesData] = await Promise.all([
        hospitalApi.getRequests(),
        hospitalApi.getResponses(),
      ]);

      setRequests(requestsData || []);
      setResponses(responsesData || []);

      const activeCount = requestsData?.filter(r => r.status === 'active').length || 0;
      const fulfilledCount = requestsData?.filter(r => r.status === 'fulfilled').length || 0;
      
      setStats({
        activeRequests: activeCount,
        donorResponses: responsesData?.length || 0,
        requestsFulfilled: fulfilledCount,
        avgResponseTime: '2.1h',
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <Building2 className="w-6 h-6 text-secondary-foreground" />
              </div>
              <span className="font-bold text-lg">
                Donoria
              </span>
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/">
                  <Home className="w-4 h-4 mr-1" />
                  {translate('Home')}
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/hospital/settings">
                  <Settings className="w-5 h-5" />
                </Link>
              </Button>
              <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg ${profile?.is_verified ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">{profile?.is_verified ? t('hospitalDashboard.verified') : 'Pending Verification'}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
              {profile?.hospital_name || user?.full_name || 'Hospital'}
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              {profile?.is_verified ? (
                <>
                  <CheckCircle className="w-4 h-4 text-success" />
                  {t('hospitalDashboard.verifiedInstitution')} • {t('hospitalDashboard.registrationNumber')}{profile?.license_number || 'N/A'}
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  Verification Pending • License: {profile?.license_number || 'N/A'}
                </>
              )}
            </p>
          </div>
          {profile?.is_verified && (
            <Button variant="hero" size="lg" asChild>
              <Link to="/hospital/post-request">
                <Plus className="w-5 h-5 mr-2" />
                {t('hospitalDashboard.postNewRequest')}
              </Link>
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="healthcare-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">3</p>
            <p className="text-sm text-muted-foreground">{t('hospitalDashboard.activeRequests')}</p>
          </div>

          <div className="healthcare-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">16</p>
            <p className="text-sm text-muted-foreground">{t('hospitalDashboard.donorResponses')}</p>
          </div>

          <div className="healthcare-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.requestsFulfilled}</p>
            <p className="text-sm text-muted-foreground">{t('hospitalDashboard.requestsFulfilled')}</p>
          </div>

          <div className="healthcare-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-secondary" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">2.1h</p>
            <p className="text-sm text-muted-foreground">{t('hospitalDashboard.avgResponseTime')}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Active Requests */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">{t('hospitalDashboard.activeRequests')}</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/hospital/requests">{t('hospitalDashboard.viewAll')}</Link>
              </Button>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : requests.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No active requests</p>
                </div>
              ) : (
                requests.slice(0, 5).map((request) => {
                  const bloodType = request.blood_group ? `${request.blood_group}${request.rh_factor}` : '';
                  const responseCount = responses.filter(r => r.request_id === request.id).length;
                  
                  return (
                    <div
                      key={request.id}
                      className={`healthcare-card !p-5 ${request.urgency_level === "critical" ? "border-2 border-destructive/30" : ""
                        }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl ${request.urgency_level === "critical"
                              ? "bg-destructive text-destructive-foreground"
                              : request.urgency_level === "high"
                                ? "bg-warning text-warning-foreground"
                                : "bg-primary text-primary-foreground"
                            }`}>
                            {request.request_type === "organ" ? (
                              <Heart className="w-7 h-7" />
                            ) : (
                              bloodType
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">
                              {request.request_type === "organ"
                                ? `${request.organ_type} ${t('hospitalDashboard.needed')}`
                                : `${request.quantity} ${t('hospitalDashboard.unitsOf')} ${bloodType} ${t('hospitalDashboard.needed')}`
                              }
                            </p>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {new Date(request.created_at).toLocaleDateString()}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${request.urgency_level === "critical"
                                  ? "bg-destructive/10 text-destructive"
                                  : request.urgency_level === "high"
                                    ? "bg-warning/10 text-warning"
                                    : "bg-primary/10 text-primary"
                                }`}>
                                {request.urgency_level.toUpperCase()}
                              </span>
                              {request.request_type === "organ" && (
                                <span className="flex items-center gap-1 ml-2">
                                  <Heart className="w-4 h-4 text-destructive" />
                                  {t('hospitalDashboard.organ')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">{responseCount}</p>
                          <p className="text-xs text-muted-foreground">{translate('responses')}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="default" className="flex-1" asChild>
                          <Link to={`/hospital/request/${request.id}/responses`}>
                            <UserCheck className="w-4 h-4 mr-2" />
                            {t('hospitalDashboard.viewResponses')}
                          </Link>
                        </Button>
                        <Button variant="outline" asChild>
                          <Link to={`/hospital/request/${request.id}/edit`}>
                            {t('hospitalDashboard.edit')}
                          </Link>
                        </Button>
                        <Button variant="ghost" className="text-destructive hover:text-destructive">
                          {t('hospitalDashboard.close')}
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Donor Responses */}
            <div className="healthcare-card">
              <h3 className="font-semibold text-foreground mb-4">{t('hospitalDashboard.recentResponses')}</h3>
              <div className="space-y-3">
                {responses.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No responses yet</p>
                ) : (
                  responses.slice(0, 5).map((response, i) => {
                    const donor = response.donors || {};
                    const donorUser = donor.users || {};
                    const bloodType = donor.blood_group ? `${donor.blood_group}${donor.rh_factor}` : '';
                    
                    return (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-bold text-primary">{bloodType || 'N/A'}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{donorUser.full_name || 'Donor'}</p>
                            <p className="text-xs text-muted-foreground">
                              {response.compatibility_score || 0}% {t('hospitalDashboard.compatible')}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${response.status === "accepted"
                            ? "bg-success/10 text-success"
                            : response.status === "completed"
                              ? "bg-success/10 text-success"
                              : "bg-warning/10 text-warning"
                          }`}>
                          {response.status.charAt(0).toUpperCase() + response.status.slice(1)}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-3" asChild>
                <Link to="/hospital/responses">
                  {t('hospitalDashboard.viewAllResponses')}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="healthcare-card">
              <h3 className="font-semibold text-foreground mb-4">{t('hospitalDashboard.quickActions')}</h3>
              <div className="space-y-2">
                <Button variant="secondary" className="w-full justify-start" asChild>
                  <Link to="/hospital/post-request">
                    <Plus className="w-4 h-4 mr-2" />
                    {t('hospitalDashboard.postNewRequest')}
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/hospital/inventory">
                    <Droplets className="w-4 h-4 mr-2" />
                    {t('hospitalDashboard.bloodInventory')}
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/hospital/reports">
                    <FileText className="w-4 h-4 mr-2" />
                    {t('hospitalDashboard.reports')}
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/hospital/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    {t('hospitalDashboard.settings')}
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  {t('hospitalDashboard.signOut')}
                </Button>
              </div>
            </div>

            {/* Verification Status */}
            <div className={`healthcare-card border-2 ${profile?.is_verified ? 'border-success/30 bg-success/5' : 'border-warning/30 bg-warning/5'}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl ${profile?.is_verified ? 'bg-success/20' : 'bg-warning/20'} flex items-center justify-center`}>
                  {profile?.is_verified ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-warning" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {profile?.is_verified ? t('hospitalDashboard.verifiedInstitution') : 'Verification Pending'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {profile?.is_verified 
                      ? `${t('hospitalDashboard.since')} ${new Date(profile.verified_at).toLocaleDateString()}`
                      : 'Submit documents for verification'
                    }
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {profile?.is_verified 
                  ? t('hospitalDashboard.verifiedDescription')
                  : 'Upload verification documents to post donation requests'
                }
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HospitalDashboard;
