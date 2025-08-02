import { Users, Crown, Star, UserPlus } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

export const MembersList = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Users className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Anëtarët e Komunitetit</h1>
      </div>

      <div className="text-center py-12">
        <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Nuk ka anëtarë të regjistruar</h3>
        <p className="text-muted-foreground mb-4">
          Anëtarët do të shfaqen këtu kur të regjistrohen në platformë.
        </p>
        <p className="text-sm text-muted-foreground">
          Për momentin, kjo funksionalitet do të shtohet në të ardhmen.
        </p>
      </div>
    </div>
  );
};