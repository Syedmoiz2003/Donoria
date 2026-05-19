import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { sendMessageToOpenAI } from "@/lib/openai";
import { transliterateToUrdu } from "@/lib/transliterate";
import { 
  ArrowLeft, 
  Send, 
  Bot, 
  User, 
  Heart, 
  Droplets, 
  Activity,
  ShieldCheck,
  Clock,
  HelpCircle,
  Trash2,
  Globe,
  MessageCircle,
  Plus
} from "lucide-react";

const predefinedQuestions = [
  {
    id: "eligibility",
    icon: <ShieldCheck className="h-4 w-4" />,
    key: "healthChatbot.eligibility",
  },
  {
    id: "blood-types",
    icon: <Droplets className="h-4 w-4" />,
    key: "healthChatbot.bloodTypes",
  },
  {
    id: "after-donation",
    icon: <Activity className="h-4 w-4" />,
    key: "healthChatbot.afterDonation",
  },
  {
    id: "organ-donation",
    icon: <Heart className="h-4 w-4" />,
    key: "healthChatbot.organDonation",
  },
  {
    id: "frequency",
    icon: <Clock className="h-4 w-4" />,
    key: "healthChatbot.frequency",
  },
  {
    id: "preparation",
    icon: <HelpCircle className="h-4 w-4" />,
    key: "healthChatbot.preparation",
  }
];

