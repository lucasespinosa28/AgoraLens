import type { FragmentOf } from "@lens-protocol/client";
import { AccountFragment, AccountMetadataFragment } from "./accounts";

// Extend the Lens SDK types

declare module "@lens-protocol/client" {
  export interface Account extends FragmentOf<typeof AccountFragment> {}
  export interface AccountMetadata extends FragmentOf<typeof AccountMetadataFragment> {}
}

export const fragments = [AccountFragment]; 