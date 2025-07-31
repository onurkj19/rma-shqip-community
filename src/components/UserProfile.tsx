import { User, Edit, Settings, Heart, MessageCircle, Share } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { PostCard } from "./PostCard";

interface UserProfileProps {
  user: {
    name: string;
    username: string;
    avatar: string;
    isAdmin: boolean;
  };
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onReport: (postId: string) => void;
}

const userStats = {
  posts: 45,
  followers: 234,
  following: 89,
  joinDate: "Janar 2023"
};

const userPosts = [
  {
    id: "p1",
    author: {
      name: "Ermal Hoxha",
      avatar: "/placeholder.svg",
      username: "ermali"
    },
    content: "Sot është një ditë e bukur për t'u mbështetur Real Madrid! Hala Madrid! ⚪👑",
    timestamp: "2 orë më parë",
    likes: 23,
    comments: 8,
    shares: 3,
    isLiked: true
  },
  {
    id: "p2",
    author: {
      name: "Ermal Hoxha",
      avatar: "/placeholder.svg",
      username: "ermali"
    },
    content: "Modric është dhe do të mbetet legjenda më e madhe e mesfushës! 🐐",
    timestamp: "1 ditë më parë",
    likes: 67,
    comments: 15,
    shares: 12,
    isLiked: false
  }
];

export const UserProfile = ({ user, onLike, onComment, onShare, onReport }: UserProfileProps) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <User className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Profili Im</h1>
      </div>

      {/* Profile Header */}
      <div className="bg-card border rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                {user.isAdmin && <Badge variant="destructive">Admin</Badge>}
              </div>
              <p className="text-muted-foreground mb-2">@{user.username}</p>
              <p className="text-sm text-muted-foreground">
                Anëtar që nga {userStats.joinDate}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Ndrysho Profilin
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold">{userStats.posts}</div>
            <div className="text-sm text-muted-foreground">Postime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{userStats.followers}</div>
            <div className="text-sm text-muted-foreground">Ndjekës</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{userStats.following}</div>
            <div className="text-sm text-muted-foreground">Duke ndjekur</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Heart className="h-5 w-5 text-red-500" />
              <span className="text-xl font-bold">Real Madrid</span>
            </div>
            <div className="text-sm text-muted-foreground">Ekipi i zemrës</div>
          </div>
        </div>
      </div>

      {/* User Posts */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Postimet e Mia</h3>
        <div className="space-y-6">
          {userPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={onLike}
              onComment={onComment}
              onShare={onShare}
              onReport={onReport}
            />
          ))}
        </div>
      </div>
    </div>
  );
};