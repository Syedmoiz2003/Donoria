import { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  // Navigation
  'nav.home': {
    en: 'Home',
    ur: 'گھر',
  },
  'nav.about': {
    en: 'About',
    ur: 'ہمارے میں',
  },
  'nav.howItWorks': {
    en: 'How It Works',
    ur: 'یہ کیسے کام کرتا ہے',
  },
  'nav.login': {
    en: 'Login',
    ur: 'لاگ ان',
  },
  'nav.register': {
    en: 'Register',
    ur: 'رجسٹر کریں',
  },

  // Common
  'common.save': {
    en: 'Save',
    ur: 'محفوظ کریں',
  },
  'common.cancel': {
    en: 'Cancel',
    ur: 'منسوخ کریں',
  },
  'common.submit': {
    en: 'Submit',
    ur: 'جمع کرائیں',
  },
  'common.next': {
    en: 'Next',
    ur: 'اگلے',
  },
  'common.previous': {
    en: 'Previous',
    ur: 'پچھلا',
  },
  'common.loading': {
    en: 'Loading...',
    ur: 'لوڈ ہو رہا ہے...',
  },

  // Login
  'login.title': {
    en: 'Login',
    ur: 'لاگ ان',
  },
  'login.donorSubtitle': {
    en: 'Welcome back, hero! Continue saving lives.',
    ur: 'خوش آمدید، ہیرو! زندگیاں بچانے جاری رکھیں۔',
  },
  'login.hospitalTitle': {
    en: 'Hospital Login',
    ur: 'ہسپتال لاگ ان',
  },
  'login.hospitalSubtitle': {
    en: 'Access your hospital\'s donation management portal.',
    ur: 'اپنے ہسپتال کے عطیہ کے انتظامی پورٹل تک رسائی حاصل کریں۔',
  },
  'login.adminTitle': {
    en: 'Admin Login',
    ur: 'ایڈمن لاگ ان',
  },
  'login.adminSubtitle': {
    en: 'Secure access to administration portal.',
    ur: 'انتظامی پورٹل تک محفوظ رسائی حاصل کریں۔',
  },
  'login.email': {
    en: 'Email Address',
    ur: 'ای میل ایڈریس',
  },
  'login.password': {
    en: 'Password',
    ur: 'پاس ورڈ',
  },
  'login.forgotPassword': {
    en: 'Forgot password?',
    ur: 'پاس ورڈ بھول گئے؟',
  },
  'login.signIn': {
    en: 'Sign In',
    ur: 'سائن ان',
  },
  'login.noAccount': {
    en: "Don't have an account?",
    ur: 'کئی اکاؤنٹ نہیں؟',
  },
  'login.registerHere': {
    en: 'Register here',
    ur: 'یہاں رجسٹر کریں',
  },
  'login.everyBloodAndOrganCounts': {
    en: 'Every Blood and Organ Counts',
    ur: 'ہر خون اور اعضا کی اہمیت ہے',
  },
  'login.joinNetwork': {
    en: 'Join our network of heroes making a difference. Your blood and organ donations can save up to 8 lives.',
    ur: 'ہیروؤں کے نیٹ ورک میں شامل ہوں جو فرق بنارہے ہیں۔ آپ کے خون اور اعضا کے عطیہ سے 8 تک جانیں بچائی جا سکتی ہیں۔',
  },
  'login.bloodDonations': {
    en: 'Blood Donations',
    ur: 'خون کے عطیے',
  },
  'login.organDonations': {
    en: 'Organ Donations',
    ur: 'اعضا کے عطیے',
  },
  'login.hospitals': {
    en: 'Hospitals',
    ur: 'ہسپتال',
  },
  'login.donors': {
    en: 'Donors',
    ur: 'دہندہ',
  },

  // Registration
  'register.title': {
    en: 'Register',
    ur: 'رجسٹر کریں',
  },
  'register.personalInfo': {
    en: 'Personal Information',
    ur: 'ذاتی معلومات',
  },
  'register.firstName': {
    en: 'First Name',
    ur: 'پہلا نام',
  },
  'register.lastName': {
    en: 'Last Name',
    ur: 'آخری نام',
  },
  'register.email': {
    en: 'Email Address',
    ur: 'ای میل ایڈریس',
  },
  'register.phone': {
    en: 'Phone Number',
    ur: 'فون نمبر',
  },
  'register.dateOfBirth': {
    en: 'Date of Birth',
    ur: 'پیدائش کی تاریخ',
  },
  'register.gender': {
    en: 'Gender',
    ur: 'جنس',
  },
  'register.male': {
    en: 'Male',
    ur: 'مرد',
  },
  'register.female': {
    en: 'Female',
    ur: 'عورت',
  },
  'register.other': {
    en: 'Other',
    ur: 'دیگر',
  },
  'register.bloodGroup': {
    en: 'Blood Group',
    ur: 'خون کا گروپ',
  },
  'register.location': {
    en: 'Location',
    ur: 'مقام',
  },
  'register.step1': {
    en: 'Personal Information',
    ur: 'ذاتی معلومات',
  },
  'register.step2': {
    en: 'Contact Information',
    ur: 'رابطے کی معلومات',
  },
  'register.success': {
    en: 'Registration successful! Welcome to Donoria. Redirecting to your dashboard...',
    ur: 'رجسٹر کامیاب! دونوریا میں خوش آمدید۔ آپ کے ڈیش بورڈ تک رہا ہو رہا ہے...',
  },
  'register.next': {
    en: 'Next',
    ur: 'اگلے',
  },
  'register.completeRegistration': {
    en: 'Complete Registration',
    ur: 'مکمل رجسٹر کریں',
  },

  // Dashboard
  'dashboard.welcome': {
    en: 'Welcome back',
    ur: 'خوش آمدید',
  },
  'dashboard.eligible': {
    en: 'You\'re eligible to donate. Your blood type is',
    ur: 'آپ عطیہ دینے کے لیے اہل ہیں۔ آپ کا خون کا گروپ ہے',
  },
  'dashboard.registeredOrgan': {
    en: 'and you\'re registered for organ donation',
    ur: 'اور آپ اعضا کے عطیے کے لیے رجسٹرڈ ہیں',
  },
  'dashboard.urgentRequests': {
    en: 'Urgent Blood & Organ Requests Near You',
    ur: 'آپ کے قریب خون اور اعضا کی فوری درخواستیں',
  },
  'dashboard.viewAll': {
    en: 'View All',
    ur: 'سب دیکھیں',
  },
  'dashboard.search': {
    en: 'Search by hospital, blood type, or organ type...',
    ur: 'ہسپتال، خون کے گروپ، یا عضو کی قسم سے تلاش کریں...',
  },
  'dashboard.totalDonations': {
    en: 'Total Donations',
    ur: 'کل عطیے',
  },
  'dashboard.livesSaved': {
    en: 'Lives Saved',
    ur: 'بچائی ہوئی زندگیاں',
  },
  'dashboard.donorLevel': {
    en: 'Donor Level',
    ur: 'دہندہ کی سطح',
  },
  'dashboard.growth': {
    en: 'Growth This Month',
    ur: 'اس مہین میں اضافہ',
  },
  'dashboard.healthScore': {
    en: 'Health Score',
    ur: 'صحت کا اسکور',
  },
  'dashboard.eligibleToDonate': {
    en: "You're Eligible to Donate!",
    ur: 'آپ عطیہ دینے کے لیے اہل ہیں!',
  },
  'dashboard.nextEligibleDate': {
    en: 'Next eligible date: Available now',
    ur: 'اگلی اہل تاریخ: اب دستیاب ہے',
  },
  'dashboard.browseRequests': {
    en: 'Browse Requests',
    ur: 'درخواستیں دیکھیں',
  },

  // Hospital Dashboard
  'hospitalDashboard.verified': {
    en: 'Verified',
    ur: 'تصدیق شدہ',
  },
  'hospitalDashboard.verifiedInstitution': {
    en: 'Verified Institution',
    ur: 'تصدیق شدہ ادارہ',
  },
  'hospitalDashboard.registrationNumber': {
    en: 'Registration #',
    ur: 'رجسٹریشن نمبر',
  },
  'hospitalDashboard.postNewRequest': {
    en: 'Post New Request',
    ur: 'نیا درخواست پوسٹ کریں',
  },
  'hospitalDashboard.activeRequests': {
    en: 'Active Requests',
    ur: 'فعال درخواستیں',
  },
  'hospitalDashboard.donorResponses': {
    en: 'Donor Responses',
    ur: 'دہندہ کے جوابات',
  },
  'hospitalDashboard.requestsFulfilled': {
    en: 'Requests Fulfilled',
    ur: 'درخواستیں پوری ہوئیں',
  },
  'hospitalDashboard.avgResponseTime': {
    en: 'Avg Response Time',
    ur: 'اوسط جوابی وقت',
  },
  'hospitalDashboard.viewAll': {
    en: 'View All',
    ur: 'سب دیکھیں',
  },
  'hospitalDashboard.needed': {
    en: 'needed',
    ur: 'درکار ہے',
  },
  'hospitalDashboard.unitsOf': {
    en: 'units of',
    ur: 'یونٹس کا',
  },
  'hospitalDashboard.organ': {
    en: 'Organ',
    ur: 'عضو',
  },
  'hospitalDashboard.age': {
    en: 'Age',
    ur: 'عمر',
  },
  'hospitalDashboard.blood': {
    en: 'Blood',
    ur: 'خون',
  },
  'hospitalDashboard.recentDonors': {
    en: 'Recent Donors',
    ur: 'حالیہ کے دہندگان',
  },
  'hospitalDashboard.compatibility': {
    en: 'Compatibility',
    ur: 'مطابقت',
  },
  'hospitalDashboard.accepted': {
    en: 'Accepted',
    ur: 'قبول کیا گیا',
  },
  'hospitalDashboard.pending': {
    en: 'Pending',
    ur: 'زیر التواء',
  },
  'hospitalDashboard.viewResponses': {
    en: 'View Responses',
    ur: 'جوابات دیکھیں',
  },
  'hospitalDashboard.edit': {
    en: 'Edit',
    ur: 'ترمیم کریں',
  },
  'hospitalDashboard.close': {
    en: 'Close',
    ur: 'بند کریں',
  },
  'hospitalDashboard.recentResponses': {
    en: 'Recent Responses',
    ur: 'حالیہ جوابات',
  },
  'hospitalDashboard.compatible': {
    en: 'compatible',
    ur: 'مطابقت رکھتا ہے',
  },
  'hospitalDashboard.viewAllResponses': {
    en: 'View All Responses',
    ur: 'تمام جوابات دیکھیں',
  },
  'hospitalDashboard.quickActions': {
    en: 'Quick Actions',
    ur: 'فوری اقدامات',
  },
  'hospitalDashboard.bloodInventory': {
    en: 'Blood Inventory',
    ur: 'خون کا ذخیرہ',
  },
  'hospitalDashboard.reports': {
    en: 'Reports',
    ur: 'رپورٹس',
  },
  'hospitalDashboard.settings': {
    en: 'Settings',
    ur: 'ترتیبات',
  },
  'hospitalDashboard.signOut': {
    en: 'Sign Out',
    ur: 'سائن آؤٹ',
  },
  'hospitalDashboard.since': {
    en: 'Since',
    ur: 'سے',
  },
  'hospitalDashboard.verifiedDescription': {
    en: 'Your hospital is verified and trusted by our donor network.',
    ur: 'آپ کا ہسپتال تصدیق شدہ ہے اور ہمارے دہندگان کے نیٹ ورک پر بھروسہ کیا جاتا ہے۔',
  },

  // CTA Section
  'cta.joinNetwork': {
    en: 'Join Our Network',
    ur: 'ہمارے نیٹ ورک میں شامل ہوں',
  },
  'cta.readyToMakeDifference': {
    en: 'Ready to Make a Difference?',
    ur: 'فرق بنانے کے لیے تیار ہیں؟',
  },
  'cta.description': {
    en: "Whether you're a donor looking to save lives or a hospital seeking verified donors, we've got you covered.",
    ur: 'چاہے آپ زندگیاں بچانے کے لیے دہندہ ہیں یا تصدیق شدہ دہندگان کی تلاش میں ہسپتال ہیں، ہم آپ کے لیے موجود ہیں۔',
  },
  'cta.forDonors': {
    en: 'For Donors',
    ur: 'دہندگان کے لیے',
  },
  'cta.donorDescription': {
    en: 'Register as a donor and get matched with hospitals in need. Your blood can save up to 3 lives.',
    ur: 'دہندہ کے طور پر رجسٹر کریں اور ضرورت مند ہسپتالوں سے میل کھائیں۔ آپ کا خون 3 تک زندگیاں بچا سکتا ہے۔',
  },
  'cta.registerNow': {
    en: 'Register Now',
    ur: 'ابھی رجسٹر کریں',
  },
  'cta.forHospitals': {
    en: 'For Hospitals',
    ur: 'ہسپتالوں کے لیے',
  },
  'cta.hospitalDescription': {
    en: 'Get verified and access our network of donors. Post urgent requests and find matches instantly.',
    ur: 'تصدیق حاصل کریں اور ہمارے دہندگان کے نیٹ ورک تک رسائی حاصل کریں۔ فوری درخواستیں پوسٹ کریں اور فوری طور پر میل تلاش کریں۔',
  },
  'cta.hospitalRegistration': {
    en: 'Hospital Registration',
    ur: 'ہسپتال رجسٹریشن',
  },
  'cta.forAdministrators': {
    en: 'For Administrators',
    ur: 'منتظمین کے لیے',
  },
  'cta.adminDescription': {
    en: 'Manage the platform, verify hospitals, and ensure the integrity of our life-saving network.',
    ur: 'پلیٹ فارم کا انتظام کریں، ہسپتالوں کی تصدیق کریں، اور ہماری جان بچانے والی نیٹ ورک کی درستگی کو یقینی بنائیں۔',
  },
  'cta.adminPortal': {
    en: 'Admin Portal',
    ur: 'ایڈمن پورٹل',
  },

  // Emergency Banner
  'emergencyBanner.emergencyBloodNeeded': {
    en: 'Emergency Blood Needed',
    ur: 'ایمرجنسی خون کی ضرورت ہے',
  },
  'emergencyBanner.description': {
    en: 'Multiple hospitals require O- and AB+ blood types urgently',
    ur: 'متعدد ہسپتالوں کو O- اور AB+ خون کے گروپس کی فوری ضرورت ہے',
  },
  'emergencyBanner.callHelpline': {
    en: 'Call Helpline',
    ur: 'ہیلپ لائن کال کریں',
  },
  'emergencyBanner.respondNow': {
    en: 'Respond Now',
    ur: 'ابھی جواب دیں',
  },

  // Health Chatbot
  'healthChatbot.title': {
    en: 'AI Health Assistant',
    ur: 'AI صحت معاون',
  },
  'healthChatbot.subtitle': {
    en: 'Ask me anything about blood and organ donation',
    ur: 'خون اور عضو کے عطیہ کے بارے میں مجھ سے کچھ بھی پوچھیں',
  },
  'healthChatbot.placeholder': {
    en: 'Type your health question...',
    ur: 'اپنا صحت کا سوال لکھیں...',
  },
  'healthChatbot.send': {
    en: 'Send',
    ur: 'بھیجیں',
  },
  'healthChatbot.predefinedTitle': {
    en: 'Common Questions',
    ur: 'عام سوالات',
  },
  'healthChatbot.backToDashboard': {
    en: 'Back to Dashboard',
    ur: 'ڈیش بورڈ پر واپس',
  },
  'healthChatbot.greeting': {
    en: "Hello! I'm your AI Health Assistant. I can help you with questions about blood donation eligibility, organ donation, and general health guidance. How can I assist you today?",
    ur: 'السلام علیکم! میں آپ کا AI صحت معاون ہوں۔ میں خون کے عطیہ کی اہلیت، عضو کے عطیہ، اور عمومی صحت کی رہنمائی کے بارے میں سوالات میں آپ کی مدد کر سکتا ہوں۔ آج میں آپ کی کیسے مدد کر سکتا ہوں؟',
  },
  'healthChatbot.typing': {
    en: 'Typing...',
    ur: 'ٹائپ کر رہا ہے...',
  },
  'healthChatbot.disclaimer': {
    en: 'This AI assistant provides general guidance only. Consult a healthcare professional for medical advice.',
    ur: 'یہ AI معاون صرف عمومی رہنمائی فراہم کرتا ہے۔ طبی مشورے کے لیے ماہر صحت سے مشورہ کریں۔',
  },
  'healthChatbot.aiResponse': {
    en: "Thank you for your question. For specific medical advice, please consult with a healthcare professional. However, I can help guide you with general information about blood and organ donation. Is there a specific topic you'd like to know more about?",
    ur: 'آپ کے سوال کا شکریہ۔ مخصوص طبی مشورے کے لیے، براہ کرم کسی ماہر صحت سے مشورہ کریں۔ تاہم، میں خون اور عضو کے عطیہ کے بارے میں عمومی معلومات میں آپ کی رہنمائی کر سکتا ہوں۔ کیا کوئی خاص موضوع ہے جس کے بارے میں آپ مزید جاننا چاہیں گے؟',
  },
  'healthChatbot.eligibility': {
    en: "Am I eligible to donate blood?",
    ur: "کیا میں خون دینے کے اہل ہوں؟",
  },
  'healthChatbot.eligibilityAnswer': {
    en: "To donate blood, you must be at least 18 years old, weigh at least 50 kg, and be in good health. You should not have donated blood in the last 3 months. Certain medical conditions or medications may temporarily or permanently defer you from donating.",
    ur: "خون دینے کے لیے، آپ کی عمر کم از کم 18 سال ہونی چاہیے، وزن کم از کم 50 کلو ہو، اور صحت اچھی ہو۔ آپ نے پچھلے 3 ماہ میں خون نہیں دیا ہونا چاہیے۔ کچھ طبی حالات یا ادویات آپ کو عارضی یا مستقل طور پر خون دینے سے روک سکتی ہیں۔",
  },
  'healthChatbot.bloodTypes': {
    en: "What blood types are compatible?",
    ur: "کون سے بلڈ گروپ ایک دوسرے سے مطابقت رکھتے ہیں؟",
  },
  'healthChatbot.bloodTypesAnswer': {
    en: "Blood type compatibility: O- is the universal donor. AB+ is the universal recipient. Generally: A can receive from A and O, B can receive from B and O, AB can receive from all, and O can only receive from O. Rh factor (+ or -) also matters.",
    ur: "بلڈ گروپ کی مطابقت: O- عالمگیر ڈونر ہے۔ AB+ عالمگیر وصول کنندہ ہے۔ عام طور پر: A گروپ A اور O سے، B گروپ B اور O سے، AB تمام سے، اور O صرف O سے خون لے سکتا ہے۔",
  },
  'healthChatbot.afterDonation': {
    en: "What should I do after donating?",
    ur: "خون دینے کے بعد مجھے کیا کرنا چاہیے؟",
  },
  'healthChatbot.afterDonationAnswer': {
    en: "After donating: Rest for 10-15 minutes, drink plenty of fluids, avoid heavy lifting for 24 hours, eat iron-rich foods, and avoid alcohol for 24 hours. If you feel dizzy or unwell, lie down with your feet elevated.",
    ur: "خون دینے کے بعد: 10-15 منٹ آرام کریں، کافی مائعات پیئیں، 24 گھنٹے بھاری وزن نہ اٹھائیں، آئرن سے بھرپور کھانا کھائیں، اور 24 گھنٹے شراب سے پرہیز کریں۔",
  },
  'healthChatbot.organDonation': {
    en: "How does organ donation work?",
    ur: "عضو کا عطیہ کیسے کام کرتا ہے؟",
  },
  'healthChatbot.organDonationAnswer': {
    en: "Organ donation can be living (kidney, liver portion) or deceased. Register as an organ donor and inform your family. After death, organs are matched with recipients based on blood type, body size, and medical urgency.",
    ur: "عضو کا عطیہ زندہ (گردہ، جگر کا حصہ) یا فوت شدہ ہو سکتا ہے۔ عضو ڈونر کے طور پر رجسٹر ہوں اور اپنے خاندان کو بتائیں۔ وفات کے بعد، اعضاء کو بلڈ گروپ، جسم کے سائز، اور طبی ضرورت کی بنیاد پر ملایا جاتا ہے۔",
  },
  'healthChatbot.frequency': {
    en: "How often can I donate blood?",
    ur: "میں کتنی بار خون دے سکتا ہوں؟",
  },
  'healthChatbot.frequencyAnswer': {
    en: "You can donate whole blood every 3 months (12 weeks). Platelet donation can be done every 2 weeks, up to 24 times per year. Plasma donation can be done every 2 weeks as well.",
    ur: "آپ ہر 3 ماہ (12 ہفتے) بعد مکمل خون دے سکتے ہیں۔ پلیٹلیٹ ہر 2 ہفتے بعد، سال میں 24 بار تک دیا جا سکتا ہے۔ پلازما بھی ہر 2 ہفتے بعد دیا جا سکتا ہے۔",
  },
  'healthChatbot.preparation': {
    en: "How should I prepare for donation?",
    ur: "عطیہ کی تیاری کیسے کروں؟",
  },
  'healthChatbot.preparationAnswer': {
    en: "Before donating: Get enough sleep, eat a healthy meal, drink plenty of water, avoid fatty foods, and bring a valid ID. Wear comfortable clothing with sleeves that can be rolled up.",
    ur: "خون دینے سے پہلے: کافی نیند لیں، صحت مند کھانا کھائیں، کافی پانی پیئیں، چکنائی والے کھانے سے پرہیز کریں، اور درست شناختی کارڈ لائیں۔ آرام دہ کپڑے پہنیں جن کی آستینیں اوپر کی جا سکیں۔",
  },

  // Browse Requests
  'browseRequests.title': {
    en: 'Browse Donation Requests',
    ur: 'عطیہ کی درخواستیں دیکھیں',
  },
  'browseRequests.dashboard': {
    en: 'Dashboard',
    ur: 'ڈیش بورڈ',
  },
  'browseRequests.searchPlaceholder': {
    en: 'Search by hospital name...',
    ur: 'ہسپتال کے نام سے تلاش کریں...',
  },
  'browseRequests.filters': {
    en: 'Filters',
    ur: 'فلٹرز',
  },
  'browseRequests.filterRequests': {
    en: 'Filter Requests',
    ur: 'درخواستیں فلٹر کریں',
  },
  'browseRequests.clearAll': {
    en: 'Clear All',
    ur: 'سب صاف کریں',
  },
  'browseRequests.donationType': {
    en: 'Donation Type',
    ur: 'عطیے کی قسم',
  },
  'browseRequests.bloodType': {
    en: 'Blood Type',
    ur: 'بلڈ گروپ',
  },
  'browseRequests.urgencyLevel': {
    en: 'Urgency Level',
    ur: 'اہمیت کی سطح',
  },
  'browseRequests.showingResults': {
    en: 'Showing {count} of {total} requests',
    ur: '{total} میں سے {count} درخواستیں دکھا رہا ہے',
  },
  'browseRequests.organ': {
    en: 'Organ',
    ur: 'عضو',
  },
  'browseRequests.unitsNeeded': {
    en: '{units} units of {bloodType} blood needed',
    ur: '{bloodType} بلڈ گروپ کے {units} یونٹس درکار ہیں',
  },
  'browseRequests.organNeeded': {
    en: '{organType} donation needed',
    ur: '{organType} کا عطیہ درکار ہے',
  },
  'browseRequests.match': {
    en: 'Match',
    ur: 'مچ',
  },
  'browseRequests.viewDetails': {
    en: 'View Details',
    ur: 'تفصیلات دیکھیں',
  },
  'browseRequests.noRequestsFound': {
    en: 'No requests found',
    ur: 'کوئی درخواست نہیں ملی',
  },
  'browseRequests.tryAdjustingFilters': {
    en: 'Try adjusting your filters or search query',
    ur: 'اپنے فلٹرز یا تلاش کو ایڈجسٹ کرنے کی کوشش کریں',
  },
  'browseRequests.clearFilters': {
    en: 'Clear Filters',
    ur: 'فلٹرز صاف کریں',
  },
  'browseRequests.all': {
    en: 'All',
    ur: 'سب',
  },
  'browseRequests.critical': {
    en: 'Critical',
    ur: 'نازک',
  },
  'browseRequests.high': {
    en: 'High',
    ur: 'زیادہ',
  },
  'browseRequests.medium': {
    en: 'Medium',
    ur: 'متوسط',
  },
  'browseRequests.blood': {
    en: 'Blood',
    ur: 'خون',
  },

  // Request Details
  'requestDetails.responseSubmitted': {
    en: 'Response Submitted!',
    ur: 'جواب جمع کرایا گیا!',
  },
  'requestDetails.thankYouMessage': {
    en: 'Thank you for your willingness to donate. The hospital will contact you shortly to confirm the appointment.',
    ur: 'عطیہ دینے کی رضامندی کا شکریہ۔ ہسپتال جلد ہی آپ سے رابطہ کرے گا تاکہ اپوائنمنٹ کی تصدیق کر سکے۔',
  },
  'requestDetails.returnToDashboard': {
    en: 'Return to Dashboard',
    ur: 'ڈیش بورڈ پر واپس',
  },
  'requestDetails.browseMoreRequests': {
    en: 'Browse More Requests',
    ur: 'مزید درخواستیں دیکھیں',
  },
  'requestDetails.backToRequests': {
    en: 'Back to Requests',
    ur: 'درخواستیں واپس',
  },
  'requestDetails.title': {
    en: 'Request Details',
    ur: 'درخواست کی تفصیلات',
  },
  'requestDetails.unitsNeeded': {
    en: '{units} units of {bloodType} blood needed',
    ur: '{bloodType} بلڈ گروپ کے {units} یونٹس درکار ہیں',
  },
  'requestDetails.away': {
    en: 'away',
    ur: 'دور',
  },
  'requestDetails.posted': {
    en: 'Posted',
    ur: 'پوسٹ کیا گیا',
  },
  'requestDetails.compatibilityCheck': {
    en: 'Compatibility Check',
    ur: 'مطابقت کی جانچ',
  },
  'requestDetails.compatibilityMessage': {
    en: 'Based on your blood type (O+) and health profile, you have a high compatibility score for this request.',
    ur: 'آپ کے بلڈ گروپ (O+) اور صحت کے پروفائل کی بنیاد پر، آپ کی اس درخواست کے لیے اعلیٰ مطابقت اسکور ہے۔',
  },
  'requestDetails.donationRequirements': {
    en: 'Donation Requirements',
    ur: 'عطیہ کی ضروریات',
  },
  'requestDetails.submitResponse': {
    en: 'Submit Your Response',
    ur: 'اپنا جواب جمع کروائیں',
  },
  'requestDetails.selectAvailability': {
    en: 'Select your availability',
    ur: 'اپنی دستیابی منتخب کریں',
  },
  'requestDetails.today': {
    en: 'Today',
    ur: 'آج',
  },
  'requestDetails.tomorrow': {
    en: 'Tomorrow',
    ur: 'کل',
  },
  'requestDetails.thisWeek': {
    en: 'This Week',
    ur: 'اس ہفتے',
  },
  'requestDetails.flexible': {
    en: 'Flexible',
    ur: 'لچکدار',
  },
  'requestDetails.consent': {
    en: 'I confirm that I meet all the donation requirements and consent to share my contact information with the hospital for this donation request.',
    ur: 'میں تصدیق کرتا ہوں کہ میں تمام عطیے کی ضروریات پر پورا اترتا ہوں اور اس عطیہ کی درخواست کے لیے ہسپتال کے ساتھ اپنی رابطے کی معلومات شیئر کرنے پر راضی ہوں۔',
  },
  'requestDetails.submitResponseButton': {
    en: 'Submit Response & Save a Life',
    ur: 'جواب جمع کروائیں اور زندگی بچائیں',
  },
  'requestDetails.hospitalInformation': {
    en: 'Hospital Information',
    ur: 'ہسپتال کی معلومات',
  },
  'requestDetails.address': {
    en: 'Address',
    ur: 'پتہ',
  },
  'requestDetails.phone': {
    en: 'Phone',
    ur: 'فون',
  },
  'requestDetails.email': {
    en: 'Email',
    ur: 'ای میل',
  },
  'requestDetails.postedOn': {
    en: 'Posted On',
    ur: 'پوسٹ کیا گیا',
  },
  'requestDetails.location': {
    en: 'Location',
    ur: 'مقام',
  },
  'requestDetails.mapPreview': {
    en: 'Map Preview',
    ur: 'نقشے کا پیش نظارہ',
  },
  'requestDetails.getDirections': {
    en: 'Get Directions',
    ur: 'سمت حاصل کریں',
  },

  // Hospital Request Details
  'hospitalRequestDetails.backToDashboard': {
    en: 'Back to Dashboard',
    ur: 'ڈیش بورڈ پر واپس',
  },
  'hospitalRequestDetails.title': {
    en: 'Request Details',
    ur: 'درخواست کی تفصیلات',
  },
  'hospitalRequestDetails.bloodType': {
    en: 'Blood Type',
    ur: 'بلڈ گروپ',
  },
  'hospitalRequestDetails.unitsNeeded': {
    en: 'Units Needed',
    ur: 'یونٹس درکار ہیں',
  },
  'hospitalRequestDetails.hospital': {
    en: 'Hospital',
    ur: 'ہسپتال',
  },
  'hospitalRequestDetails.location': {
    en: 'Location',
    ur: 'مقام',
  },
  'hospitalRequestDetails.contact': {
    en: 'Contact',
    ur: 'رابطہ',
  },
  'hospitalRequestDetails.quickActions': {
    en: 'Quick Actions',
    ur: 'فوری اقدامات',
  },
  'hospitalRequestDetails.editRequest': {
    en: 'Edit Request',
    ur: 'درخواست میں ترمیم کریں',
  },
  'hospitalRequestDetails.viewResponses': {
    en: 'View Responses',
    ur: 'جوابات دیکھیں',
  },
  'hospitalRequestDetails.donorResponses': {
    en: 'Donor Responses',
    ur: 'دہندہ کے جوابات',
  },
  'hospitalRequestDetails.viewAllResponses': {
    en: 'View All Responses',
    ur: 'تمام جوابات دیکھیں',
  },
  'hospitalRequestDetails.acceptResponse': {
    en: 'Accept Response',
    ur: 'جواب قبول کریں',
  },
  'hospitalRequestDetails.contactDonor': {
    en: 'Contact Donor',
    ur: 'دہندہ سے رابطہ کریں',
  },

  // Hospital Responses
  'hospitalResponses.backToDashboard': {
    en: 'Back to Dashboard',
    ur: 'ڈیش بورڈ پر واپس',
  },
  'hospitalResponses.title': {
    en: 'Donor Responses',
    ur: 'دہندہ کے جوابات',
  },
  'hospitalResponses.searchPlaceholder': {
    en: 'Search by donor name or blood type...',
    ur: 'دہندے کے نام یا بلڈ گروپ سے تلاش کریں...',
  },
  'hospitalResponses.all': {
    en: 'All',
    ur: 'سب',
  },
  'hospitalResponses.available': {
    en: 'Available',
    ur: 'دستیاب',
  },
  'hospitalResponses.pending': {
    en: 'Pending',
    ur: 'زیر التواء',
  },
  'hospitalResponses.request': {
    en: 'Request',
    ur: 'درخواست',
  },
  'hospitalResponses.units': {
    en: 'units',
    ur: 'یونٹس',
  },
  'hospitalResponses.acceptResponse': {
    en: 'Accept Response',
    ur: 'جواب قبول کریں',
  },
  'hospitalResponses.contactDonor': {
    en: 'Contact Donor',
    ur: 'دہندہ سے رابطہ کریں',
  },

  // Role Selection
  'roleSelect.title': {
    en: 'Choose Your Role',
    ur: 'اپنا کردار منتخب کریں',
  },
  'roleSelect.donor': {
    en: 'Donor',
    ur: 'دہندہ',
  },
  'roleSelect.hospital': {
    en: 'Hospital',
    ur: 'ہسپتال',
  },
  'roleSelect.admin': {
    en: 'Administrator',
    ur: 'منتظم',
  },

  // Languages
  'lang.english': {
    en: 'English',
    ur: 'انگریزی',
  },
  'lang.urdu': {
    en: 'Urdu',
    ur: 'اردو',
  },

  // Home Page
  'home.emergencyNeeded': {
    en: 'Emergency blood needed in your area',
    ur: 'آپ کے علاقے میں ایمرجنسی خون کی ضرورت ہے',
  },
  'home.brandName': {
    en: 'Donoria',
    ur: 'دونوریا',
  },
  'home.saveLives': {
    en: 'Save Lives through',
    ur: 'زندگیاں بچائیں',
  },
  'home.bloodOrganDonation': {
    en: 'Blood & Organ Donation',
    ur: 'خون اور اعضا کی عطیہ',
  },
  'home.connectWithHospitals': {
    en: 'Connect with verified hospitals instantly. Your blood or organ donation can save multiple lives. Join our network of heroes making a difference every day.',
    ur: 'تصدیق ہسپتالوں سے فوری طور پر جڑیں۔ آپ کی خون یا اعضا کی عطیہ سے کئی زندگیاں بچا سکتی ہیں۔ ہیروؤں کے نیٹ ورک میں شامل ہوں جو ہر دن فرق بناتے ہیں۔',
  },
  'home.registerAsDonor': {
    en: 'Register as Donor',
    ur: 'بطور دہندہ رجسٹر کریں',
  },
  'home.hospitalLogin': {
    en: 'Hospital Login',
    ur: 'ہسپتال لاگ ان',
  },
  'home.beHero': {
    en: 'Be a Hero',
    ur: 'ہیرو بنیں',
  },
  'home.yourDonationMatters': {
    en: 'Your donation matters',
    ur: 'آپ کی عطیہ اہمیت رکھتی ہے',
  },
  'home.verifiedHospitals': {
    en: 'Verified Hospitals',
    ur: 'تصدیق ہسپتال',
  },
  'home.support247': {
    en: '24/7 Support',
    ur: '24/7 سپورٹ',
  },
  'home.donors': {
    en: 'Donors',
    ur: 'دہندہ',
  },
  'home.livesSaved': {
    en: 'Lives Saved',
    ur: 'بچائی ہوئی زندگیاں',
  },
  'home.hospitals': {
    en: 'Hospitals',
    ur: 'ہسپتال',
  },
  'home.matchRate': {
    en: 'Match Rate',
    ur: 'مچ ریٹ',
  },
  'home.bloodDonation': {
    en: 'Blood Donation',
    ur: 'خون کا عطیہ',
  },
  'home.organDonation': {
    en: 'Organ Donation',
    ur: 'اعضا کا عطیہ',
  },
  'home.cities': {
    en: 'Cities',
    ur: 'شہروں',
  },
  'home.bloodInfo1': {
    en: 'Donate every 3 months',
    ur: 'ہر 3 ماہ میں عطیہ دیں',
  },
  'home.bloodInfo2': {
    en: 'One donation saves 3 lives',
    ur: 'ایک عطیہ 3 زندگیاں بچاتا ہے',
  },
  'home.bloodInfo3': {
    en: 'All blood types needed',
    ur: 'تمام خون کے گروپس کی ضرورت ہے',
  },
  'home.organInfo1': {
    en: 'One donor can save 8 lives',
    ur: 'ایک دہندہ 8 زندگیاں بچا سکتا ہے',
  },
  'home.organInfo2': {
    en: 'Register as an organ donor',
    ur: 'اعضا کے دہندہ کے طور پر رجسٹر کریں',
  },
  'home.organInfo3': {
    en: 'Help patients in critical need',
    ur: 'شدید ضرورت مند مریضوں کی مدد کریں',
  },
  'home.urgentRequests': {
    en: 'Urgent Requests',
    ur: 'فوری درخواستیں',
  },
  'home.needed': {
    en: 'Needed',
    ur: 'ضرورت ہے',
  },
  'home.viewAllRequests': {
    en: 'View All Requests',
    ur: 'تمام درخواستیں دیکھیں',
  },

  // Navbar & Common UI
  'ui.donorDashboard': {
    en: 'Donor Dashboard',
    ur: 'دہندہ ڈیش بورڈ',
  },
  'ui.hospitalDashboard': {
    en: 'Hospital Dashboard',
    ur: 'ہسپتال ڈیش بورڈ',
  },
  'ui.myProfile': {
    en: 'My Profile',
    ur: 'میری پروفائل',
  },
  'ui.logout': {
    en: 'Logout',
    ur: 'لاگ آؤٹ',
  },
  'ui.registerAsHospital': {
    en: 'Register as Hospital',
    ur: 'ہسپتال کے طور پر رجسٹر کریں',
  },
  'ui.admin': {
    en: 'Admin',
    ur: 'ایڈمن',
  },
  'ui.adminLogin': {
    en: 'Admin Login',
    ur: 'ایڈمن لاگ ان',
  },
  'ui.loginAsAdmin': {
    en: 'Login as Admin',
    ur: 'ایڈمن کے طور پر لاگ ان کریں',
  },
  'ui.registerAsDonor': {
    en: 'Register as Donor',
    ur: 'دہندہ کے طور پر رجسٹر کریں',
  },
  'ui.adminAccess': {
    en: 'Admin Access',
    ur: 'ایڈمن رسائی',
  },
  'ui.loggedIn': {
    en: 'Logged in',
    ur: 'لاگ ان ہیں',
  },
  'ui.donorAccount': {
    en: 'Donor Account',
    ur: 'دہندہ اکاؤنٹ',
  },
  'ui.hospitalAccount': {
    en: 'Hospital Account',
    ur: 'ہسپتال اکاؤنٹ',
  },
  'ui.invalidCredentials': {
    en: 'Invalid admin credentials',
    ur: 'غلط ایڈمن کریڈینشلز',
  },
  'ui.adminEmail': {
    en: 'Admin email',
    ur: 'ایڈمن ای میل',
  },
  'ui.password': {
    en: 'Password',
    ur: 'پاس ورڈ',
  },

  // About Page
  'about.title': {
    en: 'About Us',
    ur: 'ہمارے بارے میں',
  },
  'about.heroTitle': {
    en: 'Connecting Lives, One Donation at a Time',
    ur: 'ایک عطیے سے زندگیاں جوڑنا',
  },
  'about.heroDescription': {
    en: 'Donoria is a revolutionary platform that bridges the gap between blood donors and patients in need. We use cutting-edge technology to make blood donation simple, safe, and impactful.',
    ur: 'دونوریا ایک انقلابی پلیٹ فارم ہے جو خون دہندگان اور ضرورت مند مریضوں کے درمیان پل بناتا ہے۔ ہم جدید ٹیکنالوجی کا استعمال کرتے ہوئے خون کا عطیہ آسان، محفوظ اور مؤثر بناتے ہیں۔',
  },
  'about.livesSaved': {
    en: 'Lives Saved',
    ur: 'بچائی ہوئی زندگیاں',
  },
  'about.activeDonors': {
    en: 'Active Donors',
    ur: 'فعال دہندگان',
  },
  'about.partnerHospitals': {
    en: 'Partner Hospitals',
    ur: 'شریک ہسپتال',
  },
  'about.citiesCovered': {
    en: 'Cities Covered',
    ur: 'شہر شامل',
  },
  'about.missionVision': {
    en: 'Our Mission & Vision',
    ur: 'ہماری مشن اور ویژن',
  },
  'about.mission': {
    en: 'Mission',
    ur: 'مشن',
  },
  'about.missionText': {
    en: 'To create a world where no life is lost due to blood shortage by building a robust, efficient network of blood donors and healthcare facilities. We strive to make blood donation accessible, safe, and rewarding for everyone involved.',
    ur: 'خون کی کمی کی وجہ سے کوئی زندگی ضائع نہ ہونے والی دنیا بنانے کے لیے خون دہندگان اور صحت کی سہولیات کا مضبوط اور مؤثر نیٹ ورک بنانا۔ ہم شامل ہر کسی کے لیے خون کا عطیہ قابل رسائ، محفوظ اور فائدہ مند بنانے کی کوشش کرتے ہیں۔',
  },
  'about.vision': {
    en: 'Vision',
    ur: 'ویژن',
  },
  'about.visionText': {
    en: 'To be the global leader in blood donation logistics, leveraging technology to ensure that every patient in need receives timely access to safe blood. We envision a future where blood shortages are a thing of the past.',
    ur: 'خون کے عطیہ کی لاجسٹکس میں عالمی رہنما بنانا، ٹیکنالوجی کا استعمال کرتے ہوئے یقینی بنانا کہ ہر ضرورت مند مریض کو محفوظ خون کی موقع پر رسائی حاصل ہو۔ ہم مستقبل کا تصور کرتے ہیں جہاں خون کی کمی ماضی کی بات ہوگی۔',
  },
  'about.coreValues': {
    en: 'Our Core Values',
    ur: 'ہماری بنیادی اقدار',
  },
  'about.valuesDescription': {
    en: 'These principles guide everything we do, from technology development to community engagement.',
    ur: 'یہ اصول ہمیں ہر کام میں رہنمائی کرتے ہیں، ٹیکنالوجی کی ترقی سے لے کر کمیونٹی کی شمولیت تک۔',
  },
  'about.saveLives': {
    en: 'Save Lives',
    ur: 'زندگیاں بچائیں',
  },
  'about.saveLivesDesc': {
    en: 'Every donation has the potential to save up to three lives. We\'re committed to connecting donors with those in critical need.',
    ur: 'ہر عطیہ میں تین زندگیاں بچانے کی صلاحیت ہوتی ہے۔ ہم شدید ضرورت مند لوگوں سے دہندگان کو جوڑنے کے لیے پرعزم ہیں۔',
  },
  'about.safetyFirst': {
    en: 'Safety First',
    ur: 'سلامتی پہلے',
  },
  'about.safetyFirstDesc': {
    en: 'We maintain the highest standards of safety and privacy for both donors and recipients, following all medical guidelines.',
    ur: 'ہم دہندگان وصول کنندگان دونوں کے لیے سلامتی اور پرائیویسی کی سب سے زیادہ معیارات برقرار رکھتے ہیں، تمام طبی ہدایات پر عمل کرتے ہوئے۔',
  },
  'about.communityDriven': {
    en: 'Community Driven',
    ur: 'کمیونٹی ڈرائیون',
  },
  'about.communityDrivenDesc': {
    en: 'We believe in the power of community. Our platform brings together compassionate individuals to make a collective impact.',
    ur: 'ہم کمیونٹی کی طاقت پر یقین رکھتے ہیں۔ ہمارا پلیٹ فارم ہمدرد افراد کو ایک جماعتی اثر ڈالنے کے لیے اکٹھا کرتا ہے۔',
  },
  'about.efficiency': {
    en: 'Efficiency',
    ur: 'کارکردگی',
  },
  'about.efficiencyDesc': {
    en: 'Using advanced technology, we ensure that blood donations reach those who need them most in the shortest time possible.',
    ur: 'جدید ٹیکنالوجی کا استعمال کرتے ہوئے، ہم یقینی بناتے ہیں کہ خون کے عطیے سب سے کم وقت میں ان لوگوں تک پہنچیں جنہیں سب سے زیادہ ضرورت ہے۔',
  },
  'about.meetTeam': {
    en: 'Meet Our Team',
    ur: 'ہماری ٹیم سے ملاقات کریں',
  },
  'about.teamDescription': {
    en: 'Dedicated professionals working tirelessly to save lives every day.',
    ur: 'ہر دن زندگیاں بچانے کے لیے بے داغ پیشہ ور افراد کام کر رہے ہیں۔',
  },
  'about.getInTouch': {
    en: 'Get in Touch',
    ur: 'رابطہ کریں',
  },
  'about.contactDescription': {
    en: 'Have questions? We\'re here to help. Reach out to us anytime.',
    ur: 'سوالات ہیں؟ ہم مدد کے لیے موجود ہیں۔ کسی بھی وقت ہم سے رابطہ کریں۔',
  },
  'about.phone': {
    en: 'Phone',
    ur: 'فون',
  },
  'about.email': {
    en: 'Email',
    ur: 'ای میل',
  },
  'about.headquarters': {
    en: 'Headquarters',
    ur: 'صدر دفتر',
  },
  'about.joinMission': {
    en: 'Join Our Life-Saving Mission',
    ur: 'ہماری جان بچانے والی مشن میں شامل ہوں',
  },
  'about.joinMissionDesc': {
    en: 'Become part of a community that\'s making a real difference. Every donation counts.',
    ur: 'اس کمیونٹی کا حصہ بنیں جو واقعی فرق بنا رہی ہے۔ ہر عطیہ اہم ہے۔',
  },
  'about.becomeDonorToday': {
    en: 'Become a Donor Today',
    ur: 'آج دہندہ بنیں',
  },
  'about.joinUs': {
    en: 'Join Us',
    ur: 'ہمیں شامل ہوں',
  },

  // How It Works Page
  'how.simpleProcess': {
    en: 'Simple Process',
    ur: 'سادہ عمل',
  },
  'how.title': {
    en: 'How Donoria Works',
    ur: 'دونوریا کیسے کام کرتا ہے',
  },
  'how.description': {
    en: 'Four simple steps to become a life-saving hero. Our streamlined process makes blood donation easy, secure, and impactful.',
    ur: 'جان بچانے والا ہیرو بننے کے لیے چار سادہ مراحل۔ ہمارا سیدھا عمل خون کا عطیہ آسان، محفوظ اور مؤثر بناتا ہے۔',
  },
  'how.startJourney': {
    en: 'Start Your Journey',
    ur: 'اپنی سفر شروع کریں',
  },
  'how.yourJourney': {
    en: 'Your Donation Journey',
    ur: 'آپ کا عطیہ کا سفر',
  },
  'how.journeyDesc': {
    en: 'From registration to donation, we\'ve made every step simple and transparent.',
    ur: 'رجسٹریشن سے لے کر عطیہ تک، ہم نے ہر مرحلے کو سادہ اور شفاف بنایا ہے۔',
  },
  'whyChooseDonoria': {
    en: 'Why Choose Donoria?',
    ur: 'دونوریا کیوں منتخب کریں؟',
  },
  'whyChooseDesc': {
    en: 'We\'re committed to making blood donation accessible, safe, and impactful for everyone.',
    ur: 'ہم ہر کسی کے لیے خون کا عطیہ قابل رسائ، محفوظ اور مؤثر بنانے کے لیے پرعزم ہیں۔',
  },
  'how.readyToSaveLives': {
    en: 'Ready to Save Lives?',
    ur: 'زندگیاں بچانے کے لیے تیار ہیں؟',
  },
  'how.readyDesc': {
    en: 'Join thousands of donors who are making a real difference in their communities.',
    ur: 'ہزاروں دہندگان سے جڑیں جو اپنی کمیونٹیز میں واقعی فرق بنا رہے ہیں۔',
  },
  'how.becomeDonor': {
    en: 'Become a Donor',
    ur: 'دہندہ بنیں',
  },
  'how.learnMore': {
    en: 'Learn More',
    ur: 'مزید جانیں',
  },
  'step.register': {
    en: 'Register',
    ur: 'رجسٹر کریں',
  },
  'step.registerDesc': {
    en: 'Create your donor profile with blood type, location, and contact details. Verification takes less than 5 minutes.',
    ur: 'خون کے گروپ، مقام، اور رابطے کی تفصیلات کے ساتھ اپنا دہندہ پروفائل بنائیں۔ تصدیق 5 منٹ سے کم وقت لیتا ہے۔',
  },
  'step.match': {
    en: 'Match',
    ur: 'مچ',
  },
  'step.matchDesc': {
    en: 'Our AI system matches you with compatible requests from verified hospitals based on blood type and location.',
    ur: 'ہمارا AI سسٹم آپ کو خون کے گروپ اور مقام کی بنیاد پر تصدیق شدہ ہسپتالوں سے موافق درخواستوں سے جوڑتا ہے۔',
  },
  'step.respond': {
    en: 'Respond',
    ur: 'جواب دیں',
  },
  'step.respondDesc': {
    en: 'Accept donation requests and confirm your availability with one tap. Track your donation history.',
    ur: 'عطیے کی درخواستیں قبول کریں اور ایک ٹیپ سے اپنی دستیابی کی تصدیق کریں۔ اپنے عطیے کی تاریخ کو ٹریک کریں۔',
  },
  'step.donate': {
    en: 'Donate',
    ur: 'عطیہ کریں',
  },
  'step.donateDesc': {
    en: 'Visit the hospital, complete your donation, and save lives. Receive updates on the impact of your donation.',
    ur: 'ہسپتال جائیں، اپنا عطیہ مکمل کریں، اور زندگیاں بچائیں۔ اپنے عطیے کے اثر پر اپڈیٹس وصول کریں۔',
  },
  'feature.safeSecure': {
    en: 'Safe & Secure',
    ur: 'محفوظ اور محفوظ',
  },
  'feature.safeSecureDesc': {
    en: 'All donations are handled by certified medical professionals with strict safety protocols.',
    ur: 'تمام عطیے سخت سلامتی پروٹوکول کے ساتھ مصدقہ طبی پیشہ ور افراد کے ذریعے کیے جاتے ہیں۔',
  },
  'feature.availability': {
    en: '24/7 Availability',
    ur: '24/7 دستیابی',
  },
  'feature.availabilityDesc': {
    en: 'Emergency requests are processed round the clock to save critical time.',
    ur: 'ایمرجنسی درخواستیں اہم وقت بچانے کے لیے گھڑی بھری پروسیس کی جاتی ہیں۔',
  },
  'feature.recognition': {
    en: 'Recognition Program',
    ur: 'تسلیم پروگرام',
  },
  'feature.recognitionDesc': {
    en: 'Get recognized for your contributions with badges and impact metrics.',
    ur: 'بیجز اور اثر میٹرکس کے ساتھ اپنی شرائکوں کے لیے تسلیم حاصل کریں۔',
  },

  // Role Select Page
  'role.selectRole': {
    en: 'Choose Your Role',
    ur: 'اپنا کردار منتخب کریں',
  },
  'role.selectDesc': {
    en: 'Select how you want to participate in our life-saving network',
    ur: 'منتخب کریں کہ آپ ہماری جان بچانے والی نیٹ ورک میں کیسے حصہ لینا چاہتے ہیں',
  },
  'role.donorDesc': {
    en: 'Register as a blood or organ donor and help save lives. Get matched with hospitals in need.',
    ur: 'خون یا عضو دہندہ کے طور پر رجسٹر کریں اور زندگیاں بچانے میں مدد کریں۔ ضرورت مند ہسپتالوں سے مچ کریں۔',
  },
  'role.hospitalDesc': {
    en: 'Access verified donors and post urgent blood/organ requests. Manage your donation network.',
    ur: 'تصدیق شدہ دہندگان تک رسائی حاصل کریں اور فوری خون/اعضا کی درخواستیں پوسٹ کریں۔ اپنے عطیہ نیٹ ورک کا انتظام کریں۔',
  },
  'role.browseRequests': {
    en: 'Browse donation requests',
    ur: 'عطیے کی درخواستیں براؤز کریں',
  },
  'role.aiAssistant': {
    en: 'AI health assistant',
    ur: 'AI صحت اسسٹنٹ',
  },
  'role.trackDonations': {
    en: 'Track your donations',
    ur: 'اپنے عطیے ٹریک کریں',
  },
  'role.postRequests': {
    en: 'Post urgent requests',
    ur: 'فوری درخواستیں پوسٹ کریں',
  },
  'role.verifyCompatibility': {
    en: 'Verify donor compatibility',
    ur: 'دہندہ کی مطابقت کی تصدیق کریں',
  },
  'role.realTimeMatching': {
    en: 'Real-time matching',
    ur: 'حقیقی وقت میں میچنگ',
  },
  'role.continueAs': {
    en: 'Continue as',
    ur: 'کے طور پر جاری رکھیں',
  },
  'role.noAccount': {
    en: 'Don\'t have an account?',
    ur: 'کوئی اکاؤنٹ نہیں؟',
  },
  'role.registerHere': {
    en: 'Register here',
    ur: 'یہاں رجسٹر کریں',
  },

  // Profile Page
  'profile.notFound': {
    en: 'Profile not found',
    ur: 'پروفائل نہیں ملا',
  },
  'profile.goHome': {
    en: 'Go Home',
    ur: 'گھر جائیں',
  },
  'profile.donorProfile': {
    en: 'Donor Profile',
    ur: 'دہندہ پروفائل',
  },
  'profile.personalInfo': {
    en: 'Personal Information',
    ur: 'ذاتی معلومات',
  },
  'profile.email': {
    en: 'Email',
    ur: 'ای میل',
  },
  'profile.phone': {
    en: 'Phone',
    ur: 'فون',
  },
  'profile.bloodGroup': {
    en: 'Blood Group',
    ur: 'خون کا گروپ',
  },
  'profile.dateOfBirth': {
    en: 'Date of Birth',
    ur: 'پیدائش کی تاریخ',
  },
  'profile.gender': {
    en: 'Gender',
    ur: 'جنس',
  },
  'profile.location': {
    en: 'Location',
    ur: 'مقام',
  },
  'profile.notSet': {
    en: 'Not set',
    ur: 'سیٹ نہیں ہے',
  },
  'profile.memberSince': {
    en: 'Member since:',
    ur: 'رکنیت شروع:',
  },

  // NotFound Page
  'notfound.title': {
    en: '404',
    ur: '404',
  },
  'notfound.message': {
    en: 'Oops! Page not found',
    ur: 'اوہ! صفحہ نہیں ملا',
  },
  'notfound.returnHome': {
    en: 'Return to Home',
    ur: 'گھر واپس',
  },

  // Login Page Additional
  'login.backToHome': {
    en: 'Back to Home',
    ur: 'گھر واپس',
  },
  'login.signingIn': {
    en: 'Signing in...',
    ur: 'سائن ان ہو رہا ہے...',
  },
  'login.loginAs': {
    en: 'Login as:',
    ur: 'کے طور پر لاگ ان کریں:',
  },
  'login.invalidCredentials': {
    en: 'Invalid admin credentials',
    ur: 'غلط ایڈمن کریڈینشلز',
  },
  'login.authFailed': {
    en: 'Authentication failed. Please try again.',
    ur: 'تصدیق ناکام ہوئی۔ براہ کرم دوبارہ کوشش کریں۔',
  },
  'login.notRegisteredAsDonor': {
    en: 'This email is not registered as a donor. Please use hospital login instead.',
    ur: 'یہ ای میل دہندہ کے طور پر رجسٹر شدہ نہیں ہے۔ براہ کرم ہسپتال لاگ ان کا استعمال کریں۔',
  },
  'login.notRegisteredAsHospital': {
    en: 'This email is not registered as a hospital. Please use donor login instead.',
    ur: 'یہ ای میل ہسپتال کے طور پر رجسٹر شدہ نہیں ہے۔ براہ کرم دہندہ لاگ ان کا استعمال کریں۔',
  },

  // Register Page Additional
  'register.heroTitle': {
    en: 'Become a Hero Today',
    ur: 'آج ہیرو بنیں',
  },
  'register.heroSubtitle': {
    en: 'Register as a donor and join thousands of heroes saving lives every day.',
    ur: 'دہندہ کے طور پر رجسٹر کریں اور ہر روز زندگیاں بچانے والے ہزاروں ہیروز سے جڑیں۔',
  },
  'register.benefit1': {
    en: 'Get matched with nearby hospitals',
    ur: 'قریبی ہسپتالوں سے مچ کریں',
  },
  'register.benefit2': {
    en: 'Track your donation history',
    ur: 'اپنے عطیے کی تاریخ کو ٹریک کریں',
  },
  'register.benefit3': {
    en: 'AI-powered health assistant',
    ur: 'AI پر مبنی صحت اسسٹنٹ',
  },
  'register.benefit4': {
    en: 'Earn recognition badges',
    ur: 'تسلیم بیجز کمائیں',
  },
  'register.selectGender': {
    en: 'Select gender',
    ur: 'جنس منتخب کریں',
  },
  'register.selectBloodGroup': {
    en: 'Select blood group',
    ur: 'خون کا گروپ منتخب کریں',
  },
  'register.back': {
    en: 'Back',
    ur: 'پیچھے',
  },
  'register.creatingAccount': {
    en: 'Creating account...',
    ur: 'اکاؤنٹ بنایا جا رہا ہے...',
  },
  'register.alreadyHaveAccount': {
    en: 'Already have an account?',
    ur: 'پہلے سے اکاؤنٹ ہے؟',
  },
  'register.signIn': {
    en: 'Sign in',
    ur: 'سائن ان',
  },
  'register.agreeTerms': {
    en: 'By registering, you agree to our',
    ur: 'رجسٹر کرکے، آپ ہماری سے متفق ہیں',
  },
  'register.termsOfService': {
    en: 'Terms of Service',
    ur: 'سروس کی شرائط',
  },
  'register.and': {
    en: 'and',
    ur: 'اور',
  },
  'register.privacyPolicy': {
    en: 'Privacy Policy',
    ur: 'پرائیویسی پالیسی',
  },
  'register.fillAllFields': {
    en: 'Please fill in all required fields',
    ur: 'براہ کرم تمام ضروری فیلڈز بھریں',
  },
  'register.fillBloodAndLocation': {
    en: 'Please fill in blood group and location',
    ur: 'براہ کرم خون کا گروپ اور مقام بھریں',
  },
  'register.checkEmail': {
    en: 'Account created! Please check your email to confirm your account, then login.',
    ur: 'اکاؤنٹ بن گیا! براہ کرم اپنے اکاؤنٹ کی تصدیق کے لیے اپنا ای میل چیک کریں، پھر لاگ ان کریں۔',
  },
  'register.failedSession': {
    en: 'Failed to create user session. Please try logging in.',
    ur: 'صارف سیشن بنانے میں ناکام۔ براہ کرم لاگ ان کرنے کی کوشش کریں۔',
  },
  'register.profileError': {
    en: 'Account created but failed to save donor profile. Please contact support.',
    ur: 'اکاؤنٹ بن گیا لیکن دہندہ پروفائل محفوظ کرنے میں ناکام۔ براہ کرم سپورٹ سے رابطہ کریں۔',
  },
  'register.unexpectedError': {
    en: 'An unexpected error occurred. Please try again.',
    ur: 'ایک غیر متوقع خرابی واقع ہوئی۔ براہ کرم دوبارہ کوشش کریں۔',
  },
  'register.placeholderName': {
    en: 'John Doe',
    ur: 'جان ڈو',
  },
  'register.placeholderEmail': {
    en: 'you@example.com',
    ur: 'آپ@example.com',
  },
  'register.placeholderPhone': {
    en: '+1 (555) 000-0000',
    ur: '+92 (300) 000-0000',
  },
  'register.placeholderPassword': {
    en: '••••••••',
    ur: '••••••••',
  },
  'register.placeholderLocation': {
    en: 'City, State',
    ur: 'شہر، صوبہ',
  },

  // Stats Section
  'stats.title': {
    en: 'Making a Difference Together',
    ur: 'الگ سے فرق بنانا',
  },
  'stats.description': {
    en: 'Our platform connects donors with hospitals in real-time, ensuring every donation reaches those in need.',
    ur: 'ہمارا پلیٹ فارم دہندگان کو ہسپتالوں سے ریل ٹائم میں جوڑتا ہے، یقینی بناتا ہے کہ ہر عطیہ ضرورت مندوں تک پہنچے۔',
  },
  'stats.livesSaved': {
    en: 'Lives Saved',
    ur: 'زندگیاں بچائی گئیں',
  },
  'stats.registeredDonors': {
    en: 'Registered Donors',
    ur: 'رجسٹر شدہ دہندگان',
  },
  'stats.verifiedHospitals': {
    en: 'Verified Hospitals',
    ur: 'تصدیق شدہ ہسپتال',
  },
  'stats.avgResponseTime': {
    en: 'Average Response Time',
    ur: 'اوسط جوابی وقت',
  },

  // How It Works Section
  'howItWorks.ourImpact': {
    en: 'Our Impact',
    ur: 'ہمارا اثر',
  },
  'howItWorks.title': {
    en: 'Making a Real Difference',
    ur: 'حقیقی فرق بنانا',
  },
  'howItWorks.description': {
    en: 'See how our community of donors and hospitals are working together to save lives every day.',
    ur: 'دیکھیں کہ ہمارے دہندگان اور ہسپتالوں کی کمیونٹی ہر روز زندگیاں بچانے کے لیے کیسے کام کر رہی ہے۔',
  },
  'howItWorks.bloodDonation': {
    en: 'Blood Donation',
    ur: 'خون کا عطیہ',
  },
  'howItWorks.bloodDonationDesc': {
    en: 'Every blood donation can save up to 3 lives. Your single donation helps patients in need.',
    ur: 'ہر خون کا عطیہ 3 زندگیاں بچا سکتا ہے۔ آپ کا ایک عطیہ ضرورت مند مریضوں کی مدد کرتا ہے۔',
  },
  'howItWorks.livesSaved': {
    en: 'Lives Saved',
    ur: 'زندگیاں بچائی گئیں',
  },
  'howItWorks.organDonation': {
    en: 'Organ Donation',
    ur: 'عضو کا عطیہ',
  },
  'howItWorks.organDonationDesc': {
    en: 'One organ donor can save up to 8 lives and enhance the lives of many more through tissue donation.',
    ur: 'ایک عضو دہندہ 8 تک زندگیاں بچا سکتا ہے اور ٹیشو عطیہ کے ذریعے بہت سے دیگر کی زندگیوں کو بہتر بنا سکتا ہے۔',
  },
  'howItWorks.organTransplants': {
    en: 'Organ Transplants',
    ur: 'عضو کا نقل',
  },
  'howItWorks.hospitalNetwork': {
    en: 'Hospital Network',
    ur: 'ہسپتال نیٹ ورک',
  },
  'howItWorks.hospitalNetworkDesc': {
    en: 'Connected with 200+ verified hospitals across the country for seamless donation coordination.',
    ur: 'ملک بھر میں 200 سے زیادہ تصدیق شدہ ہسپتالوں سے بے داغ عطیہ کے تناسب کے لیے جڑا ہوا ہے۔',
  },
  'howItWorks.partnerHospitals': {
    en: 'Partner Hospitals',
    ur: 'پارٹنر ہسپتال',
  },
  'howItWorks.registeredDonors': {
    en: 'Registered Donors',
    ur: 'رجسٹر شدہ دہندگان',
  },
  'howItWorks.citiesCovered': {
    en: 'Cities Covered',
    ur: 'شہر کور کیے گئے',
  },
  'howItWorks.emergencySupport': {
    en: 'Emergency Support',
    ur: 'ایمرجنسی سپورٹ',
  },
  'howItWorks.joinNetwork': {
    en: 'Join Our Network',
    ur: 'ہماری نیٹ ورک میں شامل ہوں',
  },

  // Hospital Register Page
  'hospitalRegister.backToRole': {
    en: 'Back to Role Selection',
    ur: 'کردار کی منتقابی واپس',
  },
  'hospitalRegister.title': {
    en: 'Hospital Registration',
    ur: 'ہسپتال رجسٹریشن',
  },
  'hospitalRegister.step1Desc': {
    en: 'Basic information about your hospital',
    ur: 'آپ کے ہسپتال کی بنیادی معلومات',
  },
  'hospitalRegister.step2Desc': {
    en: 'Location and contact details',
    ur: 'مقام اور رابطے کی تفصیلات',
  },
  'hospitalRegister.step3Desc': {
    en: 'Facility and emergency information',
    ur: 'سہولت اور ایمرجنسی معلومات',
  },
  'hospitalRegister.hospitalName': {
    en: 'Hospital Name *',
    ur: 'ہسپتال کا نام *',
  },
  'hospitalRegister.placeholderHospitalName': {
    en: 'Enter hospital name',
    ur: 'ہسپتال کا نام درج کریں',
  },
  'hospitalRegister.registrationNumber': {
    en: 'Registration Number *',
    ur: 'رجسٹریشن نمبر *',
  },
  'hospitalRegister.placeholderRegNumber': {
    en: 'Medical council registration number',
    ur: 'میڈیکل کونسل رجسٹریشن نمبر',
  },
  'hospitalRegister.hospitalType': {
    en: 'Hospital Type *',
    ur: 'ہسپتال کی قسم *',
  },
  'hospitalRegister.selectHospitalType': {
    en: 'Select hospital type',
    ur: 'ہسپتال کی قسم منتخب کریں',
  },
  'hospitalRegister.emailAddress': {
    en: 'Email Address *',
    ur: 'ای میل ایڈریس *',
  },
  'hospitalRegister.placeholderHospitalEmail': {
    en: 'hospital@example.com',
    ur: 'hospital@example.com',
  },
  'hospitalRegister.phoneNumber': {
    en: 'Phone Number *',
    ur: 'فون نمبر *',
  },
  'hospitalRegister.placeholderPhone': {
    en: '+1 (555) 123-4567',
    ur: '+92 (300) 123-4567',
  },
  'hospitalRegister.password': {
    en: 'Password *',
    ur: 'پاس ورڈ *',
  },
  'hospitalRegister.placeholderPasswordStrong': {
    en: 'Create a strong password',
    ur: 'ایک مضبوط پاس ورڈ بنائیں',
  },
  'hospitalRegister.confirmPassword': {
    en: 'Confirm Password *',
    ur: 'پاس ورڈ تصدیق کریں *',
  },
  'hospitalRegister.placeholderConfirmPassword': {
    en: 'Confirm your password',
    ur: 'اپنا پاس ورڈ تصدیق کریں',
  },
  'hospitalRegister.streetAddress': {
    en: 'Street Address *',
    ur: 'سٹریٹ ایڈریس *',
  },
  'hospitalRegister.placeholderAddress': {
    en: '123 Medical Center Drive',
    ur: '123 میڈیکل سینٹر ڈرائیو',
  },
  'hospitalRegister.city': {
    en: 'City *',
    ur: 'شہر *',
  },
  'hospitalRegister.placeholderCity': {
    en: 'New York',
    ur: 'نیو یارک',
  },
  'hospitalRegister.state': {
    en: 'State *',
    ur: 'ریاست *',
  },
  'hospitalRegister.selectState': {
    en: 'Select state',
    ur: 'ریاست منتخب کریں',
  },
  'hospitalRegister.zipCode': {
    en: 'ZIP Code *',
    ur: 'زیپ کوڈ *',
  },
  'hospitalRegister.placeholderZip': {
    en: '10001',
    ur: '54000',
  },
  'hospitalRegister.contactPerson': {
    en: 'Contact Person *',
    ur: 'رابطہ کا شخص *',
  },
  'hospitalRegister.placeholderContactPerson': {
    en: 'Dr. John Smith',
    ur: 'ڈاکٹر جان اسمتھ',
  },
  'hospitalRegister.contactPersonRole': {
    en: 'Contact Person Role *',
    ur: 'رابطہ کا کردار *',
  },
  'hospitalRegister.placeholderRole': {
    en: 'Hospital Administrator',
    ur: 'ہسپتال ایڈمنسٹریٹر',
  },
  'hospitalRegister.emergencyContact': {
    en: 'Emergency Contact Number *',
    ur: 'ایمرجنسی رابطہ نمبر *',
  },
  'hospitalRegister.placeholderEmergencyContact': {
    en: '+1 (555) 987-6543',
    ur: '+92 (300) 987-6543',
  },
  'hospitalRegister.bedCapacity': {
    en: 'Total Bed Capacity *',
    ur: 'کل بید کی گنجائش *',
  },
  'hospitalRegister.placeholderBedCapacity': {
    en: '500',
    ur: '500',
  },
  'hospitalRegister.icuCapacity': {
    en: 'ICU Bed Capacity *',
    ur: 'ICU بید کی گنجائش *',
  },
  'hospitalRegister.placeholderIcuCapacity': {
    en: '50',
    ur: '50',
  },
  'hospitalRegister.verificationRequirements': {
    en: 'Verification Requirements',
    ur: 'تصدیق کی ضروریات',
  },
  'hospitalRegister.validLicense': {
    en: 'Valid medical license',
    ur: 'درست میڈیکل لائسنس',
  },
  'hospitalRegister.bloodBankCert': {
    en: 'Blood bank certification',
    ur: 'بلڈ بینک سرٹیفکیشن',
  },
  'hospitalRegister.emergencyCapability': {
    en: 'Emergency services capability',
    ur: 'ایمرجنسی سروسز کی صلاحیت',
  },
  'hospitalRegister.availabilityConfirmation': {
    en: '24/7 availability confirmation',
    ur: '24/7 دستیابی کی تصدیق',
  },
  'hospitalRegister.nextSteps': {
    en: 'Next Steps',
    ur: 'اگلے مراحل',
  },
  'hospitalRegister.nextStepsDesc': {
    en: 'After registration, our team will verify your credentials within 2-3 business days. You\'ll receive an email confirmation once your account is approved.',
    ur: 'رجسٹریشن کے بعد، ہماری ٹیم 2-3 کاروباری دنوں کے اندر آپ کی کریڈینشلز کی تصدیق کرے گی۔ جب آپ کا اکاؤنٹ منظور ہو جائے گا تو آپ کو ای میل کی تصدیق موصول ہوگی۔',
  },
  'hospitalRegister.previous': {
    en: 'Previous',
    ur: 'پچھلا',
  },
  'hospitalRegister.creatingAccount': {
    en: 'Creating account...',
    ur: 'اکاؤنٹ بنایا جا رہا ہے...',
  },
  'hospitalRegister.completeRegistration': {
    en: 'Complete Registration',
    ur: 'رجسٹریشن مکمل کریں',
  },
  'hospitalRegister.nextStep': {
    en: 'Next Step',
    ur: 'اگلا مرحلہ',
  },
  'hospitalRegister.alreadyHaveAccount': {
    en: 'Already have an account?',
    ur: 'پہلے سے اکاؤنٹ ہے؟',
  },
  'hospitalRegister.signInHere': {
    en: 'Sign in here',
    ur: 'یہاں سائن ان کریں',
  },
  'hospitalRegister.fillAllFields': {
    en: 'Please fill in all required fields',
    ur: 'براہ کرم تمام ضروری فیلڈز بھریں',
  },
  'hospitalRegister.passwordsNotMatch': {
    en: 'Passwords do not match',
    ur: 'پاس ورڈز مماثل نہیں ہیں',
  },
  'hospitalRegister.fillBedCapacity': {
    en: 'Please fill in bed capacity information',
    ur: 'براہ کرم بید کی گنجائش کی معلومات بھریں',
  },
  'hospitalRegister.checkEmail': {
    en: 'Account created! Please check your email to confirm your account, then login.',
    ur: 'اکاؤنٹ بن گیا! براہ کرم اپنے اکاؤنٹ کی تصدیق کے لیے اپنا ای میل چیک کریں، پھر لاگ ان کریں۔',
  },
  'hospitalRegister.failedSession': {
    en: 'Failed to create user session. Please try logging in.',
    ur: 'صارف سیشن بنانے میں ناکام۔ براہ کرم لاگ ان کرنے کی کوشش کریں۔',
  },
  'hospitalRegister.saveError': {
    en: 'Account created but failed to save hospital data. Please contact support.',
    ur: 'اکاؤنٹ بن گیا لیکن ہسپتال کا ڈیٹا محفوظ کرنے میں ناکام۔ براہ کرم سپورٹ سے رابطہ کریں۔',
  },
  'hospitalRegister.success': {
    en: 'Hospital registration successful! Your account is now pending verification. You\'ll be redirected to your dashboard.',
    ur: 'ہسپتال رجسٹریشن کامیاب! آپ کا اکاؤنٹ اب تصدیق کے زیر التوا ہے۔ آپ کو اپنے ڈیش بورڈ پر ری ڈائریکٹ کیا جائے گا۔',
  },
  'hospitalRegister.unexpectedError': {
    en: 'An unexpected error occurred. Please try again.',
    ur: 'ایک غیر متوقع خرابی واقع ہوئی۔ براہ کرم دوبارہ کوشش کریں۔',
  },
  'hospitalRegister.typeGovernment': {
    en: 'Government Hospital',
    ur: 'سرکاری ہسپتال',
  },
  'hospitalRegister.typePrivate': {
    en: 'Private Hospital',
    ur: 'نجی ہسپتال',
  },
  'hospitalRegister.typeSpecialty': {
    en: 'Specialty Hospital',
    ur: 'خصوصی ہسپتال',
  },
  'hospitalRegister.typeBloodBank': {
    en: 'Blood Bank',
    ur: 'بلڈ بینک',
  },
  'hospitalRegister.typeClinic': {
    en: 'Clinic',
    ur: 'کلینک',
  },
  'hospitalRegister.typeNursingHome': {
    en: 'Nursing Home',
    ur: 'نرسنگ ہوم',
  },

  // Emergency Button Page
  'emergency.bloodEmergency': {
    en: 'Blood Emergency',
    ur: 'خون کی ایمرجنسی',
  },
  'emergency.bloodEmergencyDesc': {
    en: 'Urgent blood donation needed',
    ur: 'فوری خون کا عطیہ درکار ہے',
  },
  'emergency.organTransplant': {
    en: 'Organ Transplant',
    ur: 'عضو کا نقل',
  },
  'emergency.organTransplantDesc': {
    en: 'Immediate organ transplant required',
    ur: 'فوری عضو کا نقل درکار ہے',
  },
  'emergency.accidentEmergency': {
    en: 'Accident Emergency',
    ur: 'حادثے کی ایمرجنسی',
  },
  'emergency.accidentEmergencyDesc': {
    en: 'Emergency medical assistance needed',
    ur: 'ایمرجنسی طبی امداد درکار ہے',
  },
  'emergency.otherEmergency': {
    en: 'Other Emergency',
    ur: 'دیگر ایمرجنسی',
  },
  'emergency.otherEmergencyDesc': {
    en: 'General medical emergency',
    ur: 'عام طبی ایمرجنسی',
  },
  'emergency.alertActivated': {
    en: 'Emergency Alert Activated',
    ur: 'ایمرجنسی الرٹ فعال',
  },
  'emergency.bloodAlertSending': {
    en: 'Blood donation emergency alert is being sent...',
    ur: 'خون کے عطیے کی ایمرجنسی الرٹ بھیجا جا رہا ہے...',
  },
  'emergency.organAlertSending': {
    en: 'Organ transplant emergency alert is being sent...',
    ur: 'عضو کے نقل کی ایمرجنسی الرٹ بھیجا جا رہا ہے...',
  },
  'emergency.accidentAlertSending': {
    en: 'Accident emergency alert is being sent...',
    ur: 'حادثے کی ایمرجنسی الرٹ بھیجا جا رہا ہے...',
  },
  'emergency.generalAlertSending': {
    en: 'Emergency alert is being sent...',
    ur: 'ایمرجنسی الرٹ بھیجا جا رہا ہے...',
  },
  'emergency.sendingAlert': {
    en: 'Sending alert to nearby hospitals and registered donors...',
    ur: 'قریبی ہسپتالوں اور رجسٹر شدہ دہندگان کو الرٹ بھیجا جا رہا ہے...',
  },
  'emergency.cancelEmergency': {
    en: 'Cancel Emergency',
    ur: 'ایمرجنسی منسوخ کریں',
  },
  'emergency.backToHome': {
    en: 'Back to Home',
    ur: 'گھر واپس',
  },
  'emergency.emergencyAssistance': {
    en: 'Emergency Assistance',
    ur: 'ایمرجنسی امداد',
  },
  'emergency.emergencyAssistanceDesc': {
    en: 'Press the emergency button below to get immediate assistance from nearby hospitals and donors',
    ur: 'قریبی ہسپتالوں اور دہندگان سے فوری امداد حاصل کرنے کے لیے نیچے دیے گئے ایمرجنسی بٹن کو دبائیں',
  },
  'emergency.emergencyButton': {
    en: 'EMERGENCY BUTTON',
    ur: 'ایمرجنسی بٹن',
  },
  'emergency.clickToActivate': {
    en: 'Click to activate emergency alert system',
    ur: 'ایمرجنسی الرٹ سسٹم کو فعال کرنے کے لیے کلک کریں',
  },
  'emergency.locationSharing': {
    en: 'Location Sharing',
    ur: 'مقام شیئرنگ',
  },
  'emergency.locationSharingDesc': {
    en: 'Your exact location will be shared with nearby hospitals and emergency services',
    ur: 'آپ کا بالکل صحیح مقام قریبی ہسپتالوں اور ایمرجنسی سروسز کے ساتھ شیئر کیا جائے گا',
  },
  'emergency.verifiedNetwork': {
    en: 'Verified Network',
    ur: 'تصدیق شدہ نیٹ ورک',
  },
  'emergency.verifiedNetworkDesc': {
    en: 'Only verified hospitals and registered donors will receive your alert',
    ur: 'صرف تصدیق شدہ ہسپتال اور رجسٹر شدہ دہندگان آپ کا الرٹ موصول کریں گے',
  },
  'emergency.available247': {
    en: '24/7 Available',
    ur: '24/7 دستیاب',
  },
  'emergency.available247Desc': {
    en: 'Emergency assistance is available round the clock, every day of the year',
    ur: 'ایمرجنسی امداد سال کے ہر دن گھڑی بھر دستیاب ہے',
  },

  // Admin Register Page
  'adminRegister.backToRole': {
    en: 'Back to Role Selection',
    ur: 'کردار کی منتقابی واپس',
  },
  'adminRegister.title': {
    en: 'Administrator Registration',
    ur: 'ایڈمنسٹریٹر رجسٹریشن',
  },
  'adminRegister.step1Desc': {
    en: 'Personal and professional information',
    ur: 'ذاتی اور پیشہ ورانہ معلومات',
  },
  'adminRegister.step2Desc': {
    en: 'Organization and access details',
    ur: 'تنظیم اور رسائی کی تفصیلات',
  },
  'adminRegister.step3Desc': {
    en: 'Verification and authorization',
    ur: 'تصدیق اور اجازت',
  },
  'adminRegister.fullName': {
    en: 'Full Name *',
    ur: 'پورا نام *',
  },
  'adminRegister.placeholderName': {
    en: 'John Michael Smith',
    ur: 'جان مائیکل اسمتھ',
  },
  'adminRegister.employeeId': {
    en: 'Employee ID *',
    ur: 'ملازم ID *',
  },
  'adminRegister.placeholderEmployeeId': {
    en: 'EMP-123456',
    ur: 'EMP-123456',
  },
  'adminRegister.emailAddress': {
    en: 'Email Address *',
    ur: 'ای میل ایڈریس *',
  },
  'adminRegister.placeholderEmail': {
    en: 'admin@donoria.com',
    ur: 'admin@donoria.com',
  },
  'adminRegister.phoneNumber': {
    en: 'Phone Number *',
    ur: 'فون نمبر *',
  },
  'adminRegister.placeholderPhone': {
    en: '+1 (555) 123-4567',
    ur: '+92 (300) 123-4567',
  },
  'adminRegister.adminType': {
    en: 'Administrator Type *',
    ur: 'ایڈمنسٹریٹر کی قسم *',
  },
  'adminRegister.selectAdminType': {
    en: 'Select administrator type',
    ur: 'ایڈمنسٹریٹر کی قسم منتخب کریں',
  },
  'adminRegister.department': {
    en: 'Department *',
    ur: 'محکمہ *',
  },
  'adminRegister.placeholderDepartment': {
    en: 'Blood Services Management',
    ur: 'بلڈ سروسز مینجمنٹ',
  },
  'adminRegister.yearsOfExperience': {
    en: 'Years of Experience *',
    ur: 'تجربے کے سال *',
  },
  'adminRegister.placeholderYears': {
    en: '5',
    ur: '5',
  },
  'adminRegister.password': {
    en: 'Password *',
    ur: 'پاس ورڈ *',
  },
  'adminRegister.placeholderPassword': {
    en: 'Create a strong password',
    ur: 'ایک مضبوط پاس ورڈ بنائیں',
  },
  'adminRegister.confirmPassword': {
    en: 'Confirm Password *',
    ur: 'پاس ورڈ تصدیق کریں *',
  },
  'adminRegister.placeholderConfirmPassword': {
    en: 'Confirm your password',
    ur: 'اپنا پاس ورڈ تصدیق کریں',
  },
  'adminRegister.organization': {
    en: 'Organization Name *',
    ur: 'تنظیم کا نام *',
  },
  'adminRegister.placeholderOrganization': {
    en: 'Donoria Blood Services',
    ur: 'ڈونوریا بلڈ سروسز',
  },
  'adminRegister.accessLevel': {
    en: 'Access Level *',
    ur: 'رسائی کی سطح *',
  },
  'adminRegister.selectAccessLevel': {
    en: 'Select access level',
    ur: 'رسائی کی سطح منتخب کریں',
  },
  'adminRegister.officeAddress': {
    en: 'Office Address *',
    ur: 'آفس کا پتہ *',
  },
  'adminRegister.placeholderAddress': {
    en: '123 Admin Boulevard',
    ur: '123 ایڈمن بولیوارڈ',
  },
  'adminRegister.city': {
    en: 'City *',
    ur: 'شہر *',
  },
  'adminRegister.placeholderCity': {
    en: 'New York',
    ur: 'نیو یارک',
  },
  'adminRegister.state': {
    en: 'State *',
    ur: 'ریاست *',
  },
  'adminRegister.selectState': {
    en: 'Select state',
    ur: 'ریاست منتخب کریں',
  },
  'adminRegister.zipCode': {
    en: 'ZIP Code *',
    ur: 'زیپ کوڈ *',
  },
  'adminRegister.placeholderZip': {
    en: '10001',
    ur: '54000',
  },
  'adminRegister.supervisorName': {
    en: 'Supervisor Name *',
    ur: 'سپروائر کا نام *',
  },
  'adminRegister.placeholderSupervisor': {
    en: 'Jane Doe',
    ur: 'جین ڈو',
  },
  'adminRegister.supervisorEmail': {
    en: 'Supervisor Email *',
    ur: 'سپروائر ای میل *',
  },
  'adminRegister.placeholderSupervisorEmail': {
    en: 'supervisor@donoria.com',
    ur: 'supervisor@donoria.com',
  },
  'adminRegister.certifications': {
    en: 'Professional Certifications *',
    ur: 'پیشہ ورانہ سرٹیفکیشنز *',
  },
  'adminRegister.placeholderCertifications': {
    en: 'Healthcare Administration Certification, PMP, etc.',
    ur: 'ہیلتھ کیئر ایڈمنسٹریشن سرٹیفکیشن، PMP، وغیرہ',
  },
  'adminRegister.authorizationRequirements': {
    en: 'Authorization Requirements',
    ur: 'اجازت کی ضروریات',
  },
  'adminRegister.validId': {
    en: 'Valid government-issued ID',
    ur: 'درست حکومت جاری کردہ ID',
  },
  'adminRegister.certificationVerification': {
    en: 'Professional certifications verification',
    ur: 'پیشہ ورانہ سرٹیفکیشنز کی تصدیق',
  },
  'adminRegister.employmentVerification': {
    en: 'Employment verification',
    ur: 'ملازمت کی تصدیق',
  },
  'adminRegister.backgroundCheck': {
    en: 'Background check clearance',
    ur: 'بیک گراؤنڈ چیک کلیرنس',
  },
  'adminRegister.supervisorApproval': {
    en: 'Supervisor approval',
    ur: 'سپروائر کی منظوری',
  },
  'adminRegister.systemAccess': {
    en: 'System Access',
    ur: 'سسٹم رسائی',
  },
  'adminRegister.uponApproval': {
    en: 'Upon approval, you will have access to:',
    ur: 'منظوری کے بعد، آپ تک رسائی ہوگی:',
  },
  'adminRegister.access1': {
    en: 'User management and verification',
    ur: 'صارف مینجمنٹ اور تصدیق',
  },
  'adminRegister.access2': {
    en: 'Blood donation tracking',
    ur: 'خون کے عطیے کی ٹریکنگ',
  },
  'adminRegister.access3': {
    en: 'Hospital network management',
    ur: 'ہسپتال نیٹ ورک مینجمنٹ',
  },
  'adminRegister.access4': {
    en: 'Emergency response coordination',
    ur: 'ایمرجنسی ریسپانس کورڈینیشن',
  },
  'adminRegister.access5': {
    en: 'Analytics and reporting',
    ur: 'اینالٹکس اور رپورٹنگ',
  },
  'adminRegister.securityNotice': {
    en: 'Security Notice',
    ur: 'سیکیورٹی نوٹس',
  },
  'adminRegister.securityNoticeDesc': {
    en: 'This account provides administrative access to sensitive healthcare data. Unauthorized access is prohibited and will be prosecuted to the fullest extent of the law.',
    ur: 'یہ اکاؤنٹ حساس صحت کے ڈیٹا تک انتظامی رسائی فراہم کرتا ہے۔ غیر مجاز رسائی ممنوع ہے اور قانون کے مطابق مقدمہ چلایا جائے گا۔',
  },
  'adminRegister.previous': {
    en: 'Previous',
    ur: 'پچھلا',
  },
  'adminRegister.completeRegistration': {
    en: 'Complete Registration',
    ur: 'رجسٹریشن مکمل کریں',
  },
  'adminRegister.nextStep': {
    en: 'Next Step',
    ur: 'اگلا مرحلہ',
  },
  'adminRegister.alreadyHaveAccount': {
    en: 'Already have an account?',
    ur: 'پہلے سے اکاؤنٹ ہے؟',
  },
  'adminRegister.signInHere': {
    en: 'Sign in here',
    ur: 'یہاں سائن ان کریں',
  },
  'adminRegister.success': {
    en: 'Administrator registration successful! Your account is now pending verification. You\'ll be redirected to your dashboard.',
    ur: 'ایڈمنسٹریٹر رجسٹریشن کامیاب! آپ کا اکاؤنٹ اب تصدیق کے زیر التوا ہے۔ آپ کو اپنے ڈیش بورڈ پر ری ڈائریکٹ کیا جائے گا۔',
  },
  'adminRegister.typeSystem': {
    en: 'System Administrator',
    ur: 'سسٹم ایڈمنسٹریٹر',
  },
  'adminRegister.typeRegional': {
    en: 'Regional Manager',
    ur: 'علاقائی منیجر',
  },
  'adminRegister.typeBloodBank': {
    en: 'Blood Bank Manager',
    ur: 'بلڈ بینک منیجر',
  },
  'adminRegister.typeHospitalNetwork': {
    en: 'Hospital Network Admin',
    ur: 'ہسپتال نیٹ ورک ایڈمن',
  },
  'adminRegister.typeEmergency': {
    en: 'Emergency Response Coordinator',
    ur: 'ایمرجنسی ریسپانس کوآرڈینیٹر',
  },
  'adminRegister.typeQA': {
    en: 'Quality Assurance Manager',
    ur: 'کوالٹی ایشورنس منیجر',
  },
  'adminRegister.accessFull': {
    en: 'Full System Access',
    ur: 'مکمل سسٹم رسائی',
  },
  'adminRegister.accessRegional': {
    en: 'Regional Access',
    ur: 'علاقائی رسائی',
  },
  'adminRegister.accessHospital': {
    en: 'Hospital Network Access',
    ur: 'ہسپتال نیٹ ورک رسائی',
  },
  'adminRegister.accessLimited': {
    en: 'Limited Access',
    ur: 'محدود رسائی',
  },
  'dashboard.needed': {
    en: 'Needed',
    ur: 'درکار',
  },
  'dashboard.compatibility': {
    en: 'Compatibility',
    ur: 'مطابقت',
  },
  'dashboard.viewDetails': {
    en: 'View Details',
    ur: 'تفصیلات دیکھیں',
  },
  'navbar.editProfile': {
    en: 'Edit Profile',
    ur: 'پروفائل میں ترمیم کریں',
  },
  'navbar.notifications': {
    en: 'Notifications',
    ur: 'اطلاعات',
  },
  'navbar.signOut': {
    en: 'Sign Out',
    ur: 'لاگ آؤٹ',
  },
  'role.backToHome': {
    en: 'Back to Home',
    ur: 'ہوم پر واپس جائیں',
  },
  'adminDashboard.title': {
    en: 'Donoria Admin Console',
    ur: 'ڈونوریا ایڈمنسٹریٹر کنسول',
  },
  'adminDashboard.welcome': {
    en: 'Welcome, System Administrator',
    ur: 'خوش آمدید، سسٹم ایڈمنسٹریٹر',
  },
  'adminDashboard.welcomeDescription': {
    en: 'Monitor network vitals, verify hospital credentials, and manage active matches.',
    ur: 'نیٹ ورک کی کارکردگی کی نگرانی کریں، ہسپتال کے اسناد کی تصدیق کریں، اور میچز کا انتظام کریں۔',
  },
  'adminDashboard.pendingVerifications': {
    en: 'Pending Verifications',
    ur: 'زیر التواء تصدیقیں',
  },
  'adminDashboard.verifiedHospitals': {
    en: 'Verified Hospitals',
    ur: 'تصدیق شدہ ہسپتالوں',
  },
  'adminDashboard.totalDonors': {
    en: 'Total Donors',
    ur: 'کل عطیہ دہندگان',
  },
  'adminDashboard.organRequests': {
    en: 'Organ Requests',
    ur: 'اعضاء کی درخواستیں',
  },
  'adminDashboard.viewAll': {
    en: 'View All',
    ur: 'تمام دیکھیں',
  },
  'adminDashboard.pendingReview': {
    en: 'Pending Review',
    ur: 'زیر جائزہ',
  },
  'adminDashboard.documentsSubmitted': {
    en: 'documents submitted',
    ur: 'دستاویزات جمع کرائی گئیں',
  },
  'adminDashboard.reviewDocuments': {
    en: 'Review Documents',
    ur: 'دستاویزات کا جائزہ لیں',
  },
  'adminDashboard.approve': {
    en: 'Approve',
    ur: 'منظور کریں',
  },
  'adminDashboard.todaysActivity': {
    en: "Today's Activity",
    ur: 'آج کی سرگرمی',
  },
  'adminDashboard.newRegistrations': {
    en: 'New Registrations',
    ur: 'نئی رجسٹریشنز',
  },
  'adminDashboard.donationsCompleted': {
    en: 'Donations Completed',
    ur: 'عطیات مکمل',
  },
  'adminDashboard.activeRequests': {
    en: 'Active Requests',
    ur: 'فعال درخواستیں',
  },
  'adminDashboard.feedbackReceived': {
    en: 'Feedback Received',
    ur: 'موصولہ رائے',
  },
  'adminDashboard.recentActivity': {
    en: 'Recent Activity',
    ur: 'حالیہ سرگرمی',
  },
  'adminDashboard.adminActions': {
    en: 'Admin Actions',
    ur: 'ایڈمن اقدامات',
  },
  'adminDashboard.verifyHospitals': {
    en: 'Verify Hospitals',
    ur: 'ہسپتالوں کی تصدیق کریں',
  },
  'adminDashboard.manageUsers': {
    en: 'Manage Users',
    ur: 'صافرین کا انتظام کریں',
  },
  'adminDashboard.viewAnalytics': {
    en: 'View Analytics',
    ur: 'تجزیات دیکھیں',
  },
  'adminDashboard.moderateFeedback': {
    en: 'Moderate Feedback',
    ur: 'رائے کی اعتدال پسندی',
  },
  'adminDashboard.signOut': {
    en: 'Sign Out',
    ur: 'لاگ آؤٹ',
  },
};

const LanguageContext = createContext(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key) => {
    return translations[key]?.[language] || key;
  };

  // Update document direction when language changes
  useEffect(() => {
    const dir = language === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
