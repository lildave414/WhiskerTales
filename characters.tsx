import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, BookOpen, UserPlus, ArrowRight } from "lucide-react";
import { getQueryFn } from "@/lib/queryClient";
import type { Character } from "@shared/schema";

export default function Characters() {
  const [, setLocation] = useLocation();
  const { data: characters, isLoading, error } = useQuery({
    queryKey: ['/api/characters'],
    queryFn: getQueryFn<Character[]>({ on401: "returnNull" }),
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary animate-glow">
              Character Gallery
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Create your own custom animal characters that can be featured in your stories!
              Each character can have unique colors, accessories, and special abilities.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocation("/")}
                className="text-primary border-primary/30"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Story Generator
              </Button>
            </div>
            <Button
              onClick={() => setLocation("/characters/create")}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-shadow-glow"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Character
            </Button>
          </div>

          <Separator className="my-6 bg-primary/20" />

          {/* Character Gallery */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border border-primary/20 bg-background/80 backdrop-blur-sm">
                  <CardHeader className="animate-pulse bg-primary/5 h-12"></CardHeader>
                  <CardContent className="h-36 animate-pulse bg-primary/10"></CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-lg border border-destructive p-6 my-6 text-center">
              <p className="text-destructive font-semibold">Failed to load characters</p>
              <p className="text-muted-foreground text-sm mt-2">Please try again later</p>
            </div>
          ) : characters && characters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {characters.map((character) => (
                <CharacterCard key={character.id} character={character} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-primary/30 rounded-lg bg-background/50 backdrop-blur-sm">
              <UserPlus className="h-12 w-12 mx-auto text-primary/40 mb-4" />
              <h3 className="text-xl font-medium mb-2">No characters yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first character to add them to your stories!
              </p>
              <Button 
                onClick={() => setLocation("/characters/create")}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              >
                Create Your First Character
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CharacterCard({ character }: { character: Character }) {
  const [, setLocation] = useLocation();
  const { customization } = character;

  return (
    <Card className="overflow-hidden border border-primary/20 transition-all duration-300 hover:border-primary/50 animate-glow">
      <CardHeader className="bg-gradient-to-r from-background to-primary/5 pb-4">
        <CardTitle className="text-xl text-shadow-glow">{character.name}</CardTitle>
        <CardDescription>{character.baseAnimal} Character</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        {customization && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                {customization.color}
              </Badge>
              <Badge variant="outline" className="bg-secondary/5 text-secondary border-secondary/20">
                {customization.personality}
              </Badge>
              {customization.appearance && (
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                  {customization.appearance.size}
                </Badge>
              )}
            </div>
            
            <div className="pt-2">
              <div className="text-sm">
                <span className="font-medium text-primary">Special Ability:</span>{" "}
                <span className="text-muted-foreground">{customization.specialAbility}</span>
              </div>
              
              {customization.accessories && customization.accessories.length > 0 && (
                <div className="text-sm mt-2">
                  <span className="font-medium text-primary">Accessories:</span>{" "}
                  <span className="text-muted-foreground">
                    {customization.accessories.join(", ")}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-gradient-to-r from-primary/5 to-background border-t border-primary/10 flex justify-between">
        <Button 
          variant="ghost" 
          size="sm"
          className="text-primary hover:text-primary/80 hover:bg-primary/5"
        >
          Edit
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="text-primary border-primary/30 hover:bg-primary/10"
          onClick={() => setLocation("/")}
        >
          Use in Story
        </Button>
      </CardFooter>
    </Card>
  );
}