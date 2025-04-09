import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Story from "@/pages/story";
import Characters from "@/pages/characters";
import CreateCharacter from "@/pages/create-character";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/story/:id" component={Story} />
      <Route path="/characters" component={Characters} />
      <Route path="/characters/create" component={CreateCharacter} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
