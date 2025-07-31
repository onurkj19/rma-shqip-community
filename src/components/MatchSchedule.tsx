import { Calendar, Clock, Tv, MapPin, Trophy } from "lucide-react";
import { Badge } from "./ui/badge";

const matches = [
  {
    id: "1",
    homeTeam: "Real Madrid",
    awayTeam: "Barcelona",
    competition: "La Liga",
    date: "2024-03-17",
    time: "21:00",
    venue: "Santiago Bernabéu",
    status: "upcoming",
    tvChannel: "ESPN",
    homeScore: null,
    awayScore: null
  },
  {
    id: "2",
    homeTeam: "Atletico Madrid", 
    awayTeam: "Real Madrid",
    competition: "La Liga",
    date: "2024-03-10",
    time: "16:15",
    venue: "Wanda Metropolitano",
    status: "finished",
    tvChannel: "ESPN",
    homeScore: 1,
    awayScore: 2
  },
  {
    id: "3",
    homeTeam: "Real Madrid",
    awayTeam: "Manchester City",
    competition: "Champions League",
    date: "2024-04-09",
    time: "21:00",
    venue: "Santiago Bernabéu",
    status: "upcoming",
    tvChannel: "CBS Sports",
    homeScore: null,
    awayScore: null
  },
  {
    id: "4",
    homeTeam: "Valencia",
    awayTeam: "Real Madrid", 
    competition: "La Liga",
    date: "2024-03-02",
    time: "20:00",
    venue: "Mestalla",
    status: "finished",
    tvChannel: "ESPN",
    homeScore: 0,
    awayScore: 3
  }
];

export const MatchSchedule = () => {
  const getCompetitionColor = (competition: string) => {
    switch (competition) {
      case "Champions League":
        return "destructive";
      case "La Liga":
        return "default";
      case "Copa del Rey":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge variant="outline">E ardhshme</Badge>;
      case "live":
        return <Badge variant="destructive">Live</Badge>;
      case "finished":
        return <Badge variant="secondary">Përfunduar</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sq-AL', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const isRealMadridHome = (homeTeam: string) => homeTeam === "Real Madrid";

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Ndeshjet e Real Madrid</h1>
      </div>

      <div className="grid gap-4">
        {matches.map((match) => (
          <div key={match.id} className="bg-card border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Badge variant={getCompetitionColor(match.competition)}>
                  {match.competition}
                </Badge>
                {getStatusBadge(match.status)}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(match.date)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{match.time}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4 flex-1">
                <div className={`text-center flex-1 ${isRealMadridHome(match.homeTeam) ? 'font-bold text-primary' : ''}`}>
                  <div className="text-lg font-semibold">{match.homeTeam}</div>
                  {match.status === "finished" && (
                    <div className="text-2xl font-bold">{match.homeScore}</div>
                  )}
                </div>
                
                <div className="text-center px-4">
                  <div className="text-muted-foreground">vs</div>
                </div>
                
                <div className={`text-center flex-1 ${!isRealMadridHome(match.homeTeam) ? 'font-bold text-primary' : ''}`}>
                  <div className="text-lg font-semibold">{match.awayTeam}</div>
                  {match.status === "finished" && (
                    <div className="text-2xl font-bold">{match.awayScore}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{match.venue}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Tv className="h-4 w-4" />
                <span>{match.tvChannel}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};