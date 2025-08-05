
"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import type { Wheelchair } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit, Trash2, PlusCircle, Star } from "lucide-react";
import Image from "next/image";
import WheelchairForm from './wheelchair-form';
import { PaginationControls } from '@/components/pagination-controls';
import { PageTitle } from '@/components/page-title';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const ITEMS_PER_PAGE = 10;
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function WheelchairTable() {
  const [wheelchairs, setWheelchairs] = useState<Wheelchair[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWheelchairId, setEditingWheelchairId] = useState<string | null>(null);
  const [deletingWheelchairId, setDeletingWheelchairId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchWheelchairs = useCallback(async () => {
    if (!baseUrl) {
        console.error("NEXT_PUBLIC_API_URL is not defined");
        return;
    }
    try {
      const response = await axios.get(`${baseUrl}/admin/wheelchair/allWheelchairs`);
      if (response.data.success) {
        setWheelchairs(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch wheelchairs", error);
      toast({ variant: "destructive", title: "Fetch Error", description: "Could not fetch wheelchairs." });
    }
  }, [toast]);

  useEffect(() => {
    fetchWheelchairs();
  }, [fetchWheelchairs]);

  const filteredWheelchairs = useMemo(() => {
    return wheelchairs.filter(w =>
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [wheelchairs, searchTerm]);

  const paginatedWheelchairs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredWheelchairs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredWheelchairs, currentPage]);

  const totalPages = Math.ceil(filteredWheelchairs.length / ITEMS_PER_PAGE);

  const handleAdd = () => {
    setEditingWheelchairId(null);
    setIsFormOpen(true);
  };

  const handleEdit = (id: string) => {
    setEditingWheelchairId(id);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeletingWheelchairId(id);
  };

  const confirmDelete = async () => {
    if (deletingWheelchairId) {
      if (!baseUrl) return;
      try {
        await axios.delete(`${baseUrl}/api/deleteWheelchair/${deletingWheelchairId}`);
        toast({ title: "Success", description: "Wheelchair deleted successfully." });
        setWheelchairs(prev => prev.filter(w => w.id !== deletingWheelchairId));
        setDeletingWheelchairId(null);
      } catch (error) {
        toast({ variant: "destructive", title: "Delete Error", description: "Could not delete wheelchair." });
      }
    }
  };

  const handleFormSubmit = () => {
    setIsFormOpen(false);
    fetchWheelchairs(); // Refetch data after add/edit
  };
  
  const getStatusBadge = (isAvailable: boolean) => {
    return isAvailable 
      ? <Badge variant="default" className="bg-green-500 hover:bg-green-600">Available</Badge>
      : <Badge variant="secondary" className="bg-orange-400 hover:bg-orange-500 text-orange-900">Maintenance</Badge>;
  };

  return (
    <>
      <PageTitle title="Wheelchair Management">
        <Button onClick={handleAdd}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Wheelchair
        </Button>
      </PageTitle>
      <div className="mb-4">
        <Input
          placeholder="Search wheelchairs by name or category..."
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
              <TableHead>Rating</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedWheelchairs.map((wheelchair) => (
              <TableRow key={wheelchair.id}>
                <TableCell>
                  <div className="relative h-12 w-16 rounded-md overflow-hidden border">
                    <Image src={wheelchair.images?.[0]?.url || "https://placehold.co/100x80.png"} alt={wheelchair.name} layout="fill" objectFit="cover" data-ai-hint="wheelchair product"/>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{wheelchair.name}</TableCell>
                <TableCell className="text-muted-foreground">{wheelchair.category?.name || 'N/A'}</TableCell>
                <TableCell>{getStatusBadge(wheelchair.is_globally_available)}</TableCell>
                <TableCell className="text-muted-foreground">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" />
                    {parseFloat(wheelchair.average_rating || '0').toFixed(1)} ({wheelchair.total_reviews || 0})
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
                      <DropdownMenuItem onClick={() => handleEdit(wheelchair.id)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600 hover:text-red-700 focus:text-red-700" onClick={() => handleDelete(wheelchair.id)}>
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

      {isFormOpen && (
        <WheelchairForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmitSuccess={handleFormSubmit}
          wheelchairId={editingWheelchairId}
        />
      )}
      
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
