
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileDown,
  CalendarDays,
  CheckCircle,
  XCircle,
  Receipt,
  Calendar as CalendarIcon,
  Filter,
  X,
} from "lucide-react";
import { PaginationControls } from "@/components/pagination-controls";
import { PageTitle } from "@/components/page-title";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";


const ITEMS_PER_PAGE = 10;

type Transaction = {
  id: number;
  transaction_id: string;
  payment_gateway: string;
  transaction_status: string;
  amount?: string;
  currency?: string;
};

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
  rent_transactions?: Transaction[];
};

export default function RentalTable() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialogRentalId, setOpenDialogRentalId] = useState<number | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  
  // State for date filtering
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [appliedFilters, setAppliedFilters] = useState<{startDate?: Date, endDate?: Date}>({});

useEffect(() => {
  if (!baseUrl) return;

  const fetchRentals = async () => {
    try {
      const url = new URL(`${baseUrl}/admin/rent/allOrders`);

      if (appliedFilters.startDate) {
        url.searchParams.append(
          "startDate",
          appliedFilters.startDate.toISOString().split("T")[0]
        );
      }

      if (appliedFilters.endDate) {
        url.searchParams.append(
          "endDate",
          appliedFilters.endDate.toISOString().split("T")[0]
        );
      }

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const data = await res.json();
      if (data.success) {
        setRentals(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch rentals", err);
    }
  };

  fetchRentals();
}, [baseUrl, appliedFilters]);

  const filteredRentals = useMemo(() => {
    let filtered = rentals;

    // Text search filter
    if (searchTerm) {
        filtered = filtered.filter((rental) =>
            rental.id.toString().includes(searchTerm.toLowerCase()) ||
            rental?.wheelchair?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    // Date range filter
    if (appliedFilters.startDate) {
        filtered = filtered.filter(rental => new Date(rental.rent_start_date) >= appliedFilters.startDate!);
    }
    if (appliedFilters.endDate) {
        // Include the end date in the range
        const adjustedEndDate = new Date(appliedFilters.endDate);
        adjustedEndDate.setHours(23, 59, 59, 999);
        filtered = filtered.filter(rental => new Date(rental.rent_start_date) <= adjustedEndDate);
    }

    return filtered;
  }, [rentals, searchTerm, appliedFilters]);

  const paginatedRentals = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRentals.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredRentals, currentPage]);

  const totalPages = Math.ceil(filteredRentals.length / ITEMS_PER_PAGE);
  
  const handleFilter = () => {
    setCurrentPage(1);
    setAppliedFilters({ startDate, endDate });
  }

  const handleClearFilter = () => {
      setStartDate(undefined);
      setEndDate(undefined);
      setAppliedFilters({});
      setCurrentPage(1);
  }

  const getStatusBadge = (status: string) => {
    if (status === "Ongoing") {
      return <Badge className="bg-blue-500 text-white hover:bg-blue-600"><CalendarDays className="mr-1 h-3 w-3" />Ongoing</Badge>;
    } else if (status === "Completed") {
      return <Badge className="bg-green-500 text-white hover:bg-green-600"><CheckCircle className="mr-1 h-3 w-3" />Completed</Badge>;
    } else if (status === "Cancelled") {
      return <Badge className="bg-red-500 text-white hover:bg-red-600"><XCircle className="mr-1 h-3 w-3" />Cancelled</Badge>;
    } else {
      return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleExport = () => {
    if (filteredRentals.length === 0) return;

    const headers = ["ID", "Wheelchair", "Start Date", "End Date", "Total Amount", "Status"];
    const rows = filteredRentals.map((r) => [
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
  
  const formatDate = (dateString: string) => {
    if(!dateString) return "";
    const [year, month, day] = dateString.split("T")[0].split("-");
    return `${day}-${month}-${year}`;
  };

  return (
    <>
      <PageTitle title="Rental Management">
        <Button onClick={handleExport} variant="outline">
          <FileDown className="mr-2 h-4 w-4" />
          Export to Excel
        </Button>
      </PageTitle>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <Input
          placeholder="Search rentals by ID or wheelchair..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="max-w-sm"
        />
        <Popover>
            <PopoverTrigger asChild>
                <Button
                variant={"outline"}
                className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                )}
                >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : <span>Pick a start date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
            </PopoverContent>
        </Popover>
         <Popover>
            <PopoverTrigger asChild>
                <Button
                variant={"outline"}
                className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                )}
                >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : <span>Pick an end date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
            </PopoverContent>
        </Popover>
        <Button onClick={handleFilter}><Filter className="mr-2 h-4 w-4"/>Filter</Button>
        <Button onClick={handleClearFilter} variant="outline"><X className="mr-2 h-4 w-4"/>Clear</Button>
      </div>

      <div className="rounded-md border shadow-sm bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rental ID</TableHead>
              <TableHead>Wheelchair</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Total Amount(INR)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Transaction</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRentals.map((rental) => (
              <TableRow key={rental.id}>
                <TableCell>{rental.id}</TableCell>
                <TableCell>{rental?.wheelchair?.name || "-"}</TableCell>
                <TableCell>{formatDate(rental.rent_start_date)}</TableCell>
                <TableCell>{formatDate(rental.rent_end_date)}</TableCell>
                <TableCell>{parseFloat(rental.total_amount).toFixed(2)}</TableCell>
                <TableCell>{getStatusBadge(rental.order_status)}</TableCell>
                <TableCell>
                  <Dialog
                    open={openDialogRentalId === rental.id}
                    onOpenChange={(isOpen) => {
                      if (!isOpen) setOpenDialogRentalId(null);
                      else setOpenDialogRentalId(rental.id);
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Receipt className="h-4 w-4 text-blue-600" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent aria-describedby="transaction-description" className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Transaction Details</DialogTitle>
                        <p id="transaction-description" className="text-sm text-muted-foreground">
                          Payment information for rental #{rental.id}
                        </p>
                      </DialogHeader>

                      <div className="max-h-60 overflow-y-auto space-y-4 pr-2">
                        {rental.rent_transactions && rental.rent_transactions.length > 0 ? (
                          [...new Map(rental.rent_transactions.map(txn => [txn.transaction_id, txn])).values()]
                            .map((txn) => (
                              <div key={txn.transaction_id} className="text-sm border rounded-md p-3">
                                <div><strong>Transaction ID:</strong> {txn.transaction_id}</div>
                                <div><strong>Gateway:</strong> {txn.payment_gateway}</div>
                                <div><strong>Status:</strong> {txn.transaction_status}</div>
                                {txn.amount && <div><strong>Amount:</strong> {txn.amount}</div>}
                                {txn.currency && <div><strong>Currency:</strong> {txn.currency}</div>}
                              </div>
                            ))
                        ) : (
                          <div className="text-muted-foreground text-sm">No transactions found for this order.</div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
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

      {paginatedRentals.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">No rentals found.</div>
      )}
    </>
  );
}
