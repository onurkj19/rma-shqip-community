import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Image, Video, Smile, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface CreatePostProps {
  user?: {
    name: string;
    avatar?: string;
  };
  onSubmit: (content: string, media?: File) => void;
}

export const CreatePost = ({ user, onSubmit }: CreatePostProps) => {
  const [content, setContent] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setMediaFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setMediaPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content, mediaFile || undefined);
      setContent("");
      setMediaFile(null);
      setMediaPreview(null);
    }
  };

  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mb-6 border-0 shadow-md">
      <CardContent className="p-6">
        <div className="flex space-x-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-gradient-primary text-white">
              {user?.name?.charAt(0) || "A"}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-4">
            <Textarea
              placeholder="Çfarë po mendon për Real Madrid sot?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] resize-none border-0 shadow-none text-lg placeholder:text-muted-foreground focus-visible:ring-0"
            />

            {mediaPreview && (
              <div className="relative rounded-lg overflow-hidden border">
                {mediaFile?.type.startsWith('video/') ? (
                  <video src={mediaPreview} controls className="w-full h-auto max-h-96 object-cover" />
                ) : (
                  <img src={mediaPreview} alt="Preview" className="w-full h-auto max-h-96 object-cover" />
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={removeMedia}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex items-center space-x-3">
                <label htmlFor="image-upload">
                  <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10" asChild>
                    <div>
                      <Image className="h-5 w-5" />
                    </div>
                  </Button>
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleMediaUpload}
                  className="hidden"
                />

                <label htmlFor="video-upload">
                  <Button variant="ghost" size="icon" className="text-secondary hover:bg-secondary/10" asChild>
                    <div>
                      <Video className="h-5 w-5" />
                    </div>
                  </Button>
                </label>
                <input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  onChange={handleMediaUpload}
                  className="hidden"
                />

                <Button variant="ghost" size="icon" className="text-accent hover:bg-accent/10">
                  <Smile className="h-5 w-5" />
                </Button>
              </div>

              <Button
                variant="hero"
                onClick={handleSubmit}
                disabled={!content.trim()}
                className="px-6"
              >
                Posto
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};