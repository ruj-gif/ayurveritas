import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Building2, 
  FileText, 
  Upload, 
  CheckCircle, 
  Clock, 
  XCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface KYCData {
  companyName: string;
  gstNumber: string;
  panNumber: string;
  address: string;
  contactPersonName: string;
  businessProofFile: File | null;
  businessProofUrl: string | null;
}

type KYCStatus = 'pending' | 'verified' | 'rejected' | 'not_submitted';

const DistributorKYC: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [kycStatus, setKycStatus] = useState<KYCStatus>('not_submitted');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [kycData, setKycData] = useState<KYCData>({
    companyName: '',
    gstNumber: '',
    panNumber: '',
    address: '',
    contactPersonName: '',
    businessProofFile: null,
    businessProofUrl: null
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: t('fileTooLarge'),
          description: t('pleaseSelectSmallerImage'),
          variant: "destructive"
        });
        return;
      }

      if (!file.type.includes('pdf') && !file.type.includes('image')) {
        toast({
          title: t('error'),
          description: 'Please select a PDF or image file.',
          variant: "destructive"
        });
        return;
      }

      setKycData(prev => ({
        ...prev,
        businessProofFile: file,
        businessProofUrl: URL.createObjectURL(file)
      }));
      
      toast({
        title: t('photoUploaded'),
        description: 'Business proof document has been attached.',
        variant: "default"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!kycData.companyName || !kycData.gstNumber || !kycData.panNumber || !kycData.address || !kycData.contactPersonName || !kycData.businessProofFile) {
      toast({
        title: t('incompleteInformation'),
        description: 'Please fill in all required fields including business proof upload.',
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setKycStatus('pending');
    
    toast({
      title: t('kycCompletedSuccessfully'),
      description: 'Your business KYC documents have been submitted for verification.',
      variant: "default"
    });
  };

  const getStatusIcon = () => {
    switch (kycStatus) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-warning" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = () => {
    switch (kycStatus) {
      case 'verified':
        return <Badge variant="verified">{t('kycVerified')}</Badge>;
      case 'pending':
        return <Badge variant="pending">{t('kycPending')}</Badge>;
      case 'rejected':
        return <Badge variant="destructive">{t('kycRejected')}</Badge>;
      default:
        return <Badge variant="secondary">Not Submitted</Badge>;
    }
  };

  if (isSubmitted && kycStatus === 'pending') {
    return (
      <Card className="border-warning">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-warning" />
          </div>
          <CardTitle className="text-warning">{t('kycVerification')}</CardTitle>
          <CardDescription>
            Your business KYC documents have been submitted and are under review.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            {getStatusBadge()}
            <p className="text-sm text-muted-foreground">
              Verification typically takes 2-3 business days
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium">Submitted Documents:</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <span>Company: {kycData.companyName}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <span>GST: {kycData.gstNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <span>PAN: {kycData.panNumber}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>{t('kycVerification')}</CardTitle>
              <CardDescription>
                Complete your business KYC verification to access all features
              </CardDescription>
            </div>
          </div>
          {kycStatus !== 'not_submitted' && (
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              {getStatusBadge()}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {kycStatus === 'verified' ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-success">Business KYC Verified!</h3>
              <p className="text-sm text-muted-foreground">
                Your business identity has been verified. You can now access all platform features.
              </p>
            </div>
          </div>
        ) : kycStatus === 'rejected' ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-destructive">Business KYC Rejected</h3>
              <p className="text-sm text-muted-foreground">
                Your business KYC documents were rejected. Please resubmit with correct information.
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => {
                setKycStatus('not_submitted');
                setIsSubmitted(false);
              }}
            >
              Resubmit KYC
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Name */}
            <div className="space-y-2">
              <Label htmlFor="companyName">{t('companyName')} *</Label>
              <Input
                id="companyName"
                value={kycData.companyName}
                onChange={(e) => setKycData(prev => ({ ...prev, companyName: e.target.value }))}
                placeholder="Enter company name"
                required
              />
            </div>

            {/* GST Number */}
            <div className="space-y-2">
              <Label htmlFor="gstNumber">{t('gstNumber')} *</Label>
              <Input
                id="gstNumber"
                value={kycData.gstNumber}
                onChange={(e) => setKycData(prev => ({ ...prev, gstNumber: e.target.value }))}
                placeholder="Enter GST number"
                required
              />
            </div>

            {/* PAN Number */}
            <div className="space-y-2">
              <Label htmlFor="panNumber">{t('panNumber')} *</Label>
              <Input
                id="panNumber"
                value={kycData.panNumber}
                onChange={(e) => setKycData(prev => ({ ...prev, panNumber: e.target.value }))}
                placeholder="Enter PAN number"
                required
              />
            </div>

            {/* Contact Person Name */}
            <div className="space-y-2">
              <Label htmlFor="contactPersonName">{t('contactPersonName')} *</Label>
              <Input
                id="contactPersonName"
                value={kycData.contactPersonName}
                onChange={(e) => setKycData(prev => ({ ...prev, contactPersonName: e.target.value }))}
                placeholder="Enter contact person name"
                required
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">{t('address')} *</Label>
              <Textarea
                id="address"
                value={kycData.address}
                onChange={(e) => setKycData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter company complete address"
                rows={3}
                required
              />
            </div>

            {/* Business Proof Upload */}
            <div className="space-y-2">
              <Label>{t('businessProofUpload')} *</Label>
              <div className="space-y-4">
                {kycData.businessProofUrl ? (
                  <div className="relative">
                    {kycData.businessProofFile?.type.includes('image') ? (
                      <img 
                        src={kycData.businessProofUrl} 
                        alt="Business proof preview"
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                    ) : (
                      <div className="w-full h-48 bg-muted rounded-lg border flex items-center justify-center">
                        <FileText className="h-12 w-12 text-muted-foreground" />
                        <span className="ml-2 text-sm text-muted-foreground">
                          {kycData.businessProofFile?.name}
                        </span>
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setKycData(prev => ({ 
                        ...prev, 
                        businessProofFile: null, 
                        businessProofUrl: null 
                      }))}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div 
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">Click to upload business proof document</p>
                    <p className="text-xs text-muted-foreground">PDF, JPG, PNG up to 10MB</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              variant="distributor" 
              size="lg" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Submitting KYC...
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Submit Business KYC Documents
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default DistributorKYC;
