import { Calendar, Clock, Tv, MapPin, Trophy } from "lucide-react";
import { Badge } from "./ui/badge";

export const MatchSchedule = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Ndeshjet e Real Madrid</h1>
      </div>

      <div className="text-center py-12">
        <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Nuk ka ndeshje të programuara</h3>
        <p className="text-muted-foreground mb-4">
          Ndeshjet e Real Madrid do të shfaqen këtu kur të jenë të disponueshme.
        </p>
        <p className="text-sm text-muted-foreground">
          Për momentin, kjo funksionalitet do të shtohet në të ardhmen.
        </p>
      </div>
    </div>
  );
};