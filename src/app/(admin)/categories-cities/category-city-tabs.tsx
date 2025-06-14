
"use client";

import React, { useState, useMemo } from 'react';
import type { Category, City } from '@/types';
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import * as LucideIcons from 'lucide-react';

// Category Management
interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (category: Category) => void;
  initialData?: Category | null;
}

function CategoryForm({ isOpen, onClose, onSubmit, initialData }: CategoryFormProps) {
  const [category, setCategory] = useState<Omit<Category, 'id'>>(initialData || { name: '', icon: 'Shapes' });

  React.useEffect(() => {
    if (initialData) setCategory(initialData);
    else setCategory({ name: '', icon: 'Shapes' });
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = initialData?.id || `cat-${Date.now()}`;
    onSubmit({ ...category, id: newId });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader><DialogTitle className="text-primary">{initialData ? 'Edit Category' : 'Add Category'}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label htmlFor="catName">Category Name</Label>
            <Input id="catName" value={category.name} onChange={e => setCategory(c => ({ ...c, name: e.target.value }))} required />
          </div>
          <div>
            <Label htmlFor="catIcon">Icon Name (Lucide)</Label>
            <Input id="catIcon" value={category.icon} onChange={e => setCategory(c => ({ ...c, icon: e.target.value }))} placeholder="e.g., Zap, Armchair" required />
            <p className="text-xs text-muted-foreground mt-1">Enter a valid Lucide icon name. Preview:</p>
            {LucideIcons[category.icon as keyof typeof LucideIcons] ? 
              React.createElement(LucideIcons[category.icon as keyof typeof LucideIcons], {className: "h-5 w-5 inline-block ml-2"}) : 
              <LucideIcons.AlertCircle className="h-5 w-5 inline-block ml-2 text-destructive" />}
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

function CategoriesTab() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);


  const handleAdd = () => { setEditingCategory(null); setIsFormOpen(true); };
  const handleEdit = (cat: Category) => { setEditingCategory(cat); setIsFormOpen(true); };
  const handleDelete = (id: string) => setDeletingCategoryId(id);
  
  const confirmDeleteCategory = () => {
    if(deletingCategoryId) {
      setCategories(prev => prev.filter(c => c.id !== deletingCategoryId));
      setDeletingCategoryId(null);
    }
  };

  const handleFormSubmit = (catData: Category) => {
    if (editingCategory) {
      setCategories(prev => prev.map(c => (c.id === catData.id ? catData : c)));
    } else {
      setCategories(prev => [...prev, catData]);
    }
    setIsFormOpen(false);
  };
  
  const IconComponent = ({ iconName }: { iconName: string }) => {
    const Icon = LucideIcons[iconName as keyof typeof LucideIcons] || LucideIcons.Shapes;
    return <Icon className="h-5 w-5 text-primary" />;
  };


  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleAdd}><PlusCircle className="mr-2 h-4 w-4" />Add Category</Button>
      </div>
      <div className="rounded-md border shadow-sm bg-card">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Icon</TableHead><TableHead>Name</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {categories.map(cat => (
              <TableRow key={cat.id}>
                <TableCell><IconComponent iconName={cat.icon} /></TableCell>
                <TableCell className="font-medium">{cat.name}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(cat)}><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600 focus:text-red-700" onClick={() => handleDelete(cat.id)}><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {categories.length === 0 && <div className="text-center py-10 text-muted-foreground">No categories found.</div>}
      <CategoryForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} initialData={editingCategory} />
      <AlertDialog open={!!deletingCategoryId} onOpenChange={(open) => !open && setDeletingCategoryId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Confirm Deletion</AlertDialogTitle><AlertDialogDescription>Delete category? This is irreversible.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={()=>setDeletingCategoryId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteCategory} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// City Management
interface CityFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (city: City) => void;
  initialData?: City | null;
}

function CityForm({ isOpen, onClose, onSubmit, initialData }: CityFormProps) {
  const [city, setCity] = useState<Omit<City, 'id'>>(initialData || { name: '', status: 'Active' });

  React.useEffect(() => {
    if (initialData) setCity(initialData);
    else setCity({ name: '', status: 'Active' });
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = initialData?.id || `city-${Date.now()}`;
    onSubmit({ ...city, id: newId });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader><DialogTitle className="text-primary">{initialData ? 'Edit City' : 'Add City'}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label htmlFor="cityName">City Name</Label>
            <Input id="cityName" value={city.name} onChange={e => setCity(c => ({ ...c, name: e.target.value }))} required />
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
  const [cities, setCities] = useState<City[]>(mockCities);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);

  const handleAdd = () => { setEditingCity(null); setIsFormOpen(true); };
  const handleEdit = (city: City) => { setEditingCity(city); setIsFormOpen(true); }; // Not used in UI but good to have
  const toggleStatus = (id: string) => {
    setCities(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c));
  };

  const handleFormSubmit = (cityData: City) => {
    if (editingCity) { // Though edit button isn't there, logic remains
      setCities(prev => prev.map(c => (c.id === cityData.id ? cityData : c)));
    } else {
      setCities(prev => [...prev, cityData]);
    }
    setIsFormOpen(false);
  };
  
  const getStatusBadge = (status: City['status']) => {
    return status === 'Active' 
      ? <Badge variant="default" className="bg-green-500 hover:bg-green-600">Active</Badge>
      : <Badge variant="destructive">Inactive</Badge>;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleAdd}><PlusCircle className="mr-2 h-4 w-4" />Add City</Button>
      </div>
      <div className="rounded-md border shadow-sm bg-card">
      <Table>
        <TableHeader>
          <TableRow><TableHead>Name</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
        </TableHeader>
        <TableBody>
          {cities.map(city => (
            <TableRow key={city.id}>
              <TableCell className="font-medium">{city.name}</TableCell>
              <TableCell>{getStatusBadge(city.status)}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => toggleStatus(city.id)}>
                  {city.status === 'Active' ? <ToggleRight className="mr-2 h-4 w-4 text-green-500" /> : <ToggleLeft className="mr-2 h-4 w-4 text-red-500" />}
                  {city.status === 'Active' ? 'Disable' : 'Enable'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
      {cities.length === 0 && <div className="text-center py-10 text-muted-foreground">No cities found.</div>}
      <CityForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} initialData={editingCity} />
    </div>
  );
}


export default function CategoryCityTabs() {
  return (
    <>
      <PageTitle title="Category &amp; City Management" />
      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="categories"><Tag className="mr-2 h-4 w-4"/>Categories</TabsTrigger>
          <TabsTrigger value="cities"><MapPin className="mr-2 h-4 w-4"/>Service Cities</TabsTrigger>
        </TabsList>
        <TabsContent value="categories" className="mt-6">
          <CategoriesTab />
        </TabsContent>
        <TabsContent value="cities" className="mt-6">
          <CitiesTab />
        </TabsContent>
      </Tabs>
    </>
  );
}
