"use client";

import React, {useEffect, useState, useMemo } from 'react';
//import type { Wheelchair } from '@/types';
import { mockWheelchairs } from '@/lib/mock-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit, Trash2, Eye, PlusCircle, Star } from "lucide-react";
import Image from "next/image";
import WheelchairForm from './wheelchair-form';
import { PaginationControls } from '@/components/pagination-controls';
import { PageTitle } from '@/components/page-title';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const ITEMS_PER_PAGE = 10;
interface Wheelchair {
  id: string;
  name: string;
  category_id: number;
  is_globally_available: boolean;
  average_rating: string;
  total_reviews: number;
  imageUrl?: string;
}

const categoryMap: Record<number, string> = {
  9: "Manual",
  10: "Power",
  11: "Reclining",
};

export default function WheelchairTable() {
  const [wheelchairs, setWheelchairs] = useState<Wheelchair[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch("http://localhost:3000/admin/wheelchair/allWheelchairs")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setWheelchairs(data.data);
        }
      })
      .catch((err) => console.error("Failed to fetch wheelchairs", err));
  }, []);

  const filteredWheelchairs = useMemo(() => {
    return wheelchairs.filter((w) =>
      w.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [wheelchairs, searchTerm]);

  const paginatedWheelchairs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredWheelchairs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredWheelchairs, currentPage]);

  const totalPages = Math.ceil(filteredWheelchairs.length / ITEMS_PER_PAGE);

  const getStatusBadge = (available: boolean) => {
    return available ? (
      <Badge className="bg-green-500 text-white">Available</Badge>
    ) : (
      <Badge className="bg-yellow-500 text-black">Maintenance</Badge>
    );
  };

  return (
    <>
      <PageTitle title="Wheelchairs" />

      <div className="mb-4">
        <Input
          placeholder="Search wheelchairs..."
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
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Rating</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedWheelchairs.map((wheelchair) => (
              <TableRow key={wheelchair.id}>
               
                <TableCell>{wheelchair.name}</TableCell>
                <TableCell>{categoryMap[wheelchair.category_id] || "Unknown"}</TableCell>
                <TableCell>{getStatusBadge(wheelchair.is_globally_available)}</TableCell>
                <TableCell className="text-muted-foreground">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" />
                    {parseFloat(wheelchair.average_rating || "0").toFixed(1)} (
                    {wheelchair.total_reviews})
                  </div>
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

      {paginatedWheelchairs.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          No wheelchairs found.
        </div>
      )}
    </>
  );
}
