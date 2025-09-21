import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockBatches } from '@/data/mockData';
import { 
  Package, 
  Search, 
  Filter, 
  Eye, 
  QrCode, 
  MapPin, 
  Calendar, 
  CheckCircle, 
  Clock, 
  X,
  Download,
  ExternalLink
} from 'lucide-react';

const MyBatches: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBatch, setSelectedBatch] = useState<any>(null);

  // Filter batches based on search and status
  const filteredBatches = mockBatches.filter(batch => {
    const matchesSearch = batch.herbType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || batch.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'rejected': return <X className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewDetails = (batch: any) => {
    setSelectedBatch(batch);
    toast({
      title: 'Batch Details',
      description: `Viewing details for ${batch.id}`,
      variant: "default"
    });
  };

  const handleDownloadQR = (batchId: string) => {
    toast({
      title: 'QR Code Downloaded',
      description: `QR code for batch ${batchId} has been downloaded`,
      variant: "default"
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6" />
            My Batches
          </h1>
          <p className="text-muted-foreground">
            Track and manage your registered harvest batches
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredBatches.length} batch{filteredBatches.length !== 1 ? 'es' : ''} found
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by herb type or batch ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Batches List */}
      <div className="grid gap-4">
        {filteredBatches.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No batches found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Register your first harvest to get started'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button>
                  Register New Harvest
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredBatches.map((batch) => (
            <Card key={batch.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Batch Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{batch.id}</h3>
                        <p className="text-muted-foreground">{batch.herbType}</p>
                      </div>
                      <Badge variant={getStatusColor(batch.status)} className="flex items-center gap-1">
                        {getStatusIcon(batch.status)}
                        {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Quantity</p>
                        <p className="font-medium">{batch.quantity} {batch.unit}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Harvest Date</p>
                        <p className="font-medium">{formatDate(batch.harvestDate)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Price</p>
                        <p className="font-medium">₹{batch.price}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Payment</p>
                        <Badge variant={batch.paymentStatus === 'paid' ? 'success' : 'warning'}>
                          {batch.paymentStatus}
                        </Badge>
                      </div>
                    </div>

                    {batch.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{batch.location.address}</span>
                      </div>
                    )}

                    {batch.verifiedBy && (
                      <div className="text-sm text-muted-foreground">
                        <p>Verified by: <span className="font-medium">{batch.verifiedBy}</span></p>
                        <p>On: <span className="font-medium">{formatDate(batch.verificationDate!)}</span></p>
                      </div>
                    )}

                    {batch.rejectionReason && (
                      <div className="p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                        <p className="text-sm text-destructive font-medium">Rejection Reason:</p>
                        <p className="text-sm text-destructive">{batch.rejectionReason}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(batch)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadQR(batch.id)}
                      className="flex items-center gap-2"
                    >
                      <QrCode className="h-4 w-4" />
                      QR Code
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Batch Details Modal */}
      {selectedBatch && (
        <Card className="fixed inset-4 z-50 max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Batch Details - {selectedBatch.id}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedBatch(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Herb Type</p>
                <p className="font-medium">{selectedBatch.herbType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Quantity</p>
                <p className="font-medium">{selectedBatch.quantity} {selectedBatch.unit}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Harvest Date</p>
                <p className="font-medium">{formatDate(selectedBatch.harvestDate)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={getStatusColor(selectedBatch.status)}>
                  {selectedBatch.status}
                </Badge>
              </div>
            </div>
            
            {selectedBatch.location && (
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{selectedBatch.location.address}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedBatch.location.lat.toFixed(6)}, {selectedBatch.location.lng.toFixed(6)}
                </p>
              </div>
            )}

            {selectedBatch.blockchainHash && (
              <div>
                <p className="text-sm text-muted-foreground">Blockchain Hash</p>
                <p className="font-mono text-xs break-all">{selectedBatch.blockchainHash}</p>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => handleDownloadQR(selectedBatch.id)}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download QR
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedBatch(null)}
              >
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyBatches;