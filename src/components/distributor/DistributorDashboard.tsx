import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import LanguageSelector from '@/components/ui/language-selector';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Scan,
  FileText,
  TrendingUp,
  Eye,
  MapPin,
  Calendar,
  User,
  Edit,
  ArrowRight
} from 'lucide-react';
import { mockBatches } from '@/data/mockData';
import { useLanguage } from '@/contexts/LanguageContext';

const DistributorDashboard: React.FC = () => {
  const { t } = useLanguage();
  const stats = {
    pendingVerification: mockBatches.filter(b => b.status === 'pending').length,
    verified: mockBatches.filter(b => b.status === 'verified').length,
    rejected: mockBatches.filter(b => b.status === 'rejected').length,
    totalProcessed: mockBatches.length
  };

  const pendingBatches = mockBatches.filter(b => b.status === 'pending').slice(0, 3);
  const recentlyVerified = mockBatches.filter(b => b.status === 'verified').slice(0, 3);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with Language Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">{t('distributorWelcome')}</h1>
          <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">{t('distributorSubtitle')}</p>
        </div>
        <LanguageSelector />
      </div>

      {/* Welcome Section */}
      <div className="gradient-nature rounded-lg p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-1 sm:mb-2">{t('distributorWelcome')}</h2>
            <p className="text-white/80 text-sm sm:text-base">
              {t('distributorSubtitle')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs sm:text-sm text-white/80">{t('verificationRate')}</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold">
              {Math.round((stats.verified / stats.totalProcessed) * 100)}%
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">{t('pendingReview')}</CardTitle>
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-warning">{stats.pendingVerification}</div>
            <p className="text-xs text-muted-foreground">
              {t('awaitingYourVerification')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">{t('verified')}</CardTitle>
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-success">{stats.verified}</div>
            <p className="text-xs text-muted-foreground">
              {t('qualityApproved')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">{t('rejected')}</CardTitle>
            <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-destructive">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">
              {t('qualityIssuesFound')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">{t('totalProcessed')}</CardTitle>
            <Package className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{stats.totalProcessed}</div>
            <p className="text-xs text-muted-foreground">
              {t('allTimeBatches')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">{t('quickActions')}</CardTitle>
          <CardDescription className="text-sm">
            {t('streamlineVerificationProcess')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <Link to="/scan-update">
              <Button variant="distributor" size="lg" className="h-12 sm:h-16 w-full">
                <Scan className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                <span className="text-sm sm:text-base">{t('scanAndUpdate')}</span>
              </Button>
            </Link>
            <Link to="/lab-reports">
              <Button variant="farmer" size="lg" className="h-12 sm:h-16 w-full">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                <span className="text-sm sm:text-base">{t('uploadLabReport')}</span>
              </Button>
            </Link>
            <Button variant="consumer" size="lg" className="h-12 sm:h-16 sm:col-span-2 lg:col-span-1">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              <span className="text-sm sm:text-base">{t('viewAnalytics')}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pending Verifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-warning" />
                {t('pendingVerifications')}
              </CardTitle>
              <CardDescription>{t('batchesAwaitingQualityReview')}</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              {t('viewAll')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingBatches.map((batch) => (
              <div key={batch.id} className="flex items-center justify-between p-4 border rounded-lg bg-warning/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-warning" />
                  </div>
                  <div>
                    <h4 className="font-medium">{batch.herbType}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {batch.farmerName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(batch.harvestDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {batch.quantity} {batch.unit}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="pending">{t('pendingReview')}</Badge>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    {t('review')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recently Verified */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                {t('recentlyVerified')}
              </CardTitle>
              <CardDescription>{t('yourLatestQualityApprovals')}</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              {t('viewHistory')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentlyVerified.map((batch) => (
              <div key={batch.id} className="flex items-center justify-between p-4 border rounded-lg bg-success/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <h4 className="font-medium">{batch.herbType}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {batch.farmerName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {batch.verificationDate ? new Date(batch.verificationDate).toLocaleDateString() : 'N/A'}
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {batch.labReport ? 'Lab Report Available' : 'No Report'}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="verified">{t('verified')}</Badge>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    {t('view')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quality Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('qualityStandards')}</CardTitle>
            <CardDescription>{t('yourVerificationPerformance')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('accuracyScore')}</span>
                <span className="text-sm font-bold text-success">98.5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('farmerSatisfaction')}</span>
                <span className="text-sm font-bold text-success">4.9/5</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('verificationImpact')}</CardTitle>
            <CardDescription>{t('yourContributionToSupplyChain')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{stats.verified}</p>
                <p className="text-sm text-muted-foreground">{t('batchesVerified')}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-accent">₹2.4L</p>
                <p className="text-sm text-muted-foreground">{t('valueSecured')}</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-success">5</p>
                <p className="text-sm text-muted-foreground">{t('farmersSupported')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DistributorDashboard;