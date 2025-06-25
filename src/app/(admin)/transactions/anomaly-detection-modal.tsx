"use client";

import React, { useState } from 'react';
// import type { Transaction } from '@/types';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertTriangle, CheckCircle, ShieldAlert } from "lucide-react";
import { detectTransactionAnomaly, type TransactionAnomalyInput, type TransactionAnomalyOutput } from '@/ai/flows/transaction-anomaly-detection';
import { useToast } from "@/hooks/use-toast";

interface AnomalyDetectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onAnomalyReport?: (transactionId: string, report: TransactionAnomalyOutput) => void;
};

interface Transaction {
  id:number,
  transaction_id: string;
  amount: string;
  payment_gateway: string;
  transaction_status: string;
}

export default function AnomalyDetectionModal({ isOpen, onClose, transaction, onAnomalyReport }: AnomalyDetectionModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<TransactionAnomalyOutput | null>(null);
  const { toast } = useToast();

  const handleDetectAnomaly = async () => {
    if (!transaction) return;

    setIsLoading(true);
    setAnalysisResult(null);

    const input: TransactionAnomalyInput = {
      transactionData: transaction.transactionData,
      transactionVolume: transaction.transactionVolume,
      userLocation: transaction.userLocation,
      historicalTransactionData: transaction.historicalTransactionData,
    };

    try {
      const result = await detectTransactionAnomaly(input);
      setAnalysisResult(result);
      if (onAnomalyReport && result) {
        onAnomalyReport(transaction.transaction_id, result);
      }
    } catch (error) {
      console.error("Error detecting anomaly:", error);
      toast({
        variant: "destructive",
        title: "Anomaly Detection Failed",
        description: "Could not analyze the transaction. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setAnalysisResult(null); // Reset result when closing
    onClose();
  }

  if (!isOpen || !transaction) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-primary flex items-center">
            <ShieldAlert className="mr-2 h-5 w-5" />
            Transaction Anomaly Detection
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <h4 className="font-semibold text-sm mb-1">Transaction Details:</h4>
            <p className="text-xs text-muted-foreground">ID: {transaction.transaction_id}</p>
            <p className="text-xs text-muted-foreground">Payment Gateway: {transaction.payment_gateway}</p>
            {/* <p className="text-xs text-muted-foreground">User: {transaction.userName}</p> */}
            <p className="text-xs text-muted-foreground">Amount: ${parseFloat(transaction.amount).toFixed(2)}</p>
            {/* <p className="text-xs text-muted-foreground">Date: {new Date(transaction.date).toLocaleString()}</p> */}
          </div>

          {!analysisResult && (
            <Button onClick={handleDetectAnomaly} disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <AlertTriangle className="mr-2 h-4 w-4" />
              )}
              {isLoading ? 'Analyzing...' : 'Detect Anomaly'}
            </Button>
          )}

          {analysisResult && (
            <Alert variant={analysisResult.isAnomalous ? "destructive" : "default"} className={analysisResult.isAnomalous ? "" : "border-green-500"}>
              {analysisResult.isAnomalous ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4 text-green-600" />}
              <AlertTitle className={analysisResult.isAnomalous ? "" : "text-green-700"}>
                {analysisResult.isAnomalous ? 'Anomaly Detected!' : 'Transaction Appears Normal'}
              </AlertTitle>
              <AlertDescription className="text-xs">
                <p><strong>Risk Score:</strong> {analysisResult.riskScore}/100</p>
                <p><strong>Explanation:</strong> {analysisResult.explanation}</p>
              </AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={handleClose}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
