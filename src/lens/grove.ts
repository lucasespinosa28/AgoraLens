import { StorageClient } from "@lens-chain/storage-client";
import { chains } from "@lens-chain/sdk/viem";
import { immutable } from "@lens-chain/storage-client";


const storageClient = StorageClient.create();
const acl = immutable(chains.mainnet.id);
export { storageClient, acl };