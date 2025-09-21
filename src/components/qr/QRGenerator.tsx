import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Share2, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QRGeneratorProps {
  batchId: string;
  data?: any;
  size?: number;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({ batchId, data, size = 256 }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const generateQR = async () => {
      try {
        const qrData = JSON.stringify({
          batchId,
          verificationUrl: `https://ayur-veritas.com/verify/${batchId}`,
          ...data
        });
        
        const url = await QRCode.toDataURL(qrData, {
          width: size,
          margin: 2,
          color: {
            dark: '#1a4d3a', // Primary color
            light: '#ffffff'
          }
        });
        
        setQrDataUrl(url);
      } catch (error) {
        console.error('QR Code generation failed:', error);
        toast({
          title: "QR Generation Failed",
          description: "Unable to generate QR code. Please try again.",
          variant: "destructive"
        });
      }
    };

    if (batchId) {
      generateQR();
    }
  }, [batchId, data, size, toast]);

  const downloadQR = () => {
    if (qrDataUrl) {
      const link = document.createElement('a');
      link.download = `${batchId}-qr-code.png`;
      link.href = qrDataUrl;
      link.click();
      
      toast({
        title: "QR Code Downloaded",
        description: "QR code saved to your device.",
        variant: "default"
      });
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`https://ayur-veritas.com/verify/${batchId}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: "Link Copied",
        description: "Verification link copied to clipboard.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy link. Please try again.",
        variant: "destructive"
      });
    }
  };

  const shareQR = async () => {
    if (navigator.share && qrDataUrl) {
      try {
        // Convert data URL to blob for sharing
        const response = await fetch(qrDataUrl);
        const blob = await response.blob();
        const file = new File([blob], `${batchId}-qr.png`, { type: 'image/png' });
        
        await navigator.share({
          title: 'Ayur-Veritas Batch QR Code',
          text: `Verify this herbal batch: ${batchId}`,
          files: [file]
        });
      } catch (error) {
        console.error('Sharing failed:', error);
        // Fallback to copying link
        copyToClipboard();
      }
    } else {
      // Fallback for browsers that don't support sharing
      copyToClipboard();
    }
  };

  if (!qrDataUrl) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Generating QR Code...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Batch QR Code</CardTitle>
        <p className="text-sm text-muted-foreground text-center">
          Scan to verify authenticity and trace the complete journey
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <div className="p-4 bg-white rounded-lg shadow-sm border">
            <img 
              src={qrDataUrl} 
              alt={`QR Code for batch ${batchId}`}
              className="w-full h-auto"
            />
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-sm font-medium">Batch ID: {batchId}</p>
          <p className="text-xs text-muted-foreground">
            https://ayur-veritas.com/verify/{batchId}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" size="sm" onClick={downloadQR}>
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
          
          <Button variant="outline" size="sm" onClick={shareQR}>
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
          
          <Button variant="outline" size="sm" onClick={copyToClipboard}>
            {copied ? (
              <Check className="h-4 w-4 mr-1" />
            ) : (
              <Copy className="h-4 w-4 mr-1" />
            )}
            {copied ? 'Copied' : 'Copy Link'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRGenerator;