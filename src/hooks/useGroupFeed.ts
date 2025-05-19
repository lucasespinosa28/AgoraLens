import { useQuery } from "@tanstack/react-query";
import { GraphQLClient, gql } from "graphql-request";

type Post = {
  author: {
    metadata: {
      name?: string;
      picture?: string;
    };
    address: string;
  };
  timestamp: string;
  id: string;
  contentUri: string;
};

type GroupFeedResult = {
  posts: {
    pageInfo: {
      next?: string | null;
      prev?: string | null;
    };
    items: Post[];
  };
};

const endpoint = "https://api.lens.xyz/graphql";
const client = new GraphQLClient(endpoint);

const GROUP_FEED_QUERY = gql`
  query Posts($request: PostsRequest!) {
    posts(request: $request) {
      pageInfo {
        next
        prev
      }
      items {
        ... on Post {
          author {
            metadata {
              name
              picture
            }
            address
          }
          timestamp
          id
          contentUri
        }
      }
    }
  }
`;

async function getGroupFeed(feedAddress: string, cursor: string | null = null): Promise<GroupFeedResult> {
  const variables = {
    request: {
      pageSize: "TEN",
      cursor,
      filter: {
        feeds: [
          {
            feed: feedAddress,
          },
        ],
      },
    },
  };
  const result = await client.request(GROUP_FEED_QUERY, variables);

  // Defensive: ensure result is an object and has posts
  if (typeof result !== "object" || result === null || !("posts" in result) || !result.posts) {
    return { posts: { pageInfo: {}, items: [] } };
  }

  const posts = result.posts as GroupFeedResult["posts"];
  const items: Post[] = Array.isArray(posts?.items) ? posts.items : [];
  const pageInfo: { next?: string | null; prev?: string | null } = typeof posts?.pageInfo === "object" && posts.pageInfo !== null ? posts.pageInfo : {};

  return { posts: { pageInfo, items } };
}

export function useGroupFeed(feedAddress: string, cursor: string | null = null) {
  const query = useQuery<GroupFeedResult>({
    queryKey: ["GroupFeed", feedAddress, cursor],
    queryFn: () => getGroupFeed(feedAddress, cursor),
    enabled: !!feedAddress,
  });
  return {
    ...query,
    isLoading: query.isLoading,
    isSuccess: query.isSuccess,
    isError: query.isError,
  };
}
