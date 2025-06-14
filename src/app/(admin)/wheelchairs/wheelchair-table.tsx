"use client";

import React, { useState, useMemo } from 'react';
import type { Wheelchair } from '@/types';
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

export default function WheelchairTable() {
  const [wheelchairs, setWheelchairs] = useState<Wheelchair[]>(mockWheelchairs);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWheelchair, setEditingWheelchair] = useState<Wheelchair | null>(null);
  const [deletingWheelchairId, setDeletingWheelchairId] = useState<string | null>(null);


  const filteredWheelchairs = useMemo(() => {
    return wheelchairs.filter(w =>
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [wheelchairs, searchTerm]);

  const paginatedWheelchairs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredWheelchairs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredWheelchairs, currentPage]);

  const totalPages = Math.ceil(filteredWheelchairs.length / ITEMS_PER_PAGE);

  const handleAddWheelchair = () => {
    setEditingWheelchair(null);
    setIsFormOpen(true);
  };

  const handleEditWheelchair = (wheelchair: Wheelchair) => {
    setEditingWheelchair(wheelchair);
    setIsFormOpen(true);
  };

  const handleDeleteWheelchair = (id: string) => {
    setDeletingWheelchairId(id);
  };
  
  const confirmDelete = () => {
    if (deletingWheelchairId) {
      setWheelchairs(prev => prev.filter(w => w.id !== deletingWheelchairId));
      setDeletingWheelchairId(null);
    }
  };

  const handleFormSubmit = (wheelchairData: Wheelchair) => {
    if (editingWheelchair) {
      setWheelchairs(prev => prev.map(w => (w.id === wheelchairData.id ? wheelchairData : w)));
    } else {
      setWheelchairs(prev => [...prev, wheelchairData]);
    }
    setIsFormOpen(false);
    setEditingWheelchair(null);
  };
  
  const getStatusBadge = (status: Wheelchair['status']) => {
    switch (status) {
      case 'Available': return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Available</Badge>;
      case 'Rented': return <Badge variant="secondary" className="bg-orange-400 hover:bg-orange-500 text-orange-900">Rented</Badge>;
      case 'Maintenance': return <Badge variant="destructive" className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900">Maintenance</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <>
      <PageTitle title="Wheelchair Management">
        <Button onClick={handleAddWheelchair}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Wheelchair
        </Button>
      </PageTitle>
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
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Daily Rate</TableHead>
              <TableHead>Reviews</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedWheelchairs.map((wheelchair) => (
              <TableRow key={wheelchair.id}>
                <TableCell>
                  <div className="relative h-12 w-16 rounded-md overflow-hidden border">
                    <Image src={wheelchair.imageUrl || "https://placehold.co/100x80.png"} alt={wheelchair.name} layout="fill" objectFit="cover" data-ai-hint={wheelchair.dataAiHint || "wheelchair product"}/>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{wheelchair.name}</TableCell>
                <TableCell className="text-muted-foreground">{wheelchair.category}</TableCell>
                <TableCell>{getStatusBadge(wheelchair.status)}</TableCell>
                <TableCell className="text-muted-foreground">${wheelchair.dailyRate.toFixed(2)}</TableCell>
                <TableCell className="text-muted-foreground">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" />
                    {wheelchair.averageRating?.toFixed(1) || 'N/A'} ({wheelchair.reviewsCount || 0})
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditWheelchair(wheelchair)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => console.log(`Viewing reviews for ${wheelchair.name}`)}>
                        <Eye className="mr-2 h-4 w-4" /> View Reviews
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600 hover:text-red-700 focus:text-red-700" onClick={() => handleDeleteWheelchair(wheelchair.id)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
        <div className="text-center py-10 text-muted-foreground">No wheelchairs found.</div>
      )}

      <WheelchairForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingWheelchair(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingWheelchair}
      />
      
      <AlertDialog open={!!deletingWheelchairId} onOpenChange={(open) => !open && setDeletingWheelchairId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the wheelchair.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingWheelchairId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
