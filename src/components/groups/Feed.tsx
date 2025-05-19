import { useGroupFeed } from "@/hooks/useGroupFeed";
import ContentDisplay from "@/components/ui/ContentDisplay";

type Post = {
  id: string;
  author?: {
    metadata?: {
      name?: string;
      picture?: string;
    };
  };
  contentUri: string;
};

type GroupFeedData = {
  posts?: {
    items?: Post[];
  };
};

export default function Feed({ feedAddress }: { feedAddress: string }) {
  const { data: postsData = {}, isLoading: isPostsLoading } = useGroupFeed(feedAddress) as { data: GroupFeedData; isLoading: boolean };
  const posts = postsData.posts?.items ?? [];
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[60vh] bg-muted/40 py-8 px-2">
      {isPostsLoading && <p>Loading...</p>}
      {Array.isArray(posts) && (
        <ul className="flex flex-col gap-4 w-full max-w-2xl">
          {[...posts].reverse().map((post) => (
            <li
              key={post.id}
              className="flex flex-row items-start gap-3"
            >
              <div className="flex-shrink-0">
                {post.author?.metadata?.picture ? (
                  <img
                    src={post.author.metadata.picture}
                    alt={post.author?.metadata?.name ?? "avatar"}
                    className="w-10 h-10 rounded-full border border-border object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-lg font-bold text-accent-foreground">
                    {post.author?.metadata?.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="bg-background rounded-xl px-4 py-3 shadow-sm border border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-primary">{post.author?.metadata?.name ?? "Unknown"}</span>
                  </div>
                  <ContentDisplay contentUri={post.contentUri} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}