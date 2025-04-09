import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Wand } from "lucide-react";

import {
  commonAnimals,
  characterColors,
  characterEyes,
  characterSizes,
  characterPatterns,
  characterAccessories,
  characterPersonalities,
  characterAbilities,
  insertCharacterSchema,
} from "@shared/schema";

const formSchema = insertCharacterSchema.extend({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  baseAnimal: z.string().min(2, {
    message: "Please select an animal.",
  }),
  customization: z.object({
    color: z.string().min(1, {
      message: "Please select a color.",
    }),
    accessories: z.array(z.string()).optional().default([]),
    personality: z.string().min(1, {
      message: "Please select a personality.",
    }),
    specialAbility: z.string().min(1, {
      message: "Please select a special ability.",
    }),
    appearance: z.object({
      eyes: z.string().min(1, {
        message: "Please select an eye shape.",
      }),
      size: z.string().min(1, {
        message: "Please select a size.",
      }),
      pattern: z.string().min(1, {
        message: "Please select a pattern.",
      }),
    }),
  }),
});

type FormSchema = z.infer<typeof formSchema>;

export default function CreateCharacter() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      baseAnimal: "",
      customization: {
        color: "",
        accessories: [],
        personality: "",
        specialAbility: "",
        appearance: {
          eyes: "",
          size: "",
          pattern: "",
        },
      },
    },
  });

  const createCharacterMutation = useMutation({
    mutationFn: (data: FormSchema) => 
      apiRequest("POST", "/api/characters", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/characters'] });
      toast({
        title: "Character Created!",
        description: "Your character has been added to the gallery.",
      });
      setLocation("/characters");
    },
    onError: () => {
      toast({
        title: "Failed to create character",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: FormSchema) {
    createCharacterMutation.mutate(data);
  }

  function addAccessory(accessory: string) {
    const currentAccessories = form.getValues("customization.accessories") || [];
    
    // Don't add duplicates
    if (currentAccessories.includes(accessory)) {
      return;
    }
    
    // Limit to 3 accessories
    if (currentAccessories.length >= 3) {
      toast({
        title: "Maximum accessories reached",
        description: "Remove an accessory before adding a new one",
        variant: "destructive",
      });
      return;
    }
    
    const updatedAccessories = [...currentAccessories, accessory];
    form.setValue("customization.accessories", updatedAccessories);
    setSelectedAccessories(updatedAccessories);
  }

  function removeAccessory(accessory: string) {
    const currentAccessories = form.getValues("customization.accessories") || [];
    const updatedAccessories = currentAccessories.filter(item => item !== accessory);
    form.setValue("customization.accessories", updatedAccessories);
    setSelectedAccessories(updatedAccessories);
  }

  function randomizeCharacter() {
    const getRandomItem = <T extends readonly string[]>(array: T) => {
      const randomIndex = Math.floor(Math.random() * array.length);
      return array[randomIndex];
    };
    
    // Get 1-3 random accessories
    const accessoryCount = Math.floor(Math.random() * 3) + 1;
    const randomAccessories: string[] = [];
    const accessoriesCopy = [...characterAccessories];
    
    for (let i = 0; i < accessoryCount; i++) {
      if (accessoriesCopy.length === 0) break;
      const randomIndex = Math.floor(Math.random() * accessoriesCopy.length);
      randomAccessories.push(accessoriesCopy[randomIndex] as string);
      accessoriesCopy.splice(randomIndex, 1);
    }
    
    form.setValue("baseAnimal", getRandomItem(commonAnimals));
    form.setValue("customization.color", getRandomItem(characterColors));
    form.setValue("customization.personality", getRandomItem(characterPersonalities));
    form.setValue("customization.specialAbility", getRandomItem(characterAbilities));
    form.setValue("customization.accessories", randomAccessories);
    form.setValue("customization.appearance.eyes", getRandomItem(characterEyes));
    form.setValue("customization.appearance.size", getRandomItem(characterSizes));
    form.setValue("customization.appearance.pattern", getRandomItem(characterPatterns));
    
    setSelectedAccessories(randomAccessories);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => setLocation("/characters")}
              className="text-primary"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Gallery
            </Button>
            
            <Button
              variant="outline"
              onClick={randomizeCharacter}
              className="border-primary/30 text-primary"
            >
              <Wand className="mr-2 h-4 w-4" />
              Randomize
            </Button>
          </div>
          
          <Card className="border border-primary/20 animate-glow shadow-lg">
            <CardHeader className="bg-gradient-to-r from-background to-primary/5">
              <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Create a New Character
              </CardTitle>
              <CardDescription>
                Design a unique animal character that can be featured in your stories
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-primary">Character Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Fluffy" {...field} className="border-primary/20" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="baseAnimal"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-primary">Animal Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="border-primary/20">
                                  <SelectValue placeholder="Select an animal" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {commonAnimals.map((animal) => (
                                  <SelectItem key={animal} value={animal}>
                                    {animal.charAt(0).toUpperCase() + animal.slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="customization.color"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-primary">Color</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="border-primary/20">
                                  <SelectValue placeholder="Select a color" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {characterColors.map((color) => (
                                  <SelectItem key={color} value={color}>
                                    {color.charAt(0).toUpperCase() + color.slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {/* Appearance */}
                    <div className="space-y-4">
                      <h3 className="text-primary font-medium">Appearance</h3>
                      
                      <FormField
                        control={form.control}
                        name="customization.appearance.size"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-primary">Size</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="border-primary/20">
                                  <SelectValue placeholder="Select a size" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {characterSizes.map((size) => (
                                  <SelectItem key={size} value={size}>
                                    {size.charAt(0).toUpperCase() + size.slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="customization.appearance.eyes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-primary">Eye Shape</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="border-primary/20">
                                  <SelectValue placeholder="Select an eye shape" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {characterEyes.map((eyes) => (
                                  <SelectItem key={eyes} value={eyes}>
                                    {eyes.charAt(0).toUpperCase() + eyes.slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="customization.appearance.pattern"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-primary">Pattern</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="border-primary/20">
                                  <SelectValue placeholder="Select a pattern" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {characterPatterns.map((pattern) => (
                                  <SelectItem key={pattern} value={pattern}>
                                    {pattern.charAt(0).toUpperCase() + pattern.slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Separator className="my-4 bg-primary/20" />
                  
                  {/* Accessories */}
                  <div>
                    <h3 className="text-primary font-medium mb-2">Accessories (select up to 3)</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-4">
                      {characterAccessories.map((accessory) => {
                        const isSelected = selectedAccessories.includes(accessory);
                        return (
                          <Badge
                            key={accessory}
                            variant={isSelected ? "default" : "outline"}
                            className={`cursor-pointer ${
                              isSelected
                                ? "bg-primary hover:bg-primary/80"
                                : "border-primary/20 hover:border-primary/50 hover:bg-primary/5"
                            }`}
                            onClick={() => isSelected ? removeAccessory(accessory) : addAccessory(accessory)}
                          >
                            {accessory.charAt(0).toUpperCase() + accessory.slice(1)}
                          </Badge>
                        );
                      })}
                    </div>
                    <FormMessage>
                      {form.formState.errors.customization?.accessories?.message}
                    </FormMessage>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="customization.personality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary">Personality</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-primary/20">
                                <SelectValue placeholder="Select a personality trait" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {characterPersonalities.map((personality) => (
                                <SelectItem key={personality} value={personality}>
                                  {personality.charAt(0).toUpperCase() + personality.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="customization.specialAbility"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary">Special Ability</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-primary/20">
                                <SelectValue placeholder="Select a special ability" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {characterAbilities.map((ability) => (
                                <SelectItem key={ability} value={ability}>
                                  {ability.charAt(0).toUpperCase() + ability.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-shadow-glow"
                    disabled={createCharacterMutation.isPending}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {createCharacterMutation.isPending ? "Creating..." : "Create Character"}
                  </Button>
                </form>
              </Form>
            </CardContent>
            
            <CardFooter className="bg-gradient-to-r from-primary/5 to-background border-t border-primary/10">
              <p className="text-xs text-muted-foreground">
                Your character will appear in your gallery and can be used in future stories
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}