import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  HelpCircle, 
  BookOpen, 
  Video, 
  MessageCircle, 
  Phone, 
  Mail, 
  ExternalLink,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

const Help: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('faq');

  const faqItems = [
    {
      question: "How do I register a new harvest?",
      answer: "To register a new harvest, go to the 'Register Harvest' page, fill in the herb type, quantity, harvest date, upload a photo (optional), set your farm location, and click 'Register Harvest & Generate QR'. Your batch will be created with a unique ID and QR code."
    },
    {
      question: "How does location tracking work?",
      answer: "You can set your farm location in three ways: 1) Upload a photo with GPS data (EXIF), 2) Use the 'Get GPS Location' button for current position, or 3) Enter coordinates manually. The system will use the most accurate location available."
    },
    {
      question: "What happens after I register a harvest?",
      answer: "After registration, your batch gets a unique ID and QR code. It's recorded on the blockchain and sent to distributors for verification. Once verified, you'll receive payment. You can track the status in 'My Batches'."
    },
    {
      question: "How do I track my batch status?",
      answer: "Go to 'My Batches' to see all your registered harvests. You can filter by status (pending, verified, rejected) and search by herb type or batch ID. Click 'View Details' for more information."
    },
    {
      question: "What if my batch gets rejected?",
      answer: "If a batch is rejected, you'll see the rejection reason in 'My Batches'. Common reasons include quality issues or incomplete information. You can contact support for more details or register a new batch."
    },
    {
      question: "How do I download my QR codes?",
      answer: "In 'My Batches', click the 'QR Code' button next to any batch to download its QR code. This QR code contains all the batch information and can be used for verification throughout the supply chain."
    }
  ];

  const tutorials = [
    {
      title: "Getting Started with Ayur-Veritas",
      description: "Learn the basics of registering your first harvest",
      duration: "5 min",
      type: "Video",
      icon: <Video className="h-4 w-4" />
    },
    {
      title: "Location and GPS Setup",
      description: "Master location tracking for your farm",
      duration: "3 min",
      type: "Video",
      icon: <Video className="h-4 w-4" />
    },
    {
      title: "Understanding Batch Status",
      description: "Learn what each status means for your batches",
      duration: "2 min",
      type: "Article",
      icon: <BookOpen className="h-4 w-4" />
    },
    {
      title: "QR Code Best Practices",
      description: "How to use and share your batch QR codes",
      duration: "4 min",
      type: "Article",
      icon: <BookOpen className="h-4 w-4" />
    }
  ];

  const contactMethods = [
    {
      title: "Live Chat",
      description: "Get instant help from our support team",
      icon: <MessageCircle className="h-5 w-5" />,
      available: true,
      action: "Start Chat"
    },
    {
      title: "Phone Support",
      description: "Call us for urgent issues",
      icon: <Phone className="h-5 w-5" />,
      available: true,
      action: "+91 98765 43210"
    },
    {
      title: "Email Support",
      description: "Send us detailed queries",
      icon: <Mail className="h-5 w-5" />,
      available: true,
      action: "support@ayurveritas.com"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <HelpCircle className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Help & Support</h1>
          <p className="text-muted-foreground text-lg">
            Get help with using Ayur-Veritas platform
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        {[
          { id: 'faq', label: 'FAQ', icon: <HelpCircle className="h-4 w-4" /> },
          { id: 'tutorials', label: 'Tutorials', icon: <BookOpen className="h-4 w-4" /> },
          { id: 'contact', label: 'Contact', icon: <MessageCircle className="h-4 w-4" /> }
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'ghost'}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2"
          >
            {tab.icon}
            {tab.label}
          </Button>
        ))}
      </div>

      {/* FAQ Tab */}
      {activeTab === 'faq' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find answers to common questions about using the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tutorials Tab */}
      {activeTab === 'tutorials' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Learning Resources</CardTitle>
              <CardDescription>
                Step-by-step guides and video tutorials to help you get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {tutorials.map((tutorial, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            {tutorial.icon}
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-semibold">{tutorial.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {tutorial.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {tutorial.duration}
                              <Badge variant="outline" className="text-xs">
                                {tutorial.type}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Contact Tab */}
      {activeTab === 'contact' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
              <CardDescription>
                Choose your preferred way to contact our support team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {contactMethods.map((method, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            {method.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold flex items-center gap-2">
                              {method.title}
                              {method.available && (
                                <CheckCircle className="h-4 w-4 text-success" />
                              )}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {method.description}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant={method.available ? "default" : "outline"} 
                          size="sm"
                          disabled={!method.available}
                        >
                          {method.action}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Status */}
          <Card>
            <CardHeader>
              <CardTitle>Support Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">All systems operational</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-warning" />
                  <span className="text-sm">Average response time: 2 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-info" />
                  <span className="text-sm">Live chat available 9 AM - 6 PM IST</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Help;
