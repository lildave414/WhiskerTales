import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { storyThemes, commonAnimals } from "@shared/schema";
import { generateStory } from "@/lib/story-generator";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

const formSchema = z.object({
  childName: z.string().min(2).max(50),
  animal: z.enum(commonAnimals),
  theme: z.enum(storyThemes),
});

export default function Home() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      childName: "",
      animal: "lion",
      theme: "kindness",
    },
  });

  const createStory = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const story = generateStory(values);
      const response = await apiRequest("POST", "/api/stories", story);
      return response.json();
    },
    onSuccess: (data) => {
      navigate(`/story/${data.id}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create story. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[10%] left-[10%] w-32 h-32 rounded-full bg-primary/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[15%] w-40 h-40 rounded-full bg-secondary/10 blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-[40%] right-[20%] w-24 h-24 rounded-full bg-primary/5 blur-2xl animate-pulse" style={{ animationDelay: "0.5s" }}></div>
      </div>
      
      <Card className="w-full max-w-md border-2 border-primary/50 animate-glow relative z-10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Bedtime Story Generator
          </CardTitle>
          <div className="flex justify-center mt-4">
            <svg
              className="w-48 h-48 animate-float"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="100" cy="100" r="90" fill="hsl(var(--primary) / 0.2)" />
              <path
                d="M65 80C65 71.716 71.716 65 80 65H120C128.284 65 135 71.716 135 80V120C135 128.284 128.284 135 120 135H80C71.716 135 65 128.284 65 120V80Z"
                fill="hsl(var(--secondary))"
                className="animate-pulse"
                style={{ animationDuration: "3s" }}
              />
              <circle cx="85" cy="90" r="5" fill="white" />
              <circle cx="115" cy="90" r="5" fill="white" />
              <path
                d="M90 110C90 110 95 115 100 115C105 115 110 110 110 110"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((values) => createStory.mutate(values))} className="space-y-6">
              <FormField
                control={form.control}
                name="childName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Child's Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter name..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="animal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Favorite Animal</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
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
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Story Theme</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a theme" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {storyThemes.map((theme) => (
                          <SelectItem key={theme} value={theme}>
                            {theme.charAt(0).toUpperCase() + theme.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full relative animate-glow border border-primary/50 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-background font-bold transition-all duration-500"
                disabled={createStory.isPending}
              >
                {createStory.isPending ? (
                  <div className="flex items-center justify-center">
                    <div className="mr-2">Creating Story</div>
                    <div className="flex space-x-1">
                      <span className="inline-block w-2 h-2 bg-background rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></span>
                      <span className="inline-block w-2 h-2 bg-background rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></span>
                      <span className="inline-block w-2 h-2 bg-background rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></span>
                    </div>
                  </div>
                ) : (
                  <>Generate Magical Story</>
                )}
              </Button>
              
              <div className="text-center mt-4">
                <Button
                  variant="link"
                  className="text-primary hover:text-primary/80 text-shadow-glow"
                  onClick={() => navigate("/characters")}
                >
                  Create Custom Characters →
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}