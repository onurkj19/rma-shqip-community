import { Users, Crown, Star, UserPlus } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

const members = [
  {
    id: "1",
    name: "Ermal Hoxha",
    username: "ermali",
    avatar: "/placeholder.svg",
    role: "Admin",
    posts: 89,
    joined: "Janar 2023",
    isFollowing: false
  },
  {
    id: "2",
    name: "Driton Krasniqi",
    username: "dritonk",
    avatar: "/placeholder.svg",
    role: "Moderator",
    posts: 156,
    joined: "Shkurt 2023",
    isFollowing: true
  },
  {
    id: "3",
    name: "Albana Murati",
    username: "albanam",
    avatar: "/placeholder.svg",
    role: "Member",
    posts: 67,
    joined: "Mars 2023",
    isFollowing: false
  },
  {
    id: "4",
    name: "Andi Rexhepi",
    username: "andirex",
    avatar: "/placeholder.svg",
    role: "VIP",
    posts: 234,
    joined: "Dhjetor 2022",
    isFollowing: true
  },
  {
    id: "5",
    name: "Fitore Gashi",
    username: "fitoreg",
    avatar: "/placeholder.svg",
    role: "Member",
    posts: 45,
    joined: "Prill 2023",
    isFollowing: false
  }
];

export const MembersList = () => {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Admin":
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case "Moderator":
        return <Star className="h-4 w-4 text-blue-500" />;
      case "VIP":
        return <Star className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "Admin":
        return "destructive";
      case "Moderator":
        return "default";
      case "VIP":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Users className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Anëtarët e Komunitetit</h1>
      </div>

      <div className="grid gap-4">
        {members.map((member) => (
          <div key={member.id} className="bg-card border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{member.name}</h3>
                    {getRoleIcon(member.role)}
                  </div>
                  <p className="text-sm text-muted-foreground">@{member.username}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant={getRoleBadgeVariant(member.role)}>
                      {member.role}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {member.posts} postime
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Anëtarësuar: {member.joined}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                variant={member.isFollowing ? "outline" : "default"}
                size="sm"
                className="flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                {member.isFollowing ? "Duke ndjekur" : "Ndiq"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};