import { useEffect } from "react";
import { Switch, Route } from "wouter";
import { CommandPalette } from "@/components/command-palette";
import Home from "@/pages/home";

function Router() {
  return (
    <Switch>
      <Route path="/Portfolio-Showcase" component={Home} />
      {/* Fallback: catch-all points at the single-page portfolio */}
      <Route component={Home} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <>
      <CommandPalette />
      <Router />
    </>
  );
}

export default App;