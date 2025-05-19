/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAccountsAvailable } from "@lens-protocol/react";
import React from "react";
import Profile from "./ui/Profile";

function AccountsAvailableComponent({ address }: { address: string }) {
  const { data, loading } = useAccountsAvailable({ managedBy: address });
  if (loading) return <p>Loading...</p>;
  if (!data) return <p>No accounts available</p>;
  return (
    <div className="flex flex-row w-full max-w-sm items-center space-y-2">
      {data.items.map((item: any) => (
       <Profile key={item.account.address} address={item.account.address} owner={item.account.owner} createdAt={item.account.createdAt} metadata={item.account.metadata} />
      ))}
    </div>
  );
}

const AccountsAvailable = React.memo(AccountsAvailableComponent);

export default AccountsAvailable;
