"use client";

import React, { useState, useMemo } from 'react';
import type { Rental } from '@/types';
import { mockRentals } from '@/lib/mock-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileDown, CalendarDays, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { PaginationControls } from '@/components/pagination-controls';
import { PageTitle } from '@/components/page-title';

const ITEMS_PER_PAGE = 10;

export default function RentalTable() {
  const [rentals, setRentals] = useState<Rental[]>(mockRentals);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRentals = useMemo(() => {
    return rentals.filter(rental =>
      rental.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.wheelchairName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [rentals, searchTerm]);

  const paginatedRentals = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRentals.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredRentals, currentPage]);

  const totalPages = Math.ceil(filteredRentals.length / ITEMS_PER_PAGE);

  const handleExport = () => {
    console.log("Exporting rental data to Excel...");
    // Actual export logic here
  };

  const getStatusBadge = (status: Rental['status']) => {
    switch (status) {
      case 'Ongoing': return <Badge variant="secondary" className="bg-blue-500 hover:bg-blue-600 text-white"><CalendarDays className="mr-1 h-3 w-3" />Ongoing</Badge>;
      case 'Completed': return <Badge variant="default" className="bg-green-500 hover:bg-green-600"><CheckCircle className="mr-1 h-3 w-3" />Completed</Badge>;
      case 'Cancelled': return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Cancelled</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <>
      <PageTitle title="Rental Management">
        <Button onClick={handleExport} variant="outline">
          <FileDown className="mr-2 h-4 w-4" />
          Export to Excel
        </Button>
      </PageTitle>
      <div className="mb-4">
        <Input
          placeholder="Search rentals (user, wheelchair, ID)..."
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
              <TableHead>Rental ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Wheelchair</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRentals.map((rental) => (
              <TableRow key={rental.id}>
                <TableCell className="font-medium">{rental.id}</TableCell>
                <TableCell className="text-muted-foreground">{rental.userName}</TableCell>
                <TableCell className="text-muted-foreground">{rental.wheelchairName}</TableCell>
                <TableCell className="text-muted-foreground">{new Date(rental.startDate).toLocaleDateString()}</TableCell>
                <TableCell className="text-muted-foreground">{new Date(rental.endDate).toLocaleDateString()}</TableCell>
                <TableCell className="text-muted-foreground">${rental.totalAmount.toFixed(2)}</TableCell>
                <TableCell>{getStatusBadge(rental.status)}</TableCell>
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
      {paginatedRentals.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">No rentals found.</div>
      )}
    </>
  );
}
