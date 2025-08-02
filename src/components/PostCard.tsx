import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, MoreVertical, Flag } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
}

export const PostCard = ({ post, onLike, onComment, onShare, onReport }: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  
  // Kontrollo localStorage për avatar të ruajtur
  const savedAvatar = localStorage.getItem('user-avatar');
  const displayAvatar = savedAvatar || post.author.avatar;

  return (
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
              <p className="text-xs text-muted-foreground">@{post.author.username} · {post.timestamp}</p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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
          <div className="mb-4 rounded-lg overflow-hidden">
            <img 
              src={post.image} 
              alt="Post content" 
              className="w-full h-auto object-cover max-h-96"
            />
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
            onClick={() => {
              setShowComments(!showComments);
              onComment(post.id);
            }}
            className="flex items-center space-x-2"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs">{post.comments}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onShare(post.id)}
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
                  className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};