
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
// import type { Category, City } from '@/types';
import { mockCategories, mockCities } from '@/lib/mock-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit, Trash2, PlusCircle, ToggleLeft, ToggleRight, Tag, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PageTitle } from '@/components/page-title';
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import * as LucideIcons from 'lucide-react';
import { PaginationControls } from '@/components/pagination-controls';

// Category Management
// interface CategoryFormProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (category: Category) => void;
//   initialData?: Category | null;
// }

// function CategoryForm({ isOpen, onClose, onSubmit, initialData }: CategoryFormProps) {
//   const [category, setCategory] = useState<Omit<Category, 'id'>>(initialData || { name: '', icon: 'Shapes' });

//   React.useEffect(() => {
//     if (initialData) setCategory(initialData);
//     else setCategory({ name: '', icon: 'Shapes' });
//   }, [initialData, isOpen]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const newId = initialData?.id || `cat-${Date.now()}`;
//     onSubmit({ ...category, id: newId });
//     onClose();
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-md bg-card">
//         <DialogHeader><DialogTitle className="text-primary">{initialData ? 'Edit Category' : 'Add Category'}</DialogTitle></DialogHeader>
//         <form onSubmit={handleSubmit} className="space-y-4 py-4">
//           <div>
//             <Label htmlFor="catName">Category Name</Label>
//             <Input id="catName" value={category.name} onChange={e => setCategory(c => ({ ...c, name: e.target.value }))} required />
//           </div>
//           <div>
//             <Label htmlFor="catIcon">Icon Name (Lucide)</Label>
//             <Input id="catIcon" value={category.icon} onChange={e => setCategory(c => ({ ...c, icon: e.target.value }))} placeholder="e.g., Zap, Armchair" required />
//             <p className="text-xs text-muted-foreground mt-1">Enter a valid Lucide icon name. Preview:</p>
//             {LucideIcons[category.icon as keyof typeof LucideIcons] ? 
//               React.createElement(LucideIcons[category.icon as keyof typeof LucideIcons], {className: "h-5 w-5 inline-block ml-2"}) : 
//               <LucideIcons.AlertCircle className="h-5 w-5 inline-block ml-2 text-destructive" />}
//           </div>
//           <DialogFooter>
//             <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
//             <Button type="submit">{initialData ? 'Save' : 'Add'}</Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

// function CategoriesTab() {
//   const [categories, setCategories] = useState<Category[]>(mockCategories);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingCategory, setEditingCategory] = useState<Category | null>(null);
//   const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);


//   const handleAdd = () => { setEditingCategory(null); setIsFormOpen(true); };
//   const handleEdit = (cat: Category) => { setEditingCategory(cat); setIsFormOpen(true); };
//   const handleDelete = (id: string) => setDeletingCategoryId(id);
  
//   const confirmDeleteCategory = () => {
//     if(deletingCategoryId) {
//       setCategories(prev => prev.filter(c => c.id !== deletingCategoryId));
//       setDeletingCategoryId(null);
//     }
//   };

//   const handleFormSubmit = (catData: Category) => {
//     if (editingCategory) {
//       setCategories(prev => prev.map(c => (c.id === catData.id ? catData : c)));
//     } else {
//       setCategories(prev => [...prev, catData]);
//     }
//     setIsFormOpen(false);
//   };
  
//   const IconComponent = ({ iconName }: { iconName: string }) => {
//     const Icon = LucideIcons[iconName as keyof typeof LucideIcons] || LucideIcons.Shapes;
//     return <Icon className="h-5 w-5 text-primary" />;
//   };


//   return (
//     <div className="space-y-4">
//       <div className="flex justify-end">
//         <Button onClick={handleAdd}><PlusCircle className="mr-2 h-4 w-4" />Add Category</Button>
//       </div>
//       <div className="rounded-md border shadow-sm bg-card">
//         <Table>
//           <TableHeader>
//             <TableRow><TableHead>Icon</TableHead><TableHead>Name</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
//           </TableHeader>
//           <TableBody>
//             {categories.map(cat => (
//               <TableRow key={cat.id}>
//                 <TableCell><IconComponent iconName={cat.icon} /></TableCell>
//                 <TableCell className="font-medium">{cat.name}</TableCell>
//                 <TableCell className="text-right">
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                       <DropdownMenuItem onClick={() => handleEdit(cat)}><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
//                       <DropdownMenuItem className="text-red-600 focus:text-red-700" onClick={() => handleDelete(cat.id)}><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//       {categories.length === 0 && <div className="text-center py-10 text-muted-foreground">No categories found.</div>}
//       <CategoryForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} initialData={editingCategory} />
//       <AlertDialog open={!!deletingCategoryId} onOpenChange={(open) => !open && setDeletingCategoryId(null)}>
//         <AlertDialogContent>
//           <AlertDialogHeader><AlertDialogTitle>Confirm Deletion</AlertDialogTitle><AlertDialogDescription>Delete category? This is irreversible.</AlertDialogDescription></AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel onClick={()=>setDeletingCategoryId(null)}>Cancel</AlertDialogCancel>
//             <AlertDialogAction onClick={confirmDeleteCategory} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }

const ITEMS_PER_PAGE = 10;

// City Management
interface CityFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (city: City) => void;
  initialData?: City | null;
};

interface City {
  id: string;
  city_name: string;
  state_name: string;
  is_active: boolean;
}

