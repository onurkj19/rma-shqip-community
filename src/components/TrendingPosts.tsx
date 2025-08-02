import { PostCard } from "./PostCard";
import { TrendingUp, Clock, Users } from "lucide-react";
import { useState, useEffect } from "react";

interface TrendingPostsProps {
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onReport: (postId: string) => void;
}

export const TrendingPosts = ({ onLike, onComment, onShare, onReport }: TrendingPostsProps) => {
  const [trendingPosts, setTrendingPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrendingPosts = () => {
      try {
        const savedPosts = localStorage.getItem('rma-posts');
        if (savedPosts) {
          const allPosts = JSON.parse(savedPosts);
          // Rendit postimet sipas likes dhe merr top 5
          const sortedPosts = allPosts
            .sort((a: any, b: any) => b.likes - a.likes)
            .slice(0, 5);
          setTrendingPosts(sortedPosts);
        } else {
          setTrendingPosts([]);
        }
      } catch (error) {
        console.error('Error loading trending posts:', error);
        setTrendingPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadTrendingPosts();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Postimet në Tendencë</h1>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Duke ngarkuar...</p>
        </div>
      </div>
    );
  }

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

      {trendingPosts.length === 0 ? (
        <div className="text-center py-8">
          <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nuk ka postime në tendencë</h3>
          <p className="text-muted-foreground">Bëj postimin tënd të parë për ta parë këtu!</p>
        </div>
      ) : (
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
      )}
    </div>
  );
};