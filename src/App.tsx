import { useAccount } from 'wagmi';
import { ConnectKitButton } from 'connectkit'
import AccountsAvailable from './components/AccountsAvailable';
import { useAuthenticatedUser } from '@lens-protocol/react';
import Search from './components/groups/Search';
import ManagedBy from './components/groups/ManagedBy';
import Member from './components/groups/Member';
import CreateGroup from './components/groups/CreateGroup';

function App() {
  const { isConnected, address } = useAccount();
  const { data: Authenticated } = useAuthenticatedUser();
  return (
    <main>
      <h1>Lens Group Creator & Account Info</h1>
      <ConnectKitButton />
      {!isConnected && <p>Connect your wallet to continue.</p>}
      {Authenticated && (
        <div>
          <h2>Authenticated User</h2>
          <p>Lens Address: {Authenticated.address}</p>
          <h2>Group i am owner</h2>
          <ManagedBy lensAddress={Authenticated.address} />
          <h2>Group i am member</h2>
          <Member lensAddress={Authenticated.address} />
          <h2>Group create</h2>
          <CreateGroup />
        </div>
      )}
      {address && (
        <>
          <AccountsAvailable address={address} />
          <Search />
        </>

      )}
    </main>
  );
}

export default App
