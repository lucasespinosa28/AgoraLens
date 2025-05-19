import { useState } from "react";
import { group as groupMetadataBuilder } from "@lens-protocol/metadata";
import { storageClient, acl } from "@/lens/grove";
import { useSessionClient } from '@lens-protocol/react';
import { uri } from "@lens-protocol/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { handleOperationWith } from "@lens-protocol/react/viem";
import { useWalletClient } from "wagmi";
import { useCreateGroup } from "@/hooks/useCreateGroup";

export default function CreateGroup() {
  const { data: session } = useSessionClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  const { data: walletClient } = useWalletClient();
  const { execute, loading, data: result, error: createError } = useCreateGroup(
    handleOperationWith(walletClient)
  );

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setIcon(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setIconPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setIcon(null);
      setIconPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      let iconUri: string | undefined = undefined;
      if (icon) {
        console.log("Uploading icon...");
        const iconUpload = await storageClient.uploadFile(icon, { acl });
        iconUri = iconUpload.uri;
        console.log("Icon uploaded:", iconUri);
      }

      // Build group metadata
      const metadata = groupMetadataBuilder({
        name,
        description,
        icon: iconUri,
      });

      // Upload metadata as JSON
      console.log("Uploading metadata JSON...");
      const { uri: uploadedUri } = await storageClient.uploadAsJson(metadata, { acl });
      console.log("Metadata uploaded:", uploadedUri);

      // Create group on Lens
      if (!session) throw new Error("Not authenticated");
      console.log("Calling execute to create group...");
      const result = await execute({ metadataUri: uri(uploadedUri) });

      if (result.isErr()) {
        console.error("Group creation failed:", result.error);
        setError(result.error && typeof result.error === "object" && "message" in result.error
          ? ((result.error as { message?: string }).message || String(result.error))
          : String(result.error));
      } else {
        console.log("Group creation result:", result.value);
      }
      // Success handled by hook's data
    } catch (err) {
      console.error("Error in group creation:", err);
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex m-4 flex-col gap-4 max-w-md mx-auto p-4 border rounded">
      <h2 className="text-xl font-bold">Create New Group</h2>
      <Input
        type="text"
        placeholder="Group Name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <Textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        required
      />
      <Input
        type="file"
        accept="image/*"
        onChange={handleIconChange}
      />
      {iconPreview && (
        <img
          src={iconPreview}
          alt="Group Icon Preview"
          className="w-24 h-24 object-cover rounded border mx-auto"
        />
      )}
      <Button type="submit" disabled={loading || !session}>
        {loading ? "Creating..." : "Create Group"}
      </Button>
      {!session && <div className="text-red-500">You must be authenticated to create a group.</div>}
      {error && <div className="text-red-500">Error: {error}</div>}
      {createError && <div className="text-red-500">Error: {createError.message || String(createError)}</div>}
      {loading && <div className="text-yellow-600">Waiting for transaction confirmation...</div>}
      {result && (
        <div className="text-green-600">
          <div>Group created!</div>
          <pre className="text-xs">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </form>
  );
}