import Feed from '@/components/groups/Feed';
import SendPost from '@/components/groups/SendPost';
import lensUrl from '@/utils/lensUrl';
import { evmAddress, useAuthenticatedUser, useGroup } from '@lens-protocol/react';
import { createFileRoute } from '@tanstack/react-router'
import { Card } from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export const Route = createFileRoute('/group/$groupAddress')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: Authenticated } = useAuthenticatedUser();
  const { groupAddress } = Route.useParams()
  const { data, loading } = useGroup({ group: evmAddress(groupAddress) });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <span className="animate-spin rounded-full border-4 border-muted border-t-primary h-10 w-10 mr-3"></span>
        <span className="text-lg font-medium text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (!data) return null;
  console.log(data.owner)
  console.log(Authenticated?.address)
  console.log(`${data.owner} !== ${Authenticated?.address}`)
  return (
    <div className="containerflex flex-col">
      {/* Banner */}
      <div className="overflow-hidden ">
        <div className="relative w-full">
          {/* Cover */}
          {data.metadata?.coverPicture ? (
            <img
              src={lensUrl(data.metadata.coverPicture)}
              alt="cover"
              className="w-full h-40 object-cover"
            />
          ) : null}
          {/* Icon and Name */}
          {data.metadata?.coverPicture && (
            <div
              className={`absolute left-6 bottom-0 flex items-end gap-4 w-full pb-4`}
            >
              <Card className="flex flex-row items-end gap-4 px-4 py-3 shadow-lg border border-border bg-background/90">
                {data.metadata?.icon && (
                  <img
                    src={lensUrl(data.metadata.icon)}
                    alt="icon"
                    className="w-24 h-24 rounded-full border-4 border-background shadow-lg bg-background"
                    style={{ zIndex: 2 }}
                  />
                )}
                <div className="flex flex-col justify-end ml-2">
                  <span className="text-3xl font-bold text-primary drop-shadow">{data.metadata?.name}</span>
                  <span className="text-base text-muted-foreground mt-2">{data.metadata?.description}</span>
                  {data.owner && Authenticated?.address && data.owner.toLowerCase() !== Authenticated.address.toLowerCase() && (
                    <button className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/80 transition">
                      Join to group
                    </button>
                  )}
                </div>
              </Card>
            </div>
          )}
          {/* If no cover, show icon and name without Card and absolute */}
          {!data.metadata?.coverPicture && (
            <div className="flex items-end gap-4 w-full pb-4 mt-8">
              {data.metadata?.icon && (
                <img
                  src={lensUrl(data.metadata.icon)}
                  alt="icon"
                  className="w-24 h-24 rounded-full border-4 border-background shadow-lg bg-background"
                  style={{ zIndex: 2 }}
                />
              )}
              <div className="flex flex-col justify-end ml-2">
                <span className="text-3xl font-bold text-primary drop-shadow">{data.metadata?.name}</span>
                <span className="text-base text-muted-foreground mt-2">{data.metadata?.description}</span>
                {/* {data.owner != Authenticated?.address && (
                  // <button className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/80 transition">
                  //   Join to group
                  // </button>
                )} */}
              </div>
            </div>
          )}
        </div>
      </div>
      <Tabs defaultValue="chat" className="w-full mt-8">
        <TabsList className="flex w-full bg-muted rounded-lg p-1 mb-4 gap-2">
          <TabsTrigger
            value="chat"
            className="flex-1 data-[state=active]:bg-background data-[state=active]:text-primary rounded-md px-4 py-2 text-base font-medium transition"
          >
            Chat
          </TabsTrigger>
          <TabsTrigger
            value="members"
            className="flex-1 data-[state=active]:bg-background data-[state=active]:text-primary rounded-md px-4 py-2 text-base font-medium transition"
          >
            Members
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="flex-1 data-[state=active]:bg-background data-[state=active]:text-primary rounded-md px-4 py-2 text-base font-medium transition"
          >
            Settings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="chat" className="mt-0">
          <Feed feedAddress={data.feed?.address} />
          <SendPost feedAddress={data.feed?.address} />
        </TabsContent>
        <TabsContent value="settings" className="mt-0">
          <p>Settings</p>
        </TabsContent>
        <TabsContent value="members" className="mt-0">
          <p>Members</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
