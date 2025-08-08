import { useState } from "react";
import { InstagramStories } from "./InstagramStories";
import { InstagramPost } from "./InstagramPost";
import { CreatePost } from "./CreatePost";

interface InstagramFeedProps {
  posts: any[];
  stories: any[];
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

export const InstagramFeed = ({ 
  posts, 
  stories, 
  currentUser, 
  onLike, 
  onComment, 
  onShare, 
  onReport, 
  onEdit, 
  onDelete 
}: InstagramFeedProps) => {
  const [showCreatePost, setShowCreatePost] = useState(false);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Stories */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <InstagramStories stories={stories} />
      </div>

      {/* Create Post */}
      {currentUser && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
          <CreatePost 
            user={currentUser} 
            onSubmit={(content, media) => {
              // Handle post creation
              console.log('Creating post:', content, media);
              setShowCreatePost(false);
            }}
          />
        </div>
      )}

      {/* Posts */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white border border-gray-200 rounded-lg">
            <InstagramPost
              post={post}
              currentUser={currentUser}
              onLike={onLike}
              onComment={onComment}
              onShare={onShare}
              onReport={onReport}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        ))}
      </div>
    </div>
  );
}; 