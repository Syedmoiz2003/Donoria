import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { donorApi, requestsApi } from "@/lib/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Heart,
  Bell,
  Search,
  Filter,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  MessageCircle,
  User,
  LogOut,
  Activity,
  Droplets,
  Award,
  ChevronRight,
  ArrowLeft,
  Home,
  X,
  Loader2,
} from "lucide-react";

const DonorDashboard = () => {
  const { t, language } = useLanguage();
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedUrgency, setSelectedUrgency] = useState("All");
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [donationHistory, setDonationHistory] = useState([]);
  const [eligibility, setEligibility] = useState(null);
  const [stats, setStats] = useState({
    totalDonations: 0,
    livesSaved: 0,
    healthScore: 98,
    donorLevel: 'Gold',
  });

  const translate = (text) => {
    if (language === 'ur') {
      const dict = {
        'Home': 'ہوم',
        'All': 'تمام',
        'Blood': 'خون',
        'Organ': 'عضو',
        'Critical': 'سخت ضرورت',
        'High': 'زیادہ',
        'Medium': 'درمیانہ',
        'Clear': 'صاف کریں',
        'of': 'میں سے',
        'requests': 'درخواستیں',
        'units of': 'یونٹ',
        'needed': 'مطلوب ہے',
        'Age': 'عمر',
        'Blood:': 'خون:',
        'Organ Donation': 'اعضاء کا عطیہ',
        'Health Assistant': 'صحت کا معاون',
        'AI-powered support': 'مصنوعی ذہانت سے لیس مدد',
        'Start Chat': 'گفتگو شروع کریں',
        'Recent Donations': 'حالیہ عطیات',
        'View Full History': 'پوری تاریخ دیکھیں',
        'Gold': 'سونا',
        'completed': 'مکمل',
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
      
      const [requestsData, historyData, eligibilityData] = await Promise.all([
        donorApi.getRequests(),
        donorApi.getHistory(),
        donorApi.getEligibility(),
      ]);

      setRequests(requestsData || []);
      setDonationHistory(historyData || []);
      setEligibility(eligibilityData);

      if (historyData) {
        setStats(prev => ({
          ...prev,
          totalDonations: historyData.length,
          livesSaved: historyData.length * 3,
        }));
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

  const filteredRequests = requests.filter((request) => {
    const hospitalName = request.hospitals?.hospital_name || '';
    const bloodType = request.blood_group ? `${request.blood_group}${request.rh_factor}` : '';
    const organType = request.organ_type || '';
    
    const matchesSearch = hospitalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bloodType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      organType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "All" || request.request_type === selectedType.toLowerCase();
    const matchesUrgency = selectedUrgency === "All" || request.urgency_level === selectedUrgency.toLowerCase();
    return matchesSearch && matchesType && matchesUrgency;
  });

  const hasActiveFilters = selectedType !== "All" || selectedUrgency !== "All";
  const clearFilters = () => { setSelectedType("All"); setSelectedUrgency("All"); setSearchQuery(""); };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary-foreground" />
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
                <Link to="/donor/chatbot">
                  <MessageCircle className="w-5 h-5" />
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full bg-muted/50 ml-2">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/donor/profile" className="cursor-pointer flex items-center w-full">
                      <User className="w-4 h-4 mr-2" />
                      {t('navbar.editProfile') || 'Edit Profile'}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/donor/settings" className="cursor-pointer flex items-center w-full">
                      <Bell className="w-4 h-4 mr-2" />
                      {t('navbar.notifications') || 'Notifications'}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            {t('dashboard.welcome')}, {profile?.full_name || user?.full_name || 'Donor'}! 👋
          </h1>
          <p className="text-muted-foreground">
            {t('dashboard.eligible')} <span className="font-semibold text-primary">{profile?.blood_group}{profile?.rh_factor || 'O+'}</span> {t('dashboard.registeredOrgan')}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="healthcare-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Droplets className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.totalDonations}</p>
            <p className="text-sm text-muted-foreground">{t('dashboard.totalDonations')}</p>
          </div>

          <div className="healthcare-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                <Heart className="w-5 h-5 text-success" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.livesSaved}</p>
            <p className="text-sm text-muted-foreground">{t('dashboard.livesSaved')}</p>
          </div>

          <div className="healthcare-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-secondary" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">98%</p>
            <p className="text-sm text-muted-foreground">{t('dashboard.healthScore')}</p>
          </div>

          <div className="healthcare-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-warning" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">Gold</p>
            <p className="text-sm text-muted-foreground">{t('dashboard.donorLevel')}</p>
          </div>
        </div>

        {/* Eligibility Card */}
        {eligibility && (
          <div className={`healthcare-card !p-5 border-2 ${eligibility.eligible ? 'border-success/30 bg-success/5' : 'border-warning/30 bg-warning/5'} mb-8`}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl ${eligibility.eligible ? 'bg-success/20' : 'bg-warning/20'} flex items-center justify-center flex-shrink-0`}>
                {eligibility.eligible ? (
                  <CheckCircle className="w-6 h-6 text-success" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-warning" />
                )}
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  {eligibility.eligible ? t('dashboard.eligibleToDonate') : 'Not Eligible to Donate'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {eligibility.eligible ? t('dashboard.nextEligibleDate') : eligibility.reason}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* All Requests */}
          <div className="lg:col-span-2" id="requests-section">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
              <h2 className="text-xl font-bold text-foreground">{t('dashboard.urgentRequests')}</h2>
              <p className="text-sm text-muted-foreground">{filteredRequests.length} {translate('of')} {requests.length} {translate('requests')}</p>
            </div>

            {/* Search & Filter */}
            <div className="flex gap-3 mb-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder={t('dashboard.search')}
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-5 h-5" />
              </Button>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {["All", "Blood", "Organ"].map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                >
                  {type === "Blood" && <Droplets className="w-3.5 h-3.5 mr-1" />}
                  {type === "Organ" && <Heart className="w-3.5 h-3.5 mr-1" />}
                  {translate(type)}
                </Button>
              ))}
              <span className="text-border">|</span>
              {["All", "Critical", "High", "Medium"].map((level) => (
                <Button
                  key={`u-${level}`}
                  variant={selectedUrgency === level ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedUrgency(level)}
                >
                  {translate(level)}
                </Button>
              ))}
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                  <X className="w-3.5 h-3.5 mr-1" /> {translate('Clear')}
                </Button>
              )}
            </div>
            {/* Request Cards */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRequests.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No matching requests found</p>
                  </div>
                ) : (
                  filteredRequests.map((request) => {
                    const hospital = request.hospitals || {};
                    const bloodType = request.blood_group ? `${request.blood_group}${request.rh_factor}` : '';
                    
                    return (
                      <div
                        key={request.id}
                        className={`healthcare-card !p-5 ${request.urgency_level === "critical" ? "border-2 border-destructive/30" : ""
                          }`}
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${request.urgency_level === "critical"
                                ? "bg-destructive text-destructive-foreground"
                                : request.urgency_level === "high"
                                  ? "bg-warning text-warning-foreground"
                                  : "bg-primary text-primary-foreground"
                              }`}>
                              {request.request_type === "organ" ? (
                                <Heart className="w-6 h-6" />
                              ) : (
                                bloodType
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-foreground">{hospital.hospital_name}</h3>
                                {hospital.is_verified && (
                                  <CheckCircle className="w-4 h-4 text-success" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {request.request_type === "organ"
                                  ? `${request.organ_type} ${translate('needed')}`
                                  : `${request.quantity} ${translate('units of')} ${bloodType} ${translate('needed')}`
                                }
                              </p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${request.urgency_level === "critical"
                              ? "bg-destructive/10 text-destructive"
                              : request.urgency_level === "high"
                                ? "bg-warning/10 text-warning"
                                : "bg-primary/10 text-primary"
                            }`}>
                            {translate(request.urgency_level.toUpperCase())}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {hospital.city || 'Location'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(request.deadline).toLocaleDateString()}
                          </div>
                          {request.request_type === "organ" && (
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4 text-destructive" />
                              {translate('Organ Donation')}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 pt-4 border-t border-border gap-4 mb-4">
                          <div className="flex flex-col sm:flex-row justify-between w-full sm:w-auto gap-4">
                            <div className="text-left sm:text-right">
                              <p className="text-sm text-muted-foreground">{t('dashboard.needed')}</p>
                              <p className="font-bold text-foreground">{request.quantity} {request.unit}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                          <Button variant="outline" className="w-full sm:w-auto" asChild>
                            <Link to={`/donor/request/${request.id}`}>
                              {t('dashboard.viewDetails')}
                            </Link>
                          </Button>
                          <Button className="w-full sm:w-auto gap-2" asChild>
                            <Link to={`/donor/request/${request.id}/respond`}>
                              <Heart className="w-4 h-4" />
                              {t('requestDetails.submitResponseButton')}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Chatbot */}
            <div className="healthcare-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{translate('Health Assistant')}</h3>
                  <p className="text-sm text-muted-foreground">{translate('AI-powered support')}</p>
                </div>
              </div>
              <Button variant="secondary" className="w-full" asChild>
                <Link to="/donor/chatbot">
                  {translate('Start Chat')}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>

            {/* Donation History */}
            <div className="healthcare-card">
              <h3 className="font-semibold text-foreground mb-4">{translate('Recent Donations')}</h3>
              <div className="space-y-3">
                {donationHistory.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No donation history yet</p>
                ) : (
                  donationHistory.slice(0, 5).map((donation, i) => {
                    const hospital = donation.donation_requests?.hospitals || {};
                    return (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div>
                          <p className="text-sm font-medium text-foreground">{hospital.hospital_name || 'Hospital'}</p>
                          <p className="text-xs text-muted-foreground">{new Date(donation.created_at).toLocaleDateString()}</p>
                        </div>
                        <span className="text-xs text-success font-medium flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          {donation.donation_requests?.request_type || 'Blood'}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-3" asChild>
                <Link to="/donor/history">
                  {translate('View Full History')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DonorDashboard;
