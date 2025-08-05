"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { Wheelchair, WheelchairCategory } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Switch } from '@/components/ui/switch';
import { useToast } from "@/hooks/use-toast";
import axios from 'axios';
import TiptapEditor from "@/components/TiptapEditor";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

interface WheelchairFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
  wheelchairId?: string | null;
}

const defaultWheelchair: Partial<Wheelchair> = {
  name: '',
  category_id: undefined,
  description: '',
  information: '',
  model: '',
  manufacturer: '',
  is_globally_available: true,
};

export default function WheelchairForm({ isOpen, onClose, onSubmitSuccess, wheelchairId }: WheelchairFormProps) {
  const [wheelchair, setWheelchair] = useState<Partial<Wheelchair>>(defaultWheelchair);
  const [categories, setCategories] = useState<WheelchairCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchCategories = useCallback(async () => {
    if (!baseUrl) return;
    try {
      const response = await axios.get(`${baseUrl}/admin/api/getWheelchairCategories`);
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not fetch wheelchair categories." });
    }
  }, [toast]);

  const fetchWheelchairData = useCallback(async (id: string) => {
    if (!baseUrl) return;
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/admin/api/getWheelchairById/${id}`);
      if (response.data.success) {
        setWheelchair(response.data.data);
      } else {
        toast({ variant: "destructive", title: "Error", description: `Could not fetch wheelchair data. ${response.data.message}`});
      }
    } catch (error) {
       toast({ variant: "destructive", title: "Fetch Error", description: "Could not fetch wheelchair data." });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);


  useEffect(() => {
    if (!isOpen) return;
    if (!baseUrl) {
      console.error("NEXT_PUBLIC_API_URL is not defined.");
      return;
    }
    fetchCategories();
    if (wheelchairId) {
      fetchWheelchairData(wheelchairId);
    } else {
      setWheelchair(defaultWheelchair);
    }
  }, [wheelchairId, fetchCategories, fetchWheelchairData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setWheelchair(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setWheelchair(prev => ({ ...prev, category_id: Number(value) }));
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setWheelchair(prev => ({...prev, is_globally_available: checked }));
  }

  const handleEditorUpdate = (content: string) => {
    setWheelchair(prev => ({ ...prev, information: content }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!baseUrl) return;

    // Client-side validation
    const { name, category_id, description, information, model, manufacturer } = wheelchair;
    if (!name || !category_id || !description || !information || !model || !manufacturer) {
        toast({
            variant: "destructive",
            title: "Validation Error",
            description: "Please fill out all required fields before submitting.",
        });
        return;
    }

    setIsLoading(true);

    const apiPath = wheelchairId
      ? `${baseUrl}/admin/api/updateWheelchair/${wheelchairId}`
      : `${baseUrl}/admin/api/addWheelchair`;
    const method = wheelchairId ? 'put' : 'post';
    
    try {
      const response = await axios[method](apiPath, wheelchair);
      if (response.status === 200 || response.status === 201) {
        toast({ title: "Success", description: `Wheelchair ${wheelchairId ? 'updated' : 'added'} successfully.` });
        onSubmitSuccess();
      } else {
        toast({ variant: "destructive", title: "Error", description: response.data.message || "An unknown error occurred." });
      }
    } catch (error: any) {
      console.error("Form submission error", error);
      toast({ variant: "destructive", title: "Submission Error", description: error.response?.data?.message || "Could not save wheelchair." });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl bg-card shadow-xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-primary">{wheelchairId ? 'Edit Wheelchair' : 'Add New Wheelchair'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} id="wheelchair-form" className="space-y-4 py-4 flex-1 overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={wheelchair.name} onChange={handleChange} required disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category_id">Category</Label>
               <Select value={String(wheelchair.category_id || '')} onValueChange={handleSelectChange} disabled={isLoading || !!wheelchairId}>
                <SelectTrigger id="category_id">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input id="model" name="model" value={wheelchair.model || ''} onChange={handleChange} disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manufacturer">Manufacturer</Label>
              <Input id="manufacturer" name="manufacturer" value={wheelchair.manufacturer || ''} onChange={handleChange} disabled={isLoading} />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Plain Text)</Label>
            <Textarea id="description" name="description" value={wheelchair.description} onChange={handleChange} required disabled={isLoading} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="information">Information (Rich Text Editor)</Label>
            <div className="bg-white rounded-md border min-h-[250px] overflow-y-auto text-black">
              <TiptapEditor value={wheelchair.information || ""} onChange={handleEditorUpdate} />
            </div>
          </div>
          
          <div className="flex items-center space-x-2 pt-10">
            <Switch id="is_globally_available" checked={!!wheelchair.is_globally_available} onCheckedChange={handleSwitchChange} disabled={isLoading}/>
            <Label htmlFor="is_globally_available">Available for Rent</Label>
          </div>

        </form>
        <DialogFooter className="mt-auto pt-4 border-t">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isLoading}>Cancel</Button>
            </DialogClose>
            <Button form="wheelchair-form" type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
              {isLoading ? 'Saving...' : (wheelchairId ? 'Save Changes' : 'Add Wheelchair')}
            </Button>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
