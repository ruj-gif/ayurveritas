import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockTransactions } from '@/data/mockData';
import { 
  Hash, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BlockchainLoggerProps {
  batchId?: string;
  showAll?: boolean;
}

const BlockchainLogger: React.FC<BlockchainLoggerProps> = ({ batchId, showAll = false }) => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState(mockTransactions);

  // Filter transactions by batch ID if provided
  const filteredTransactions = showAll 
    ? transactions 
    : transactions.filter(tx => tx.batchId === batchId);

  const addTransaction = (action: string, from: string, to: string, batchId: string) => {
    const newTransaction = {
      id: `TX-${Date.now()}`,
      batchId,
      from,
      to,
      action,
      timestamp: new Date().toISOString(),
      blockchainHash: `0x${Math.random().toString(16).substr(2, 32)}`
    };

    setTransactions(prev => [newTransaction, ...prev]);
    
    toast({
      title: "Blockchain Transaction Recorded",
      description: `${action} has been immutably recorded on the blockchain.`,
      variant: "default"
    });

    return newTransaction;
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    toast({
      title: "Hash Copied",
      description: "Blockchain hash copied to clipboard",
      variant: "default"
    });
  };

  const openBlockExplorer = (hash: string) => {
    // In a real app, this would open the actual blockchain explorer
    window.open(`https://etherscan.io/tx/${hash}`, '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hash className="h-5 w-5 text-primary" />
          Blockchain Transaction Log
        </CardTitle>
        <CardDescription>
          Immutable record of all batch activities on the blockchain
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Hash className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No blockchain transactions found</p>
              {batchId && (
                <p className="text-sm">Transactions for batch {batchId} will appear here</p>
              )}
            </div>
          ) : (
            filteredTransactions.map((transaction, index) => (
              <div key={transaction.id} className="relative">
                {index < filteredTransactions.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-16 bg-border"></div>
                )}
                
                <div className="flex items-start gap-4 p-4 border rounded-lg bg-card">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{transaction.action}</h4>
                      <Badge variant="success" className="text-xs">
                        Confirmed
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">From:</span>
                        <span>{transaction.from}</span>
                        <ArrowRight className="h-3 w-3" />
                        <span>{transaction.to}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(transaction.timestamp).toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Batch:</span>
                        <Badge variant="outline" className="text-xs">
                          {transaction.batchId}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Hash className="h-3 w-3" />
                        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                          {transaction.blockchainHash.substring(0, 16)}...
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => copyHash(transaction.blockchainHash)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => openBlockExplorer(transaction.blockchainHash)}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {showAll && transactions.length > 10 && (
          <Button variant="outline" className="w-full mt-4">
            Load More Transactions
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

// Hook to add blockchain transactions
export const useBlockchainLogger = () => {
  const { toast } = useToast();
  
  const logTransaction = (action: string, from: string, to: string, batchId: string) => {
    // In a real app, this would make an API call to record on actual blockchain
    const mockHash = `0x${Math.random().toString(16).substr(2, 32)}`;
    
    toast({
      title: "Blockchain Transaction",
      description: `${action} recorded on blockchain`,
      variant: "default"
    });
    
    return {
      hash: mockHash,
      timestamp: new Date().toISOString(),
      confirmed: true
    };
  };
  
  return { logTransaction };
};

export default BlockchainLogger;