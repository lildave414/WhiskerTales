import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clock, BookOpen, Volume2, VolumeX } from "lucide-react";
import { Link } from "wouter";
import { type Story } from "@shared/schema";
import { useSpeech } from "@/hooks/use-speech";

export default function StoryPage() {
  const { id } = useParams<{ id: string }>();

  const { data: story, isLoading, error } = useQuery<Story>({
    queryKey: [`/api/stories/${id}`],
  });

  const { isReading, toggleReading, isSupported } = useSpeech({ 
    text: story?.content || '' 
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-foreground">Loading your magical story...</p>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardContent className="pt-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-destructive mb-4">Oops! Story Not Found</h1>
              <p className="text-muted-foreground mb-6">
                We couldn't find this magical story. Perhaps it's still being written?
              </p>
              <Link href="/">
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Story Generator
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const paragraphs = story.content.split('\n\n');

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-3xl mx-auto">
        <Card className="w-full mb-6">
          <CardContent className="p-4 flex justify-between items-center">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Create Another Story
              </Button>
            </Link>
            {isSupported ? (
              <Button
                size="lg"
                variant={isReading ? "default" : "outline"}
                onClick={toggleReading}
                className={`${isReading ? 'bg-primary text-primary-foreground shadow-lg' : ''} transition-all duration-200 hover:scale-105`}
              >
                {isReading ? (
                  <>
                    <VolumeX className="mr-2 h-5 w-5" />
                    Stop Reading
                    <span className="ml-2 text-xs opacity-70">(Press Q)</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="mr-2 h-5 w-5" />
                    Read Story Aloud
                    <span className="ml-2 text-xs opacity-70">(Press Q)</span>
                  </>
                )}
              </Button>
            ) : (
              <Button
                size="lg"
                variant="outline"
                disabled
                className="opacity-50 cursor-not-allowed"
              >
                <Volume2 className="mr-2 h-5 w-5" />
                Read Aloud Not Available
              </Button>
            )}
          </CardContent>
        </Card>
        {isReading && (
          <div className="fixed bottom-4 right-4">
            <div className="bg-primary text-primary-foreground rounded-full px-4 py-2 shadow-lg flex items-center">
              <div className="flex space-x-1 mr-2">
                <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></span>
                <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></span>
                <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></span>
              </div>
              Reading aloud...
            </div>
          </div>
        )}

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary animate-glow">
              {story.childName}'s Magical Adventure
            </CardTitle>
            <div className="flex justify-center gap-6 text-sm mt-4 text-muted-foreground">
              <div className="flex items-center border border-primary/30 px-3 py-1.5 rounded-full bg-background/50 backdrop-blur-sm">
                <Clock className="h-4 w-4 mr-2 text-primary" />
                {story.metadata?.readingTime || 0} min read
              </div>
              <div className="flex items-center border border-secondary/30 px-3 py-1.5 rounded-full bg-background/50 backdrop-blur-sm">
                <BookOpen className="h-4 w-4 mr-2 text-secondary" />
                {story.metadata?.wordCount || 0} words
              </div>
            </div>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none">
            {paragraphs.map((paragraph, index) => {
              // Check if we should insert an image after this paragraph
              const shouldInsertImage = story.metadata?.images && 
                story.metadata.images.find(img => img.position === index);
              
              return (
                <div key={index}>
                  <p className="mb-4 leading-relaxed text-primary text-shadow-glow">
                    {paragraph}
                  </p>
                  
                  {shouldInsertImage && (
                    <div className="my-8 flex justify-center">
                      <div className="relative w-64 h-64 animate-float animate-glow rounded-lg overflow-hidden border-2 border-secondary shadow-lg">
                        <img 
                          src={shouldInsertImage.src} 
                          alt={shouldInsertImage.alt} 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}