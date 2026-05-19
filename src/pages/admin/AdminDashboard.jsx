import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { adminApi } from "@/lib/api";
import {
  Shield,
  Bell,
  Settings,
  LogOut,
  Building2,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  AlertTriangle,
  Activity,
  FileText,
  MessageSquare,
  ChevronRight,
  Eye,
  Heart,
  Home,
  Loader2,
} from "lucide-react";

const AdminDashboard = () => {
  const { t, language } = useLanguage();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [pendingHospitals, setPendingHospitals] = useState([]);
  const [stats, setStats] = useState({
    pendingVerifications: 0,
    verifiedHospitals: 0,
    totalDonors: 0,
    organRequests: 0,
  });

  const translate = (text) => {
    if (language === 'ur') {
      const dict = {
        'Home': 'ہوم',
        'Reg:': 'رجسٹریشن نمبر:',
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
      const data = await adminApi.getDashboard();
      setDashboardData(data);
      
      if (data.stats) {
        setStats({
          pendingVerifications: data.stats.hospitals || 0,
          verifiedHospitals: data.stats.hospitals || 0,
          totalDonors: data.stats.donors || 0,
          organRequests: data.stats.donationRequests || 0,
        });
      }

      if (data.recentActivity) {
        setPendingHospitals(data.recentActivity.users?.filter(u => u.role === 'hospital') || []);
      }
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
              <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center">
                <Shield className="w-6 h-6 text-background" />
              </div>
              <span className="font-bold text-lg">
                {t('adminDashboard.title')}
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
                <Link to="/admin/settings">
                  <Settings className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            {t('adminDashboard.welcome')}
          </h1>
          <p className="text-muted-foreground">
            {t('adminDashboard.welcomeDescription')}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="healthcare-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-warning" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">3</p>
            <p className="text-sm text-muted-foreground">{t('adminDashboard.pendingVerifications')}</p>
          </div>

          <div className="healthcare-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-success" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">215</p>
            <p className="text-sm text-muted-foreground">{t('adminDashboard.verifiedHospitals')}</p>
          </div>

          <div className="healthcare-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.totalDonors}</p>
            <p className="text-sm text-muted-foreground">{t('adminDashboard.totalDonors')}</p>
          </div>

          <div className="healthcare-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <Heart className="w-5 h-5 text-destructive" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.organRequests}</p>
            <p className="text-sm text-muted-foreground">{t('adminDashboard.organRequests')}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Pending Hospital Verifications */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                {t('adminDashboard.pendingVerifications')}
              </h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/verify">{t('adminDashboard.viewAll')}</Link>
              </Button>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : pendingHospitals.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No pending verifications</p>
                </div>
              ) : (
                pendingHospitals.slice(0, 5).map((hospital) => (
                  <div key={hospital.id} className="healthcare-card !p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-secondary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{hospital.full_name || 'Hospital'}</h3>
                          <p className="text-sm text-muted-foreground">
                            {translate('Reg:')} {hospital.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${hospital.is_active ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                          {hospital.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(hospital.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="default" className="flex-1" asChild>
                        <Link to={`/admin/users`}>
                          <Eye className="w-4 h-4 mr-2" />
                          {t('adminDashboard.reviewDocuments')}
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="healthcare-card">
              <h3 className="font-semibold text-foreground mb-4">{t('adminDashboard.todaysActivity')}</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">{t('adminDashboard.newRegistrations')}</span>
                  <span className="font-semibold text-foreground">47</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">{t('adminDashboard.donationsCompleted')}</span>
                  <span className="font-semibold text-success">23</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">{t('adminDashboard.activeRequests')}</span>
                  <span className="font-semibold text-destructive">18</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">{t('adminDashboard.feedbackReceived')}</span>
                  <span className="font-semibold text-foreground">8</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="healthcare-card">
              <h3 className="font-semibold text-foreground mb-4">{t('adminDashboard.recentActivity')}</h3>
              <div className="space-y-3">
                {dashboardData?.recentActivity?.users?.slice(0, 5).map((activity, i) => (
                  <div key={i} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{activity.full_name || 'New User'}</p>
                      <p className="text-xs text-muted-foreground">{new Date(activity.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
                {(!dashboardData?.recentActivity?.users || dashboardData.recentActivity.users.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="healthcare-card">
              <h3 className="font-semibold text-foreground mb-4">{t('adminDashboard.adminActions')}</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/admin/verify">
                    <Building2 className="w-4 h-4 mr-2" />
                    {t('adminDashboard.verifyHospitals')}
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/admin/users">
                    <Users className="w-4 h-4 mr-2" />
                    {t('adminDashboard.manageUsers')}
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/admin/analytics">
                    <Activity className="w-4 h-4 mr-2" />
                    {t('adminDashboard.viewAnalytics')}
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/admin/feedback">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {t('adminDashboard.moderateFeedback')}
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  {t('adminDashboard.signOut')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
