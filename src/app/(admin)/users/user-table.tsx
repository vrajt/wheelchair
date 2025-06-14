"use client";

import React, { useState, useMemo } from 'react';
import type { User } from '@/types';
import { mockUsers } from '@/lib/mock-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, FileDown, UserCheck, UserX, CheckCircle, XCircle, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PaginationControls } from '@/components/pagination-controls';
import { PageTitle } from '@/components/page-title';

const ITEMS_PER_PAGE = 10;

export default function UserTable() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const handleExport = () => {
    console.log("Exporting user data to Excel...");
    // Actual export logic would go here
  };

  const handleStatusChange = (userId: string, field: 'status' | 'kycStatus', value: User['status'] | User['kycStatus']) => {
    setUsers(prevUsers => prevUsers.map(user => 
      user.id === userId ? { ...user, [field]: value } : user
    ));
  };

  const getKycStatusBadge = (status: User['kycStatus']) => {
    switch (status) {
      case 'Verified': return <Badge variant="default" className="bg-green-500 hover:bg-green-600"><CheckCircle className="mr-1 h-3 w-3" />Verified</Badge>;
      case 'Pending': return <Badge variant="secondary" className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900"><Clock className="mr-1 h-3 w-3" />Pending</Badge>;
      case 'Rejected': return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Rejected</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getUserStatusBadge = (status: User['status']) => {
     switch (status) {
      case 'Active': return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Active</Badge>;
      case 'Inactive': return <Badge variant="destructive">Inactive</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  }

  return (
    <>
      <PageTitle title="User Management">
        <Button onClick={handleExport} variant="outline">
          <FileDown className="mr-2 h-4 w-4" />
          Export to Excel
        </Button>
      </PageTitle>
      <div className="mb-4">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border shadow-sm bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>KYC Status</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="user avatar" />
                      <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>{getUserStatusBadge(user.status)}</TableCell>
                <TableCell>{getKycStatusBadge(user.kycStatus)}</TableCell>
                <TableCell className="text-muted-foreground">{new Date(user.registrationDate).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'status', user.status === 'Active' ? 'Inactive' : 'Active')}>
                        {user.status === 'Active' ? <UserX className="mr-2 h-4 w-4" /> : <UserCheck className="mr-2 h-4 w-4" />}
                        {user.status === 'Active' ? 'Deactivate' : 'Activate'} User
                      </DropdownMenuItem>
                      {user.kycStatus === 'Pending' && (
                        <>
                          <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'kycStatus', 'Verified')}>
                            <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Verify KYC
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'kycStatus', 'Rejected')}>
                            <XCircle className="mr-2 h-4 w-4 text-red-500" /> Reject KYC
                          </DropdownMenuItem>
                        </>
                      )}
                       {user.kycStatus === 'Rejected' && (
                         <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'kycStatus', 'Pending')}>
                            <Clock className="mr-2 h-4 w-4 text-yellow-500" /> Mark as Pending
                          </DropdownMenuItem>
                       )}
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
       {paginatedUsers.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">No users found.</div>
      )}
    </>
  );
}
