"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileDown, CalendarDays, CheckCircle, XCircle } from "lucide-react";
import { PaginationControls } from "@/components/pagination-controls";
import { PageTitle } from "@/components/page-title";

const ITEMS_PER_PAGE = 10;

type Rental = {
  id: number;
  user_id: number;
  wheelchair: {
    name: string;
    description: string;
  };
  rent_start_date: string;
  rent_end_date: string;
  total_amount: string;
  order_status: string;
};

export default function RentalTable() {
  const [rentals, setRentals] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const baseUrl=process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetch(`${baseUrl}/admin/rent/allOrders`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRentals(data.data); // 🔄 no longer data.data.orders
        }
      })
      .catch((err) => {
        console.error("Failed to fetch rentals", err);
      });
  }, []);

  const filteredRentals = useMemo(() => {
    return rentals.filter((rental) =>
      rental.id.toString().includes(searchTerm.toLowerCase()) ||
      rental?.wheelchair?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [rentals, searchTerm]);

  const paginatedRentals = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRentals.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredRentals, currentPage]);

  const totalPages = Math.ceil(filteredRentals.length / ITEMS_PER_PAGE);

  const getStatusBadge = (status: string) => {
    if (status === "Ongoing") {
      return <Badge className="bg-blue-500 text-white"><CalendarDays className="mr-1 h-3 w-3" />Ongoing</Badge>;
    } else if (status === "Completed") {
      return <Badge className="bg-green-500 text-white"><CheckCircle className="mr-1 h-3 w-3" />Completed</Badge>;
    } else if (status === "Cancelled") {
      return <Badge className="bg-red-500 text-white"><XCircle className="mr-1 h-3 w-3" />Cancelled</Badge>;
    } else {
      return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleExport = () => {
    if (rentals.length === 0) return;

    const headers = ["ID", "Wheelchair", "Start Date", "End Date", "Total Amount", "Status"];
    const rows = rentals.map((r) => [
      r.id,
      r?.wheelchair?.name ?? "-",
      r.rent_start_date,
      r.rent_end_date,
      r.total_amount,
      r.order_status,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rentals.csv";
    a.click();
    window.URL.revokeObjectURL(url);
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
          placeholder="Search rentals by ID or wheelchair..."
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
                <TableCell>{rental.id}</TableCell>
                <TableCell>{rental?.wheelchair?.name || "-"}</TableCell>
                <TableCell>{new Date(rental.rent_start_date).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(rental.rent_end_date).toLocaleDateString()}</TableCell>
                <TableCell>₹{parseFloat(rental.total_amount).toFixed(2)}</TableCell>
                <TableCell>{getStatusBadge(rental.order_status)}</TableCell>
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
