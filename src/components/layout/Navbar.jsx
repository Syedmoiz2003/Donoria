import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import LanguageSelector from "@/components/ui/LanguageSelector";
import { 
  Heart, 
  Menu, 
  X, 
  User, 
  Building2, 
  Shield,
  ChevronDown,
  Lock,
  LogOut,
  Settings,
  LayoutDashboard
} from "lucide-react";

const ADMIN_EMAIL = "admin@lifelink.com";
const ADMIN_PASSWORD = "admin123";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const adminDropdownRef = useRef(null);
  const userMenuRef = useRef(null);

  const isActive = (path) => location.pathname === path;
  const isLoggedIn = !!user;

  // Detect user role from Supabase tables
  useEffect(() => {
    const detectUserRole = async () => {
      if (!user) {
        setUserRole(null);
        return;
      }

      // Check if user is in donors table
      const { data: donorData } = await supabase
        .from('donors')
        .select('id')
        .eq('id', user.id)
        .single();

      if (donorData) {
        setUserRole('donor');
        return;
      }

      // Check if user is in hospitals table
      const { data: hospitalData } = await supabase
        .from('hospitals')
        .select('id')
        .eq('id', user.id)
        .single();

      if (hospitalData) {
        setUserRole('hospital');
        return;
      }

      setUserRole(null);
    };

    detectUserRole();
  }, [user]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target)) {
        setShowAdminLogin(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowAdminLogin(false);
        setShowUserMenu(false);
      }
    };

    if (showAdminLogin || showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showAdminLogin, showUserMenu]);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setAdminError("");
    
    if (adminEmail === ADMIN_EMAIL && adminPassword === ADMIN_PASSWORD) {
      setShowAdminLogin(false);
      setAdminEmail("");
      setAdminPassword("");
      navigate("/admin/dashboard");
    } else {
      setAdminError("Invalid admin credentials");
    }
  };

  const handleLogout = async () => {
    const { error } = await signOut();
    if (!error) {
      setShowUserMenu(false);
      navigate("/");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg lg:text-xl text-foreground">
              {t('home.brandName')}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors ${
                isActive("/") ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t('nav.home')}
            </Link>
            <Link 
              to="/about" 
              className={`text-sm font-medium transition-colors ${
                isActive("/about") ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t('nav.about')}
            </Link>
            <Link 
              to="/how-it-works" 
              className={`text-sm font-medium transition-colors ${
                isActive("/how-it-works") ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t('nav.howItWorks')}
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSelector />
            
            {isLoggedIn ? (
              // User is logged in - show profile dropdown
              <div className="relative" ref={userMenuRef}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="text-muted-foreground"
                >
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span className="max-w-[100px] truncate">{user?.email?.split('@')[0]}</span>
                  <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </Button>
                
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-border p-2 z-50">
                    <div className="px-3 py-2 border-b border-border mb-2">
                      <p className="text-sm font-medium truncate">{user?.email}</p>
                      <p className="text-xs text-muted-foreground">{userRole ? t(`ui.${userRole}Account`) : t('ui.loggedIn')}</p>
                    </div>
                    {userRole === 'donor' && (
                      <Link 
                        to="/donor/dashboard" 
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        {t('ui.donorDashboard')}
                      </Link>
                    )}
                    {userRole === 'hospital' && (
                      <Link 
                        to="/hospital/dashboard" 
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Building2 className="w-4 h-4" />
                        {t('ui.hospitalDashboard')}
                      </Link>
                    )}
                    <Link 
                      to="/profile" 
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="w-4 h-4" />
                      {t('ui.myProfile')}
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('ui.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // User is not logged in - show login/register/admin
              <>
                {/* Admin Login Dropdown */}
                <div className="relative" ref={adminDropdownRef}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowAdminLogin(!showAdminLogin)}
                    className="text-muted-foreground"
                  >
                    <Shield className="w-4 h-4 mr-1" />
                    {t('ui.admin')}
                    <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${showAdminLogin ? 'rotate-180' : ''}`} />
                  </Button>
                  
                  {showAdminLogin && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-border p-4 z-50">
                      <form onSubmit={handleAdminLogin} className="space-y-3">
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                          {t('ui.adminLogin')}
                        </div>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder={t('ui.adminEmail')}
                            value={adminEmail}
                            onChange={(e) => setAdminEmail(e.target.value)}
                            className="pl-9 h-9 text-sm"
                            required
                          />
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            type="password"
                            placeholder={t('ui.password')}
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            className="pl-9 h-9 text-sm"
                            required
                          />
                        </div>
                        {adminError && (
                          <div className="text-xs text-red-500">{t('ui.invalidCredentials')}</div>
                        )}
                        <Button type="submit" size="sm" className="w-full">
                          <Shield className="w-4 h-4 mr-1" />
                          {t('ui.loginAsAdmin')}
                        </Button>
                      </form>
                    </div>
                  )}
                </div>

                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">
                    <User className="w-4 h-4 mr-1" />
                    {t('nav.login')}
                  </Link>
                </Button>
                <Button variant="default" size="sm" asChild>
                  <Link to="/register">{t('nav.register')} {t('ui.registerAsDonor')}</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/hospital-register">
                    <Building2 className="w-4 h-4 mr-1" />
                    {t('ui.registerAsHospital')}
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-slide-up">
            <div className="flex flex-col gap-2">
              <Link 
                to="/" 
                className="px-4 py-3 rounded-lg hover:bg-muted transition-colors text-sm font-medium"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="px-4 py-3 rounded-lg hover:bg-muted transition-colors text-sm font-medium"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/how-it-works" 
                className="px-4 py-3 rounded-lg hover:bg-muted transition-colors text-sm font-medium"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.howItWorks')}
              </Link>
              <div className="border-t border-border my-2" />
              <div className="flex flex-col gap-2 px-2">
                {isLoggedIn ? (
                  // Mobile: User is logged in
                  <>
                    <div className="px-4 py-3 bg-primary/5 rounded-lg">
                      <p className="text-sm font-medium truncate">{user?.email}</p>
                      <p className="text-xs text-muted-foreground">{userRole ? t(`ui.${userRole}Account`) : t('ui.loggedIn')}</p>
                    </div>
                    {userRole === 'donor' && (
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link to="/donor/dashboard" onClick={() => setIsOpen(false)}>
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          {t('ui.donorDashboard')}
                        </Link>
                      </Button>
                    )}
                    {userRole === 'hospital' && (
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link to="/hospital/dashboard" onClick={() => setIsOpen(false)}>
                          <Building2 className="w-4 h-4 mr-2" />
                          {t('ui.hospitalDashboard')}
                        </Link>
                      </Button>
                    )}
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to="/profile" onClick={() => setIsOpen(false)}>
                        <Settings className="w-4 h-4 mr-2" />
                        {t('ui.myProfile')}
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50"
                      onClick={async () => {
                        await handleLogout();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {t('ui.logout')}
                    </Button>
                  </>
                ) : (
                  // Mobile: User is not logged in
                  <>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to="/login" onClick={() => setIsOpen(false)}>
                        <User className="w-4 h-4 mr-2" />
                        {t('nav.login')}
                      </Link>
                    </Button>
                    <Button variant="default" className="w-full justify-start" asChild>
                      <Link to="/register" onClick={() => setIsOpen(false)}>
                        <Heart className="w-4 h-4 mr-2" />
                        {t('ui.registerAsDonor')}
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to="/hospital-register" onClick={() => setIsOpen(false)}>
                        <Building2 className="w-4 h-4 mr-2" />
                        {t('ui.registerAsHospital')}
                      </Link>
                    </Button>
                    <div className="border-t border-border my-2" />
                    <div className="px-2 py-2 bg-muted/50 rounded-lg">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        {t('ui.adminAccess')}
                      </div>
                      <form onSubmit={handleAdminLogin} className="space-y-2">
                        <Input
                          type="email"
                          placeholder={t('ui.adminEmail')}
                          value={adminEmail}
                          onChange={(e) => setAdminEmail(e.target.value)}
                          className="h-9 text-sm"
                          required
                        />
                        <Input
                          type="password"
                          placeholder={t('ui.password')}
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          className="h-9 text-sm"
                          required
                        />
                        {adminError && (
                          <div className="text-xs text-red-500">{t('ui.invalidCredentials')}</div>
                        )}
                        <Button type="submit" size="sm" className="w-full">
                          <Shield className="w-4 h-4 mr-1" />
                          {t('ui.adminLogin')}
                        </Button>
                      </form>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
