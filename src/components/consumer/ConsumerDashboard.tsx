import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  QrCode, 
  Search, 
  Shield, 
  Star,
  TrendingUp,
  Eye,
  MapPin,
  Calendar,
  Award,
  Package,
  Leaf,
  ShoppingCart
} from 'lucide-react';
import { mockBatches } from '@/data/mockData';

const ConsumerDashboard: React.FC = () => {
  const verifiedBatches = mockBatches.filter(b => b.status === 'verified');
  
  const stats = {
    scannedProducts: 15,
    trustedFarmers: 8,
    verifiedBatches: verifiedBatches.length,
    totalValue: verifiedBatches.reduce((sum, b) => sum + (b.price || 0), 0)
  };

  const featuredProducts = verifiedBatches.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary-glow rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Transparency at Your Fingertips 🔍</h2>
            <p className="text-white/80">
              Discover the complete journey of your herbal products from farm to shelf.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/80">Products Traced</p>
            <p className="text-3xl font-bold">{stats.scannedProducts}</p>
          </div>
        </div>
      </div>

      {/* Trust Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scanned Products</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.scannedProducts}</div>
            <p className="text-xs text-muted-foreground">
              Products verified by you
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trusted Farmers</CardTitle>
            <Leaf className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.trustedFarmers}</div>
            <p className="text-xs text-muted-foreground">
              Verified suppliers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Authentic Products</CardTitle>
            <Shield className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.verifiedBatches}</div>
            <p className="text-xs text-muted-foreground">
              100% verified batches
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Value Traced</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(stats.totalValue / 1000).toFixed(1)}K</div>
            <p className="text-xs text-muted-foreground">
              Product value verified
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Verify authenticity and explore products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="farmer" 
              size="lg" 
              className="h-16"
              onClick={() => window.location.href = '/qr-scanner'}
            >
              <QrCode className="h-5 w-5 mr-2" />
              Scan QR Code
            </Button>
            <Button variant="distributor" size="lg" className="h-16">
              <Search className="h-5 w-5 mr-2" />
              Search Products
            </Button>
            <Button variant="consumer" size="lg" className="h-16">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Browse Marketplace
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Featured Authentic Products */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-accent" />
                Featured Authentic Products
              </CardTitle>
              <CardDescription>Premium verified herbal products</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredProducts.map((batch) => (
              <Card key={batch.id} className="overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-success/10 to-primary/10 flex items-center justify-center">
                  <Package className="h-12 w-12 text-muted-foreground" />
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">{batch.herbType}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="verified" className="text-xs">Verified</Badge>
                      <Badge variant="success" className="text-xs">Organic</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex items-center gap-1">
                        <Leaf className="h-3 w-3" />
                        Farmer: {batch.farmerName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Harvested: {new Date(batch.harvestDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {batch.location.address.split(',')[0]}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-bold text-primary">₹{batch.price?.toLocaleString()}</span>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        Trace
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trust Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Your Trust Network
          </CardTitle>
          <CardDescription>Building confidence through transparency</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                <Leaf className="h-8 w-8 text-success" />
              </div>
              <h4 className="font-medium">Verified Farmers</h4>
              <p className="text-sm text-muted-foreground">
                All farmers in your network are verified and certified for organic practices.
              </p>
              <p className="text-2xl font-bold text-success">{stats.trustedFarmers}</p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-medium">Quality Assured</h4>
              <p className="text-sm text-muted-foreground">
                Every product goes through rigorous quality checks before reaching you.
              </p>
              <p className="text-2xl font-bold text-primary">100%</p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                <Star className="h-8 w-8 text-accent" />
              </div>
              <h4 className="font-medium">Fair Trade</h4>
              <p className="text-sm text-muted-foreground">
                Supporting fair wages and sustainable farming practices worldwide.
              </p>
              <p className="text-2xl font-bold text-accent">4.9★</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest product verifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: 'Scanned', product: 'Organic Turmeric', time: '2 hours ago', status: 'verified' },
              { action: 'Reviewed', product: 'Ashwagandha Powder', time: '1 day ago', status: 'verified' },
              { action: 'Traced', product: 'Holy Basil Extract', time: '3 days ago', status: 'verified' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <QrCode className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{activity.action} {activity.product}</p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
                <Badge variant="verified">Authentic</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsumerDashboard;