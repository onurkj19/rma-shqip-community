import { PostCard } from "./PostCard";
import { TrendingUp, Clock, Users } from "lucide-react";

const trendingPosts = [
  {
    id: "t1",
    author: {
      name: "Ardit Murati",
      avatar: "/placeholder.svg",
      username: "arditm"
    },
    content: "Ky sezon Real Madrid po luan më mirë se kurrë! Mbappé dhe Vinicius janë të parezistueshëm! 🔥⚪",
    timestamp: "3 orë më parë",
    likes: 156,
    comments: 45,
    shares: 23,
    isLiked: false,
    trending: true
  },
  {
    id: "t2",
    author: {
      name: "Elena Krasniqi",
      avatar: "/placeholder.svg",
      username: "elenak"
    },
    content: "Modric në moshën 39 vjeç ende po kontrollon mesfushën si një magjistër! Respekt për Kapiten! 👑",
    timestamp: "5 orë më parë",
    likes: 203,
    comments: 67,
    shares: 34,
    isLiked: true,
    trending: true
  },
  {
    id: "t3",
    author: {
      name: "Flamur Berisha",
      avatar: "/placeholder.svg",
      username: "flamurb"
    },
    content: "Champions League këtë viti duhet të jetë yni! Hala Madrid! 🏆⚪",
    timestamp: "1 ditë më parë",
    likes: 89,
    comments: 28,
    shares: 12,
    isLiked: false,
    trending: true
  }
];

interface TrendingPostsProps {
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onReport: (postId: string) => void;
}

export const TrendingPosts = ({ onLike, onComment, onShare, onReport }: TrendingPostsProps) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Postimet në Tendencë</h1>
      </div>
      
      <div className="grid gap-4 mb-6">
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">24 orët e fundit</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Më të pëlqyerat</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {trendingPosts.map((post) => (
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
  );
};