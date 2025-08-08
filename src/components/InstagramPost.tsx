import { useState } from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Share2, Crown } from "lucide-react";
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
        title: `${post.author.name} në RMA Shqip`,
        text: post.content,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
    onShare(post.id);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <img 
                src={post.author.avatar} 
                alt={post.author.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            </Avatar>
            {post.author.username === 'real_madrid' && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                <Crown className="w-2 h-2 text-white" />
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{post.author.username}</p>
            <p className="text-xs text-gray-500">{post.timestamp}</p>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100 rounded-xl">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {isPostAuthor ? (
              <>
                <DropdownMenuItem onClick={() => onEdit(post.id)} className="cursor-pointer">
                  <span className="text-sm">Redakto</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(post.id)} className="cursor-pointer text-red-600">
                  <span className="text-sm">Fshi</span>
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem onClick={() => onReport(post.id)} className="cursor-pointer">
                <span className="text-sm">Raporto</span>
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
            className="w-full max-h-96 object-cover cursor-pointer transition-transform hover:scale-105"
            onClick={() => setShowFullImage(true)}
          />
        </div>
      )}

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              onClick={() => onLike(post.id)}
            >
              <Heart className={`h-6 w-6 ${post.isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <MessageCircle className="h-6 w-6 text-gray-600" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              onClick={handleShare}
            >
              <Share2 className="h-6 w-6 text-gray-600" />
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <Bookmark className={`h-6 w-6 ${post.isSaved ? 'fill-gray-900 text-gray-900' : 'text-gray-600'}`} />
          </Button>
        </div>

        {/* Likes Count */}
        <p className="text-sm font-semibold text-gray-900 mb-3">
          {formatNumber(post.likes)} pëlqime
        </p>

        {/* Post Content */}
        <div className="mb-3">
          <span className="text-sm font-semibold text-gray-900 mr-2">{post.author.username}</span>
          <span className="text-sm text-gray-700">{post.content}</span>
        </div>

        {/* Comments Count */}
        {post.comments > 0 && (
          <p className="text-sm text-gray-500 mb-4 cursor-pointer hover:text-gray-700">
            Shiko të gjitha {formatNumber(post.comments)} komentet
          </p>
        )}

        {/* Add Comment */}
        <div className="flex items-center space-x-3 pt-3 border-t border-gray-100">
          <input
            type="text"
            placeholder="Shto një koment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleComment()}
            className="flex-1 text-sm border-none outline-none bg-transparent placeholder-gray-400"
          />
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-blue-600 font-semibold hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="absolute top-4 right-4 text-white hover:bg-white/20"
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