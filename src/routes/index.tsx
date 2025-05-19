import { createFileRoute } from '@tanstack/react-router'
import { useAccount } from 'wagmi';
import { useAuthenticatedUser } from '@lens-protocol/react';
import ManagedBy from '@/components/groups/ManagedBy';
import AccountsAvailable from '@/components/AccountsAvailable';
import Member from '@/components/groups/Member';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const { isConnected, address } = useAccount();
  const { data: Authenticated } = useAuthenticatedUser();

  return (
    <main className="container mx-auto py-8 px-4">
      {!isConnected && (
        <Alert variant="destructive" className="mb-6 max-w-lg mx-auto">
          <AlertTitle>Wallet not connected</AlertTitle>
          <AlertDescription>
            Connect your wallet to continue.
          </AlertDescription>
        </Alert>
      )}
      <div className="flex flex-col gap-8">
        {address && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Accounts Available</h2>
            <AccountsAvailable address={address} />
          </section>
        )}
        {Authenticated && isConnected && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-semibold mb-4">Groups I Own</h2>
              <ManagedBy lensAddress={Authenticated.address} />
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4">Groups I Am Member</h2>
              <Member lensAddress={Authenticated.address} />
            </div>
          </section>
        )}
      </div>
    </main>
  );
}