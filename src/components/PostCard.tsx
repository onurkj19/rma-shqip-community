import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, MoreVertical, Flag, Edit, Trash2, Maximize2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

interface Post {
  id: string;
  author: {
    name: string;
    avatar?: string;
    username: string;
  };
  content: string;
  image?: string;
  video?: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
}

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onReport: (postId: string) => void;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
}

export const PostCard = ({ post, onLike, onComment, onShare, onReport, onEdit, onDelete }: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showFullImage, setShowFullImage] = useState(false);
  const { user: authUser, userProfile } = useAuth();
  
  // Kontrollo localStorage për avatar të ruajtur
  const savedAvatar = localStorage.getItem('user-avatar');
  const displayAvatar = savedAvatar || post.author.avatar;

  // Check if current user is the post author
  const isPostAuthor = authUser?.email === post.author.username || 
                      userProfile?.email === post.author.username;

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Tani";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return date.toLocaleDateString('sq-AL');
  };

  const handleShare = () => {
    const postUrl = `${window.location.origin}/post/${post.id}`;
    if (navigator.share) {
      navigator.share({
        title: `Post nga ${post.author.name}`,
        text: post.content,
        url: postUrl,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(postUrl);
      alert('Linku u kopjua në clipboard!');
    }
    onShare(post.id);
  };

  const handleComment = () => {
    if (commentText.trim()) {
      // TODO: Implement comment submission
      console.log('Comment submitted:', commentText);
      setCommentText("");
      onComment(post.id);
    }
  };

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto mb-4 border-0 shadow-md hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={displayAvatar} />
                <AvatarFallback className="bg-gradient-primary text-white">
                  {post.author.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-sm">{post.author.name}</h3>
                <p className="text-xs text-muted-foreground">@{post.author.username} · {formatTimestamp(post.timestamp)}</p>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isPostAuthor && onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(post.id)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Redakto
                  </DropdownMenuItem>
                )}
                {isPostAuthor && onDelete && (
                  <DropdownMenuItem onClick={() => onDelete(post.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Fshi
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onReport(post.id)}>
                  <Flag className="h-4 w-4 mr-2" />
                  Raporto
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mb-4">
            <p className="text-sm leading-relaxed">{post.content}</p>
          </div>

          {post.image && (
            <div className="mb-4 rounded-lg overflow-hidden relative group">
              <img 
                src={post.image} 
                alt="Post content" 
                className="w-full h-auto object-cover max-h-96 cursor-pointer"
                onClick={() => setShowFullImage(true)}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 bg-white/80 hover:bg-white text-black"
                  onClick={() => setShowFullImage(true)}
                >
                  <Maximize2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {post.video && (
            <div className="mb-4 rounded-lg overflow-hidden">
              <video 
                src={post.video} 
                controls 
                className="w-full h-auto object-cover max-h-96"
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLike(post.id)}
              className={`flex items-center space-x-2 ${post.isLiked ? 'text-red-500' : ''}`}
            >
              <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
              <span className="text-xs">{post.likes}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">{post.comments}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="flex items-center space-x-2"
            >
              <Share2 className="h-4 w-4" />
              <span className="text-xs">{post.shares}</span>
            </Button>
          </div>

          {showComments && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={displayAvatar} />
                  <AvatarFallback className="bg-gradient-primary text-white text-xs">
                    Ti
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Shkruaj një koment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                    className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  />
                </div>
                <Button
                  size="sm"
                  onClick={handleComment}
                  disabled={!commentText.trim()}
                >
                  Dërgo
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Full-size image modal */}
      {showFullImage && post.image && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowFullImage(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img 
              src={post.image} 
              alt="Post content" 
              className="w-full h-auto object-contain max-h-full"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white"
              onClick={() => setShowFullImage(false)}
            >
              ✕
            </Button>
          </div>
        </div>
      )}
    </>
  );
};