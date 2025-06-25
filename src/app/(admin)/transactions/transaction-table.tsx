
"use client";

import React, { useState, useMemo, useEffect } from 'react';
// import type { Transaction } from '@/types';
import axios from 'axios';
import { mockTransactions } from '@/lib/mock-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileDown, CheckCircle, XCircle, Clock, ShieldAlert, ShieldCheck, AlertTriangle } from "lucide-react";
import AnomalyDetectionModal from './anomaly-detection-modal';
import { PaginationControls } from '@/components/pagination-controls';
import { PageTitle } from '@/components/page-title';
import type { TransactionAnomalyOutput } from '@/ai/flows/transaction-anomaly-detection';

const ITEMS_PER_PAGE = 10;

interface Transaction {
  id:number,
  transaction_id: string;
  amount: string;
  payment_gateway: string;
  transaction_status: string;
}

export default function TransactionTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);


  useEffect(() => {
    fetchTransactions();
  },[]);

   const fetchTransactions = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/api/getTransaction`);
        console.log('res::: ', res);
        setTransactions(res.data.data);
      } catch (err) {
        console.error("Axios failed to fetch users:", err);
      }
    };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx =>
      tx.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.payment_gateway.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.transaction_status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [transactions, searchTerm]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTransactions, currentPage]);

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);

  const handleExport = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/api/getTransaction`);
      const data = res.data.data;
  
      const formatted = data.map((transaction: any) => ({
        // ID: String(transaction._id),
        Id: transaction.transaction_id,
        Amount: transaction.amount,
        Getway: transaction.payment_gateway,
        Status:transaction.transaction_status
      }));
  
      // Convert to CSV
      const headers = Object.keys(formatted[0]).join(',') + '\n';
      const rows = formatted.map((obj: Record<string, any>) => Object.values(obj).join(',')).join('\n');
      const csvContent = headers + rows;
  
      // Trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transaction.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      console.log("Transaction data exported as CSV.");
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  const handleOpenModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleAnomalyReport = (transactionId: string, report: TransactionAnomalyOutput) => {
    setTransactions(prev => 
      prev.map(tx => tx.id === transactionId ? { ...tx, anomalyReport: report } : tx)
    );
  };

  const getStatusBadge = (status: Transaction['transaction_status']) => {
    switch (status) {
      case 'Success': return <Badge variant="default" className="bg-green-500 hover:bg-green-600"><CheckCircle className="mr-1 h-3 w-3" />Success</Badge>;
      case 'Pending': return <Badge variant="secondary" className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900"><Clock className="mr-1 h-3 w-3" />Pending</Badge>;
      case 'Failed': return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Failed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // const getAnomalyBadge = (report?: Transaction['anomalyReport']) => {
  //   if (!report) return null;
  //   if (report.isAnomalous) {
  //     return <Badge variant="destructive" className="ml-2"><AlertTriangle className="mr-1 h-3 w-3" />Anomaly ({report.riskScore})</Badge>;
  //   }
  //   return <Badge variant="default" className="bg-green-500 hover:bg-green-600 ml-2"><ShieldCheck className="mr-1 h-3 w-3" />Normal ({report.riskScore})</Badge>;
  // }

  return (
    <>
      <PageTitle title="Transaction Management">
        <Button onClick={handleExport} variant="outline">
          <FileDown className="mr-2 h-4 w-4" />
          Export to Excel
        </Button>
      </PageTitle>
      <div className="mb-4">
        <Input
          placeholder="Search transactions (ID, user, method)..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border shadow-sm bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              {/* <TableHead>User</TableHead> */}
              <TableHead>Amount</TableHead>
              {/* <TableHead>Date</TableHead> */}
              <TableHead>Payment Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.transaction_id}</TableCell>
                {/* <TableCell className="text-muted-foreground">{transaction.userName}</TableCell> */}
                <TableCell className="text-muted-foreground">${parseFloat(transaction.amount).toFixed(2)}</TableCell>
                {/* <TableCell className="text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</TableCell> */}
                <TableCell className="text-muted-foreground">{transaction.payment_gateway}</TableCell>
                <TableCell>
                  {getStatusBadge(transaction.transaction_status)}
                  {/* {getAnomalyBadge(transaction.anomalyReport)} */}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleOpenModal(transaction)}>
                    <ShieldAlert className="mr-1 h-4 w-4" /> Analyze
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
         <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            canPreviousPage={currentPage > 1}
            canNextPage={currentPage < totalPages}
        />
      )}
      {paginatedTransactions.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">No transactions found.</div>
      )}

      <AnomalyDetectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transaction={selectedTransaction}
        onAnomalyReport={handleAnomalyReport}
      />
    </>
  );
}

