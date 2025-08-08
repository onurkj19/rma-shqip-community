import { Avatar } from "@/components/ui/avatar";

interface Story {
  id: string;
  username: string;
  avatar: string;
  hasStory: boolean;
}

interface InstagramStoriesProps {
  stories: Story[];
}

export const InstagramStories = ({ stories }: InstagramStoriesProps) => {
  return (
    <div className="flex space-x-4 overflow-x-auto pb-2">
      {stories.map((story) => (
        <div key={story.id} className="flex flex-col items-center space-y-1 min-w-0">
          <div className={`relative ${story.hasStory ? 'ring-2 ring-pink-500' : ''}`}>
            <Avatar className="h-16 w-16">
              <img 
                src={story.avatar} 
                alt={story.username}
                className="h-16 w-16 rounded-full object-cover"
              />
            </Avatar>
            {story.hasStory && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <span className="text-xs text-gray-600 truncate max-w-16 text-center">
            {story.username}
          </span>
        </div>
      ))}
    </div>
  );
}; 