export default function HealthChatbot() {
  const { t, language, setLanguage } = useLanguage();
  const bottomRef = useRef(null);

  const defaultMessages = [
    {
      id: "greeting",
      role: "assistant",
      content: t('healthChatbot.greeting')
    }
  ];

  const [activeSessionId, setActiveSessionId] = useState(() => {
    return localStorage.getItem("healthChatbotActiveSession") || 'default';
  });

  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem("healthChatbotSessions");
    if (saved) return JSON.parse(saved);
    
    // Migration from old single-session
    const oldMessages = localStorage.getItem("healthChatbotMessages");
    const oldHistory = localStorage.getItem("healthChatbotHistory");
    if (oldMessages && oldHistory) {
      return [{ id: 'default', title: 'Chat 1', messages: JSON.parse(oldMessages), history: JSON.parse(oldHistory) }];
    }
    
    return [{ id: 'default', title: 'New Chat', messages: defaultMessages, history: [] }];
  });

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const [messages, setMessages] = useState(activeSession.messages || defaultMessages);
  const [conversationHistory, setConversationHistory] = useState(activeSession.history || []);

  useEffect(() => {
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        let title = s.title;
        const firstUserMsg = messages.find(m => m.role === 'user');
        if (firstUserMsg && (title === 'Current Session' || title === 'موجودہ سیشن' || title === 'New Chat' || title === 'نئی چیٹ' || title === 'Chat 1')) {
            title = firstUserMsg.content.slice(0, 25) + (firstUserMsg.content.length > 25 ? '...' : '');
        }
        return { ...s, messages, history: conversationHistory, title };
      }
      return s;
    }));
  }, [messages, conversationHistory, activeSessionId]);

  useEffect(() => {
    localStorage.setItem("healthChatbotSessions", JSON.stringify(sessions));
    localStorage.setItem("healthChatbotActiveSession", activeSessionId);
  }, [sessions, activeSessionId]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);

  // Auto scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (userText) => {
    if (!userText.trim() || isTyping) return;

    setError(null);

    // Add user message to UI
    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: userText
    };
    setMessages(prev => [...prev, userMessage]);

    // Add to OpenAI conversation history
    const updatedHistory = [
      ...conversationHistory,
      { role: "user", content: userText }
    ];
    setConversationHistory(updatedHistory);
    setInputValue("");
    setIsTyping(true);

    try {
      // Call real OpenAI API
      const reply = await sendMessageToOpenAI(updatedHistory, language);

      // Add AI response to UI
      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: reply
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Save AI response to history too
      setConversationHistory(prev => [
        ...prev,
        { role: "assistant", content: reply }
      ]);
    } catch (err) {
      setError("Sorry, I'm unavailable right now. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  const handlePredefinedQuestion = (question) => {
    sendMessage(t(question.key));
  };

  const handleInputChange = async (e) => {
    const val = e.target.value;
    setInputValue(val);

    if (language === 'ur' && val.endsWith(' ')) {
      const words = val.split(' ');
      const lastWord = words[words.length - 2];
      
      if (lastWord && /[a-zA-Z]/.test(lastWord)) {
        const transliterated = await transliterateToUrdu(lastWord);
        const newWords = [...words];
        newWords[newWords.length - 2] = transliterated;
        setInputValue(newWords.join(' '));
      }
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;
    
    let textToSend = inputValue;
    if (language === 'ur' && /[a-zA-Z]/.test(textToSend)) {
      const words = textToSend.split(' ');
      for (let i = 0; i < words.length; i++) {
        if (/[a-zA-Z]/.test(words[i])) {
          words[i] = await transliterateToUrdu(words[i]);
        }
      }
      textToSend = words.join(' ');
      setInputValue(textToSend);
    }
    
    sendMessage(textToSend);
  };

  const clearCurrentChat = () => {
    setMessages(defaultMessages);
    setConversationHistory([]);
  };

  const startNewChat = () => {
    const newId = `session-${Date.now()}`;
    const defaultTitle = language === 'ur' ? 'نئی چیٹ' : 'New Chat';
    setSessions(prev => [{ id: newId, title: defaultTitle, messages: defaultMessages, history: [] }, ...prev]);
    setActiveSessionId(newId);
    setMessages(defaultMessages);
    setConversationHistory([]);
  };

  const switchSession = (id) => {
    const session = sessions.find(s => s.id === id);
    if (session) {
      setActiveSessionId(id);
      setMessages(session.messages || defaultMessages);
      setConversationHistory(session.history || []);
    }
  };

  const deleteSession = (e, id) => {
    e.stopPropagation();
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== id);
      if (filtered.length === 0) {
        const newId = `session-${Date.now()}`;
        setActiveSessionId(newId);
        setMessages(defaultMessages);
        setConversationHistory([]);
        return [{ id: newId, title: language === 'ur' ? 'نئی چیٹ' : 'New Chat', messages: defaultMessages, history: [] }];
      }
      if (id === activeSessionId) {
        setActiveSessionId(filtered[0].id);
        setMessages(filtered[0].messages || defaultMessages);
        setConversationHistory(filtered[0].history || []);
      }
      return filtered;
    });
  };

  return (
    <div className={`min-h-screen bg-background ${language === "ur" ? "rtl" : "ltr"}`}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/donor/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">{t('healthChatbot.backToDashboard')}</span>
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            <div className="text-center">
              <h1 className="font-semibold text-foreground">{t('healthChatbot.title')}</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">{t('healthChatbot.subtitle')}</p>
            </div>
          </div>
          {/* Language toggle & Clear */}
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs flex items-center gap-2"
              onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
              title="Toggle Language"
            >
              <Globe className="h-3.5 w-3.5" />
              {language === 'ur' ? 'English' : 'اردو'}
            </Button>
            <Button variant="ghost" size="icon" onClick={clearCurrentChat} title="Clear Current Chat">
              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-[1400px]">
        <div className="grid lg:grid-cols-4 gap-6">
          
          {/* Previous Chats Sidebar */}
          <div className="lg:col-span-1 order-1 lg:order-1">
             <Card className="p-4 lg:sticky lg:top-24 lg:h-[calc(100vh-180px)] h-[300px] flex flex-col">
               <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                 <MessageCircle className="h-5 w-5 text-primary" />
                 {language === 'ur' ? 'پچھلی چیٹس' : 'Previous Chats'}
               </h3>
               <Button variant="outline" className="w-full mb-4 justify-start gap-2" onClick={startNewChat}>
                 <Plus className="h-4 w-4" />
                 {language === 'ur' ? 'نئی چیٹ' : 'New Chat'}
               </Button>
               <div className="flex-1 overflow-y-auto space-y-2">
                 {sessions.map(session => (
                   <button 
                     key={session.id}
                     onClick={() => switchSession(session.id)}
                     className={`w-full text-left p-3 rounded-lg transition-colors text-sm font-medium flex items-center justify-between group ${
                       session.id === activeSessionId ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'
                     }`}
                   >
                     <span className="truncate pr-2">{session.title}</span>
                     <Trash2 
                       className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 hover:text-destructive transition-all flex-shrink-0" 
                       onClick={(e) => deleteSession(e, session.id)} 
                     />
                   </button>
                 ))}
               </div>
             </Card>
          </div>

          {/* Quick Questions Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-3">
            <Card className="p-4 lg:sticky lg:top-24 max-h-[300px] overflow-y-auto">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                {t('healthChatbot.predefinedTitle')}
              </h3>
              <div className="space-y-2">
                {predefinedQuestions.map((question) => (
                  <button
                    key={question.id}
                    onClick={() => handlePredefinedQuestion(question)}
                    disabled={isTyping}
                    className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-primary/10 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-primary mt-0.5 group-hover:scale-110 transition-transform">
                        {question.icon}
                      </span>
                      <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                        {t(question.key)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 order-3 lg:order-2">
            <Card className="flex flex-col h-[600px] lg:h-[calc(100vh-180px)]">
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${
                      message.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}>
                      {message.role === "user" 
                        ? <User className="h-4 w-4" /> 
                        : <Bot className="h-4 w-4" />
                      }
                    </div>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-muted text-foreground rounded-tl-sm"
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.id === "greeting" ? t('healthChatbot.greeting') : message.content}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Error message */}
                {error && (
                  <div className="text-center text-sm text-red-500 bg-red-50 rounded-lg p-3">
                    {error}
                  </div>
                )}

                <div ref={bottomRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-border p-4">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                    placeholder={t('healthChatbot.placeholder')}
                    className="flex-1"
                    dir={language === "ur" ? "rtl" : "ltr"}
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="gap-2"
                  >
                    <Send className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('healthChatbot.send')}</span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  {t('healthChatbot.disclaimer')}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}