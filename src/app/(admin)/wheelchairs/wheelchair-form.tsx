"use client";

import React, { useState, useEffect } from 'react';
import type { Wheelchair, Category } from '@/types';
import { mockCategories } from '@/lib/mock-data';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import Image from 'next/image';

interface WheelchairFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (wheelchair: Wheelchair) => void;
  initialData?: Wheelchair | null;
}

const defaultWheelchair: Omit<Wheelchair, 'id'> = {
  name: '',
  category: mockCategories[0]?.name || '',
  status: 'Available',
  description: '',
  dailyRate: 0,
  imageUrl: '',
  dataAiHint: 'wheelchair product',
};

export default function WheelchairForm({ isOpen, onClose, onSubmit, initialData }: WheelchairFormProps) {
  const [wheelchair, setWheelchair] = useState<Omit<Wheelchair, 'id'>>(initialData || defaultWheelchair);
  const [previewImage, setPreviewImage] = useState<string | null>(initialData?.imageUrl || null);

  useEffect(() => {
    if (initialData) {
      setWheelchair(initialData);
      setPreviewImage(initialData.imageUrl || null);
    } else {
      setWheelchair(defaultWheelchair);
      setPreviewImage(null);
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setWheelchair(prev => ({ ...prev, [name]: name === 'dailyRate' ? parseFloat(value) || 0 : value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setWheelchair(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setWheelchair(prev => ({...prev, imageUrl: result, dataAiHint: 'wheelchair product' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = initialData?.id || `wheelchair-${Date.now()}`;
    onSubmit({ ...wheelchair, id: newId });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] bg-card shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-primary">{initialData ? 'Edit Wheelchair' : 'Add New Wheelchair'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={wheelchair.name} onChange={handleChange} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select name="category" value={wheelchair.category} onValueChange={(value) => handleSelectChange('category', value)}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {mockCategories.map(cat => (
                    <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select name="status" value={wheelchair.status} onValueChange={(value) => handleSelectChange('status', value)}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Rented">Rented</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="dailyRate">Daily Rate ($)</Label>
            <Input id="dailyRate" name="dailyRate" type="number" value={wheelchair.dailyRate} onChange={handleChange} required min="0" step="0.01" />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={wheelchair.description} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="imageUrl">Image</Label>
            <Input id="imageUrl" name="imageUrl" type="file" accept="image/*" onChange={handleImageUpload} className="mb-2" />
            {previewImage && (
              <div className="mt-2 relative w-full h-40 rounded-md overflow-hidden border">
                <Image src={previewImage} alt="Preview" layout="fill" objectFit="cover" data-ai-hint={wheelchair.dataAiHint} />
              </div>
            )}
            {!previewImage && wheelchair.imageUrl && (
                <div className="mt-2 relative w-full h-40 rounded-md overflow-hidden border">
                 <Image src={wheelchair.imageUrl} alt={wheelchair.name} layout="fill" objectFit="cover" data-ai-hint={wheelchair.dataAiHint} />
                </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {initialData ? 'Save Changes' : 'Add Wheelchair'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
