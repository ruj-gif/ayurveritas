import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockBatches } from '@/data/mockData';
import { 
  FileText, 
  Upload, 
  Search, 
  Eye, 
  Download,
  Calendar,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface LabReport {
  id: string;
  batchId: string;
  fileName: string;
  fileType: string;
  uploadDate: string;
  fileUrl: string;
}

const LabReportUpload: React.FC = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [searchBatchId, setSearchBatchId] = useState('');
  const [foundBatch, setFoundBatch] = useState<any>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // Mock lab reports data
  const [labReports, setLabReports] = useState<LabReport[]>([
    {
      id: 'LAB-001',
      batchId: 'AYUR-2024-001',
      fileName: 'Quality_Analysis_Report.pdf',
      fileType: 'application/pdf',
      uploadDate: '2024-01-16T14:30:00Z',
      fileUrl: '/api/placeholder/document'
    }
  ]);

  const searchBatch = () => {
    if (!searchBatchId.trim()) {
      toast({
        title: t('enterBatchId'),
        description: t('pleaseEnterBatchId'),
        variant: "destructive"
      });
      return;
    }

    const batch = mockBatches.find(b => b.id === searchBatchId.trim());
    
    if (batch) {
      setFoundBatch(batch);
      toast({
        title: t('batchFound'),
        description: `${batch.herbType} from ${batch.farmerName}`,
        variant: "default"
      });
    } else {
      toast({
        title: t('batchNotFound'),
        description: t('batchIdNotExist'),
        variant: "destructive"
      });
      setFoundBatch(null);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: t('error'),
          description: "Please upload PDF, JPG, or PNG files only.",
          variant: "destructive"
        });
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: t('fileTooLarge'),
          description: "Please select a file smaller than 10MB.",
          variant: "destructive"
        });
        return;
      }

      setUploadedFile(file);
    }
  };

  const uploadReport = async () => {
    if (!foundBatch || !uploadedFile) {
      toast({
        title: t('incompleteInformation'),
        description: "Please search for a batch and select a file to upload.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    // Simulate file upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newReport: LabReport = {
      id: `LAB-${String(labReports.length + 1).padStart(3, '0')}`,
      batchId: foundBatch.id,
      fileName: uploadedFile.name,
      fileType: uploadedFile.type,
      uploadDate: new Date().toISOString(),
      fileUrl: URL.createObjectURL(uploadedFile) // In real app, this would be the server URL
    };
    
    setLabReports(prev => [...prev, newReport]);
    setUploading(false);
    setUploadedFile(null);
    
    toast({
      title: t('labReportUploadedSuccessfully'),
      description: `Report for batch ${foundBatch.id} has been successfully uploaded.`,
      variant: "default"
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getBatchReports = (batchId: string) => {
    return labReports.filter(report => report.batchId === batchId);
  };

  const PreviewDialog = ({ report }: { report: LabReport }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          {t('previewReport')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{t('labReportPreview')}</DialogTitle>
          <DialogDescription>
            {report.fileName} - {t('uploadedOn')} {new Date(report.uploadDate).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center h-96 bg-muted/20 rounded-lg">
          {report.fileType === 'application/pdf' ? (
            <div className="text-center">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">PDF Preview</p>
              <Button variant="outline" onClick={() => window.open(report.fileUrl, '_blank')}>
                <Download className="h-4 w-4 mr-2" />
                {t('openPdf')}
              </Button>
            </div>
          ) : (
            <img 
              src={report.fileUrl} 
              alt="Lab report preview"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Search & Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            {t('labReportManagement')}
          </CardTitle>
          <CardDescription>
            Upload quality analysis reports for verified batches
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search Batch */}
          <div className="space-y-2">
            <Label>{t('findBatch')}</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter Batch ID (e.g., AYUR-2024-001)"
                value={searchBatchId}
                onChange={(e) => setSearchBatchId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchBatch()}
              />
              <Button variant="distributor" onClick={searchBatch}>
                <Search className="h-4 w-4 mr-2" />
                {t('search')}
              </Button>
            </div>
          </div>

          {/* Found Batch Info */}
          {foundBatch && (
            <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-success">{t('batchFound')}</h4>
                <Badge variant="success">{foundBatch.id}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">{t('herbType')}:</span>
                  <p className="font-medium">{foundBatch.herbType}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">{t('quantity')}:</span>
                  <p className="font-medium">{foundBatch.quantity} {foundBatch.unit}</p>
                </div>
              </div>
            </div>
          )}

          {/* File Upload */}
          {foundBatch && (
            <div className="space-y-4">
              <Label>{t('uploadLabReport')}</Label>
              
              {uploadedFile ? (
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium">{uploadedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setUploadedFile(null)}
                    >
                      Remove
                    </Button>
                    <Button 
                      variant="distributor" 
                      size="sm" 
                      onClick={uploadReport}
                      disabled={uploading}
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          {t('upload')}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div 
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">Click to select lab report</p>
                  <p className="text-xs text-muted-foreground">PDF, JPG, PNG up to 10MB</p>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Existing Reports */}
      <Card>
        <CardHeader>
          <CardTitle>{t('uploadedLabReports')}</CardTitle>
          <CardDescription>
            All lab reports uploaded for batch verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          {labReports.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{t('noLabReportsUploaded')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {labReports.map((report) => {
                const batch = mockBatches.find(b => b.id === report.batchId);
                return (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{report.fileName}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{t('batch')}: {report.batchId}</span>
                          <span>•</span>
                          <span>{batch?.herbType}</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(report.uploadDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="success">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {t('uploaded')}
                      </Badge>
                      <PreviewDialog report={report} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LabReportUpload;