function CityForm({ isOpen, onClose, onSubmit, initialData }: CityFormProps) {
  const [city, setCity] = useState<Omit<City, 'id'>>(initialData || { city_name: '',state_name:'' , is_active: false });

  React.useEffect(() => {
    if (initialData) setCity(initialData);
    else setCity({ city_name: '', state_name:'', is_active: false });
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // const newId = initialData?.id
    onSubmit( {...city});
    // initialData ? { ...city, id: initialData.id } : city
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader><DialogTitle className="text-primary">{initialData ? 'Edit City' : 'Add City'}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label htmlFor="cityName">City Name</Label>
            <Input id="cityName" value={city.city_name} onChange={e => setCity(c => ({ ...c, city_name: e.target.value }))} required />
          </div>
          <div>
            <Label htmlFor="stateName">State Name</Label>
            <Input id="stateName" value={city.state_name} onChange={e => setCity(c => ({ ...c, state_name: e.target.value }))} required />
          </div>
          <Label htmlFor="is_active">Status</Label>
          <div className="flex items-center gap-2">
            <span>{city.is_active ? 'Active' : 'Inactive'}</span>
            <input
              id="is_active"
              type="checkbox"
              checked={city.is_active}
              onChange={e => setCity(c => ({ ...c, is_active: e.target.checked }))}
              className="w-10 h-5 rounded-full bg-gray-300 appearance-none checked:bg-green-500 relative transition duration-300
                        before:content-[''] before:absolute before:top-0.5 before:left-0.5 before:w-4 before:h-4 before:rounded-full
                        before:bg-white before:transition-transform before:duration-300
                        checked:before:translate-x-5"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
            <Button type="submit">{initialData ? 'Save' : 'Add'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CitiesTab() {
  const { toast } = useToast();
  const [cities, setCities] = useState<City[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [deletingCityId, setDeletingCityId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchCities();
  }, []);

  const filteredCities = useMemo(() => {
    return cities.filter(city =>
      city.city_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.state_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [cities,searchTerm]);

  const paginatedCities = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCities.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCities, currentPage]);
  const totalPages = Math.ceil(filteredCities.length / ITEMS_PER_PAGE);

  const fetchCities = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/getCities`);
      setCities(res.data.data.cities);
    } catch (err) {
      console.error("Axios failed to fetch users:", err);
    }
  };

  const handleAdd = () => { setEditingCity(null); setIsFormOpen(true); };
  const handleEditCity = (city: City) => {
    setEditingCity(city);
    setIsFormOpen(true); 
  };
  const handleDeleteCity = (id: string) => (setDeletingCityId(id))
  const toggleStatus = async (id: string) => {
    const res = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/updateStatus/${id}`);
    setCities(prev => prev.map(c => c.id === id ? { ...c, is_active: c.is_active === true ? false : true } : c));

  };

  const handleFormSubmit = async (cityData: City) => {
    if (editingCity) {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/updateCity`,cityData);
      const data = res.data;
      if(data.success){
        toast({
          description: `${data.message}`,
          className: "bg-green-500 text-white",
        });
        setCities(prev => prev.map(c => (c.id === cityData.id ? cityData : c)));
      }

    } else {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/addCity`,cityData);
      const data = res.data
      if(data.success){
        setCities(prev => [...prev, cityData]);
        toast({
          description: `${data.message}`,
          className: "bg-green-500 text-white",
        });
      }
      fetchCities();
    };
    setIsFormOpen(false);
  };
  
  const confirmDeleteCity = async () => {
    if(deletingCityId) {
      setIsLoading(true);
      setCities(prev => prev.filter(c => c.id !== deletingCityId));
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/deleteCity/${deletingCityId}`);
      setDeletingCityId(null);
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: City['is_active']) => {
    return status === true
      ? <Badge variant="default" className="bg-green-500 hover:bg-green-600">Active</Badge>
      : <Badge variant="destructive">Inactive</Badge>;
  };

  return (
    <>
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="mb-4">
          <Input
            placeholder="Search cities..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="w-64"
          />
        </div>

        <Button onClick={handleAdd}><PlusCircle className="mr-2 h-4 w-4" />Add City</Button>
      </div>
      <div className="rounded-md border shadow-sm bg-card">
      <Table>
        <TableHeader>
          <TableRow><TableHead>Name</TableHead><TableHead>State</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
        </TableHeader>
        <TableBody>
          {paginatedCities.map((city,index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{city.city_name}</TableCell>
              <TableCell  className="font-medium">{city.state_name}</TableCell>
              <TableCell>{getStatusBadge(city.is_active)}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => toggleStatus(city.id)}>
                  {city.is_active === true ? <ToggleRight className="mr-2 h-4 w-4 text-green-500" /> : <ToggleLeft className="mr-2 h-4 w-4 text-red-500" />}
                  {city.is_active === true ? 'Disable' : 'Enable'}
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditCity(city)}><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600 focus:text-red-700" onClick={() => handleDeleteCity(city.id)}><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
      {cities.length === 0 && <div className="text-center py-10 text-muted-foreground">No cities found.</div>}
      <CityForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} initialData={editingCity} />
        <AlertDialog open={!!deletingCityId} onOpenChange={(open) => !open && setDeletingCityId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Confirm Deletion</AlertDialogTitle><AlertDialogDescription>Delete city? This is irreversible.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={()=>setDeletingCityId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteCity} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
       {paginatedCities.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">No users found.</div>
      )}
    </>
  );
}


export default function CategoryCityTabs() {
  return (
    <>
      <PageTitle title="City Management" />
      {/* <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="categories"><Tag className="mr-2 h-4 w-4"/>Categories</TabsTrigger>
          <TabsTrigger value="cities"><MapPin className="mr-2 h-4 w-4"/>Service Cities</TabsTrigger>
        </TabsList>
        <TabsContent value="categories" className="mt-6">
          <CategoriesTab />
        </TabsContent>
        <TabsContent value="cities" className="mt-6">
         
        </TabsContent>
      </Tabs> */}

       <CitiesTab />
    </>
  );
}
