import { Calendar, MapPin, Clock, Users, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

const events = [
  {
    id: "1",
    title: "Real Madrid vs Barcelona - El Clasico",
    date: "2024-03-17",
    time: "21:00",
    location: "Santiago Bernabéu, Madrid",
    type: "Ndeshje",
    description: "Ndeshja më e madhe e sezonit! El Clasico në shtëpi.",
    attendees: 156,
    isAttending: true
  },
  {
    id: "2", 
    title: "Takimi i Tifozëve RMA Shqip",
    date: "2024-03-10",
    time: "19:00",
    location: "Tirana, Shqipëri",
    type: "Takim",
    description: "Takimi mujor i komunitetit të tifozëve shqiptarë të Real Madrid.",
    attendees: 45,
    isAttending: false
  },
  {
    id: "3",
    title: "Real Madrid vs Manchester City",
    date: "2024-04-09",
    time: "21:00", 
    location: "Santiago Bernabéu, Madrid",
    type: "Champions League",
    description: "Çerekfinale Champions League - ndeshja e kthimit.",
    attendees: 203,
    isAttending: true
  },
  {
    id: "4",
    title: "Festë për Ditëlindjen e Klubit",
    date: "2024-03-06",
    time: "20:00",
    location: "Online Event",
    type: "Festë",
    description: "Celebrimi i 122 vjetorit të Real Madrid.",
    attendees: 89,
    isAttending: false
  }
];

export const EventsList = () => {
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "Ndeshje":
        return "default";
      case "Champions League":
        return "destructive";
      case "Takim":
        return "secondary";
      case "Festë":
        return "outline";
      default:
        return "outline";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sq-AL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Ngjarjet e Ardhshme</h1>
      </div>

      <div className="grid gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-card border rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold">{event.title}</h3>
                  <Badge variant={getEventTypeColor(event.type)}>
                    {event.type}
                  </Badge>
                </div>
                
                <p className="text-muted-foreground mb-4">{event.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{event.time}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{event.attendees} të interesuar</span>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant={event.isAttending ? "outline" : "default"}
                    size="sm"
                  >
                    {event.isAttending ? "Duke marrë pjesë" : "Marr pjesë"}
                  </Button>
                  
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};