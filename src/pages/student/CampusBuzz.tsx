import { useState } from "react";
import { buzzPosts, trendingTags } from "@/data/mockData";
import { Heart, MessageCircle, Share2, Bookmark, Flag, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const typeLabels: Record<string, string> = {
  news: "📰 News", discussion: "💬 Discussion", achievement: "🎉 Achievement", moments: "📸 Moments",
  event: "🎊 Event", gossip: "💭 Fun", academic: "🎓 Academic", collaboration: "🤝 Collab",
  "shout-out": "🏆 Shout-Out", incident: "⚠️ Incident",
};

const CampusBuzz = () => {
  const [newPost, setNewPost] = useState("");
  const [postType, setPostType] = useState("discussion");
  const [confirmed18, setConfirmed18] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const handlePost = () => {
    if (!confirmed18) {
      toast({ title: "Content Check Required", description: "Please confirm the post is college-appropriate.", variant: "destructive" });
      return;
    }
    if (!newPost.trim()) return;
    toast({ title: "Posted!", description: "Your post is now live on Campus Buzz." });
    setNewPost("");
    setConfirmed18(false);
  };

  const toggleLike = (id: number) => {
    setLikedPosts((prev) => { 
      const s = new Set(prev); 
      if (s.has(id)) { s.delete(id); } else { s.add(id); } 
      return s; 
    });
  };
  const toggleSave = (id: number) => {
    setSavedPosts((prev) => { 
      const s = new Set(prev); 
      if (s.has(id)) { s.delete(id); } else { s.add(id); } 
      return s; 
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Campus Buzz</h1>
        <p className="text-sm text-muted-foreground">What's happening at NIT Durgapur</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="scroll-reveal rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {Object.entries(typeLabels).slice(0, 5).map(([key, label]) => (
                <button key={key} onClick={() => setPostType(key)} className={`px-2.5 py-1 rounded-full text-xs whitespace-nowrap transition-all ${postType === key ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}>
                  {label}
                </button>
              ))}
            </div>
            <Textarea placeholder="What's on your mind?" value={newPost} onChange={(e) => setNewPost(e.target.value)} className="bg-muted/30 resize-none" rows={3} />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                <Checkbox checked={confirmed18} onCheckedChange={(v) => setConfirmed18(v === true)} />
                I confirm this post is college-appropriate
              </label>
              <Button size="sm" onClick={handlePost} disabled={!newPost.trim()}>
                <Send className="h-4 w-4 mr-1" /> Post
              </Button>
            </div>
          </div>

          {buzzPosts.map((post, i) => (
            <div key={post.id} className="scroll-reveal rounded-xl border border-border bg-card p-4" style={{ transitionDelay: `${i * 70}ms` }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{post.avatar}</div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{post.author}</p>
                  <p className="text-xs text-muted-foreground">{post.time} · {typeLabels[post.type] || post.type}</p>
                </div>
              </div>
              <p className="text-sm text-foreground whitespace-pre-line mb-3">{post.content}</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {post.hashtags.map((tag) => <Badge key={tag} variant="secondary" className="text-xs">#{tag}</Badge>)}
              </div>
              <div className="flex items-center gap-4 text-muted-foreground">
                <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-1 text-xs hover:text-primary transition-colors ${likedPosts.has(post.id) ? "text-primary" : ""}`}>
                  <Heart className={`h-5 w-5 ${likedPosts.has(post.id) ? "fill-primary" : ""}`} /> {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                </button>
                <button className="flex items-center gap-1 text-xs hover:text-primary transition-colors"><MessageCircle className="h-5 w-5" /> {post.comments}</button>
                <button className="flex items-center gap-1 text-xs hover:text-primary transition-colors"><Share2 className="h-5 w-5" /> Share</button>
                <button onClick={() => toggleSave(post.id)} className={`flex items-center gap-1 text-xs hover:text-primary transition-colors ${savedPosts.has(post.id) ? "text-primary" : ""}`}>
                  <Bookmark className={`h-5 w-5 ${savedPosts.has(post.id) ? "fill-primary" : ""}`} />
                </button>
                <button className="flex items-center gap-1 text-xs hover:text-status-danger transition-colors ml-auto"><Flag className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="scroll-reveal rounded-xl border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">🔥 Trending Now</h3>
            <div className="space-y-2.5">
              {trendingTags.map((tag) => (
                <div key={tag.tag} className="flex items-center justify-between">
                  <span className="text-sm text-primary font-medium cursor-pointer hover:underline">{tag.tag}</span>
                  <span className="text-xs text-muted-foreground">{tag.count >= 1000 ? `${(tag.count / 1000).toFixed(1)}K` : tag.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampusBuzz;
