import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Shield, 
  ArrowLeft, 
  Eye, 
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  CheckCircle,
  FileText,
  Building2,
  Settings,
  Users
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const states = [
  "California", "Texas", "Florida", "New York", "Pennsylvania",
  "Illinois", "Ohio", "Georgia", "North Carolina", "Michigan"
];

const AdminRegister = () => {
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);

  const adminTypes = [
    t('adminRegister.typeSystem'),
    t('adminRegister.typeRegional'),
    t('adminRegister.typeBloodBank'),
    t('adminRegister.typeHospitalNetwork'),
    t('adminRegister.typeEmergency'),
    t('adminRegister.typeQA')
  ];
  const [formData, setFormData] = useState({
    fullName: "",
    employeeId: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    adminType: "",
    department: "",
    organization: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    supervisorName: "",
    supervisorEmail: "",
    accessLevel: "",
    yearsOfExperience: "",
    certifications: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      alert(t('adminRegister.success'));
      setTimeout(() => {
        window.location.href = "/admin/dashboard";
      }, 2000);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {t('role.backToHome')}
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div className={`w-12 h-0.5 mx-2 ${
                      step > stepNumber ? "bg-primary" : "bg-muted"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="healthcare-card">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {t('adminRegister.title')}
              </h1>
              <p className="text-muted-foreground">
                {step === 1 && t('adminRegister.step1Desc')}
                {step === 2 && t('adminRegister.step2Desc')}
                {step === 3 && t('adminRegister.step3Desc')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fullName">{t('adminRegister.fullName')}</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="fullName"
                          type="text"
                          placeholder={t('adminRegister.placeholderName')}
                          className="pl-10"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange("fullName", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="employeeId">{t('adminRegister.employeeId')}</Label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="employeeId"
                          type="text"
                          placeholder={t('adminRegister.placeholderEmployeeId')}
                          className="pl-10"
                          value={formData.employeeId}
                          onChange={(e) => handleInputChange("employeeId", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">{t('adminRegister.emailAddress')}</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder={t('adminRegister.placeholderEmail')}
                          className="pl-10"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">{t('adminRegister.phoneNumber')}</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder={t('adminRegister.placeholderPhone')}
                          className="pl-10"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="adminType">{t('adminRegister.adminType')}</Label>
                      <Select value={formData.adminType} onValueChange={(value) => handleInputChange("adminType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder={t('adminRegister.selectAdminType')} />
                        </SelectTrigger>
                        <SelectContent>
                          {adminTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="department">{t('adminRegister.department')}</Label>
                      <Input
                        id="department"
                        type="text"
                        placeholder={t('adminRegister.placeholderDepartment')}
                        value={formData.department}
                        onChange={(e) => handleInputChange("department", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="yearsOfExperience">{t('adminRegister.yearsOfExperience')}</Label>
                      <Input
                        id="yearsOfExperience"
                        type="number"
                        placeholder={t('adminRegister.placeholderYears')}
                        value={formData.yearsOfExperience}
                        onChange={(e) => handleInputChange("yearsOfExperience", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="password">{t('adminRegister.password')}</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder={t('adminRegister.placeholderPassword')}
                          className="pl-10 pr-10"
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="organization">{t('adminRegister.organization')}</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="organization"
                          type="text"
                          placeholder={t('adminRegister.placeholderOrganization')}
                          className="pl-10"
                          value={formData.organization}
                          onChange={(e) => handleInputChange("organization", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">{t('adminRegister.officeAddress')}</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="address"
                          type="text"
                          placeholder={t('adminRegister.placeholderAddress')}
                          className="pl-10"
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">{t('adminRegister.city')}</Label>
                        <Input
                          id="city"
                          type="text"
                          placeholder={t('adminRegister.placeholderCity')}
                          value={formData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="state">{t('adminRegister.state')}</Label>
                        <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder={t('adminRegister.selectState')} />
                          </SelectTrigger>
                          <SelectContent>
                            {states.map((state) => (
                              <SelectItem key={state} value={state}>{state}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="zipCode">{t('adminRegister.zipCode')}</Label>
                      <Input
                        id="zipCode"
                        type="text"
                        placeholder={t('adminRegister.placeholderZip')}
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange("zipCode", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="supervisorName">{t('adminRegister.supervisorName')}</Label>
                      <div className="relative">
                        <Users className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="supervisorName"
                          type="text"
                          placeholder={t('adminRegister.placeholderSupervisor')}
                          className="pl-10"
                          value={formData.supervisorName}
                          onChange={(e) => handleInputChange("supervisorName", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="supervisorEmail">{t('adminRegister.supervisorEmail')}</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="supervisorEmail"
                          type="email"
                          placeholder={t('adminRegister.placeholderSupervisorEmail')}
                          className="pl-10"
                          value={formData.supervisorEmail}
                          onChange={(e) => handleInputChange("supervisorEmail", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="accessLevel">{t('adminRegister.accessLevel')}</Label>
                      <Select value={formData.accessLevel} onValueChange={(value) => handleInputChange("accessLevel", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder={t('adminRegister.selectAccessLevel')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full">{t('adminRegister.accessFull')}</SelectItem>
                          <SelectItem value="regional">{t('adminRegister.accessRegional')}</SelectItem>
                          <SelectItem value="hospital">{t('adminRegister.accessHospital')}</SelectItem>
                          <SelectItem value="limited">{t('adminRegister.accessLimited')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="certifications">{t('adminRegister.certifications')}</Label>
                      <Input
                        id="certifications"
                        type="text"
                        placeholder={t('adminRegister.placeholderCertifications')}
                        value={formData.certifications}
                        onChange={(e) => handleInputChange("certifications", e.target.value)}
                        required
                      />
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4">
                      <h3 className="font-medium text-foreground mb-2 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary" />
                        {t('adminRegister.authorizationRequirements')}
                      </h3>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-success" />
                          {t('adminRegister.validId')}
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-success" />
                          {t('adminRegister.certificationVerification')}
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-success" />
                          {t('adminRegister.employmentVerification')}
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-success" />
                          {t('adminRegister.backgroundCheck')}
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-success" />
                          {t('adminRegister.supervisorApproval')}
                        </li>
                      </ul>
                    </div>

                    <div className="bg-primary/5 rounded-lg p-4">
                      <h3 className="font-medium text-foreground mb-2 flex items-center gap-2">
                        <Settings className="w-4 h-4 text-primary" />
                        {t('adminRegister.systemAccess')}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {t('adminRegister.uponApproval')}
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• {t('adminRegister.access1')}</li>
                        <li>• {t('adminRegister.access2')}</li>
                        <li>• {t('adminRegister.access3')}</li>
                        <li>• {t('adminRegister.access4')}</li>
                        <li>• {t('adminRegister.access5')}</li>
                      </ul>
                    </div>

                    <div className="bg-destructive/5 rounded-lg p-4">
                      <h3 className="font-medium text-foreground mb-2">{t('adminRegister.securityNotice')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('adminRegister.securityNoticeDesc')}
                      </p>
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-4 pt-4">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    className="flex-1"
                  >
                    {t('adminRegister.previous')}
                  </Button>
                )}
                <Button type="submit" className="flex-1">
                  {step === 3 ? t('adminRegister.completeRegistration') : t('adminRegister.nextStep')}
                </Button>
              </div>
            </form>
          </div>

          <div className="text-center mt-6">
            <p className="text-muted-foreground">
              {t('adminRegister.alreadyHaveAccount')}{" "}
              <Link to="/login" className="text-primary hover:underline">
                {t('adminRegister.signInHere')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
