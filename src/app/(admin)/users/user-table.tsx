"use client";

import React, { useState, useMemo } from 'react';
import type { User } from '@/types';
import { useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, FileDown, UserCheck, UserX, CheckCircle, XCircle, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PaginationControls } from '@/components/pagination-controls';
import { PageTitle } from '@/components/page-title';
import axios from 'axios';

const ITEMS_PER_PAGE = 10;
const baseUrl = process.env.NEXT_PUBLIC_API_URL;
export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
useEffect(() => {
  
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${baseUrl}/admin/api/dashboardUsers`);
      const data = res.data;
const formatted = data.map((user: any) => ({
  id: String(user.id),
  name: `${user.first_name} ${user.last_name}`,
  email: user.email,
  status: user.account_status === 'REGISTERED' ? 'Active' : 'Inactive',
  kycStatus: user.kyc_status,
  registrationDate: new Date(user.createdAt).toLocaleDateString('en-CA'), // 👈 consistent format
  avatarUrl: '/avatars/default.png'
}));


      setUsers(formatted);
    } catch (err) {
      console.error("Axios failed to fetch users:", err);
    }
  };

  fetchUsers();
}, []);

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

const handleExport = async () => {
  try {
    const res = await axios.get(`${baseUrl}/admin/api/dashboardUsers`);
    const data = res.data;

    const formatted = data.map((user: any) => ({
      ID: String(user.id),
      Name: `${user.first_name} ${user.last_name}`,
      Email: user.email,
      Status: user.account_status === 'REGISTERED' ? 'Active' : 'Inactive',
      KYC_Status:
        user.kyc_status === 'ACCEPTED'
          ? 'Verified'
          : user.kyc_status === 'REJECTED'
          ? 'Rejected'
          : 'Pending',
      Registration_Date: new Date(user.createdAt).toLocaleDateString('en-CA') // YYYY-MM-DD
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
    link.setAttribute('download', 'users.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log("User data exported as CSV.");
  } catch (err) {
    console.error("Export failed:", err);
  }
};


const handleStatusChange = (
  userId: string,
  field: 'status' | 'kycStatus',
  value: string // ← allow any string
) => {
  setUsers(prev =>
    prev.map(user =>
      user.id === userId ? { ...user, [field]: value } : user
    )
  );

  if (field === 'kycStatus') {
    axios.put(`${baseUrl}/admin/api/updateKyc/${userId}`, {
      kyc_status: value
    }).catch(err => {
      console.error("Failed to update KYC status:", err);
    });
  }
};


const getKycStatusBadge = (status: string) => {
  if (status === 'ACCEPTED') {
    return (
      <Badge variant="default" className="bg-green-500 hover:bg-green-600">
        <CheckCircle className="mr-1 h-3 w-3" /> Verified
      </Badge>
    );
  } else if (status === 'PENDING') {
    return (
      <Badge variant="secondary" className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900">
        <Clock className="mr-1 h-3 w-3" /> Pending
      </Badge>
    );
  } else if (status === 'REJECTED') {
    return (
      <Badge variant="destructive">
        <XCircle className="mr-1 h-3 w-3" /> Rejected
      </Badge>
    );
  } else if (status === 'UPLOADED') {
    return (
      <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
        <FileDown className="mr-1 h-3 w-3" /> Uploaded
      </Badge>
    );
  } else if (status === 'IN PROCESS') {
    return (
      <Badge variant="outline" className="border-yellow-500 text-yellow-700">
        <Clock className="mr-1 h-3 w-3" /> In Process
      </Badge>
    );
  } else {
    return <Badge variant="outline">{status}</Badge>;
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
<TableCell className="text-right flex gap-2 justify-end">
  {/* Dropdown 1: User Status */}
  {/* <DropdownMenu>
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
    </DropdownMenuContent>
  </DropdownMenu> */}

  {/* Dropdown 2: KYC Status */}
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon">
        <Clock className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      {['PENDING', 'UPLOADED', 'IN PROCESS', 'ACCEPTED', 'REJECTED'].map((statusOption) => (
        <DropdownMenuItem
          key={statusOption}
          onClick={() => handleStatusChange(user.id, 'kycStatus', statusOption)}
        >
          {user.kycStatus === statusOption ? (
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
          ) : (
            <Clock className="mr-2 h-4 w-4 text-gray-400" />
          )}
          {statusOption}
        </DropdownMenuItem>
      ))}
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
