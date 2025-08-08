import { useState } from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface InstagramPostProps {
  post: {
    id: string;
    author: {
      name: string;
      avatar: string;
      username: string;
    };
    content: string;
    image?: string;
    timestamp: string;
    likes: number;
    comments: number;
    shares: number;
    isLiked: boolean;
    isSaved: boolean;
  };
  currentUser?: {
    name: string;
    avatar?: string;
    username?: string;
  } | null;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onReport: (postId: string) => void;
  onEdit: (postId: string) => void;
  onDelete: (postId: string) => void;
}

export const InstagramPost = ({ 
  post, 
  currentUser, 
  onLike, 
  onComment, 
  onShare, 
  onReport, 
  onEdit, 
  onDelete 
}: InstagramPostProps) => {
  const [showFullImage, setShowFullImage] = useState(false);
  const [commentText, setCommentText] = useState("");
  const isPostAuthor = currentUser?.username === post.author.username;

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const handleComment = () => {
    if (commentText.trim()) {
      onComment(post.id);
      setCommentText("");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${post.author.name} në Instagram`,
        text: post.content,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
    onShare(post.id);
  };

  return (
    <div className="bg-white">
      {/* Post Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <img 
              src={post.author.avatar} 
              alt={post.author.name}
              className="h-8 w-8 rounded-full object-cover"
            />
          </Avatar>
          <div>
            <p className="text-sm font-semibold">{post.author.username}</p>
            <p className="text-xs text-gray-500">{post.timestamp}</p>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="p-1">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {isPostAuthor ? (
              <>
                <DropdownMenuItem onClick={() => onEdit(post.id)}>
                  Redakto
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(post.id)} className="text-red-600">
                  Fshi
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem onClick={() => onReport(post.id)}>
                Raporto
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Post Image */}
      {post.image && (
        <div className="relative">
          <img 
            src={post.image} 
            alt="Post"
            className="w-full max-h-96 object-cover cursor-pointer"
            onClick={() => setShowFullImage(true)}
          />
        </div>
      )}

      {/* Post Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-1"
              onClick={() => onLike(post.id)}
            >
              <Heart className={`h-6 w-6 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button variant="ghost" size="sm" className="p-1">
              <MessageCircle className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="sm" className="p-1" onClick={handleShare}>
              <Share2 className="h-6 w-6" />
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="p-1">
            <Bookmark className={`h-6 w-6 ${post.isSaved ? 'fill-black' : ''}`} />
          </Button>
        </div>

        {/* Likes Count */}
        <p className="text-sm font-semibold mb-2">
          {formatNumber(post.likes)} pëlqime
        </p>

        {/* Post Content */}
        <div className="mb-2">
          <span className="text-sm font-semibold mr-2">{post.author.username}</span>
          <span className="text-sm">{post.content}</span>
        </div>

        {/* Comments Count */}
        {post.comments > 0 && (
          <p className="text-sm text-gray-500 mb-2">
            Shiko të gjitha {formatNumber(post.comments)} komentet
          </p>
        )}

        {/* Add Comment */}
        <div className="flex items-center space-x-2 mt-3">
          <input
            type="text"
            placeholder="Shto një koment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleComment()}
            className="flex-1 text-sm border-none outline-none"
          />
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-blue-500 font-semibold disabled:opacity-50"
            disabled={!commentText.trim()}
            onClick={handleComment}
          >
            Dërgo
          </Button>
        </div>
      </div>

      {/* Full Size Image Modal */}
      {showFullImage && post.image && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <div className="relative max-w-4xl max-h-full">
            <img 
              src={post.image} 
              alt="Post"
              className="max-w-full max-h-full object-contain"
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-4 right-4 text-white"
              onClick={() => setShowFullImage(false)}
            >
              ✕
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}; 