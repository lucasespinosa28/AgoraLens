import { useQuery } from "@tanstack/react-query";
import { GraphQLClient, gql } from "graphql-request";

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

async function getGroupFeed(feedAddress: string, cursor: string | null = null) {
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
  if (!result?.posts) {
    return { posts: { items: [] } };
  }
  if (!Array.isArray(result.posts.items)) {
    result.posts.items = [];
  }
  return result;
}

export function useGroupFeed(feedAddress: string, cursor: string | null = null) {
  const query = useQuery({
    queryKey: ["GroupFeed", feedAddress, cursor],
    queryFn: () => getGroupFeed(feedAddress, cursor),
    enabled: !!feedAddress,
    keepPreviousData: true,
  });
  return {
    ...query,
    isLoading: query.isLoading,
    isSuccess: query.isSuccess,
    isError: query.isError,
  };
}
