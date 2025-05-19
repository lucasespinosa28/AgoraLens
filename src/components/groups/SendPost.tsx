import { useState } from "react";
import { textOnly } from "@lens-protocol/metadata";
import { storageClient } from "@/lens/grove"; // adjust path as needed
import { evmAddress, uri } from "@lens-protocol/react";
import { handleOperationWith } from "@lens-protocol/react/viem";
import { useWalletClient } from "wagmi";
import { useCreatePost } from "@lens-protocol/react";
import { ImageIcon } from "lucide-react";

export default function SendPost({ feedAddress }: { feedAddress: string }) {
    const [content, setContent] = useState("");
    const [error, setError] = useState<string | null>(null);

    const { data: walletClient } = useWalletClient();
    const { execute, loading, data: result } = useCreatePost(
        handleOperationWith(walletClient)
    );

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        try {
            // 1. Create metadata
            const metadata = textOnly({ content });
            // 2. Upload metadata to storage using storageClient
            const { uri: uploadedUri } = await storageClient.uploadAsJson(metadata);
            // 3. Create the post on the custom feed using useCreatePost
            await execute({
                contentUri: uri(uploadedUri),
                feed: evmAddress(feedAddress),
            });
            // Reset form after successful post
            setContent("");
        } catch (err) {
            setError((err as Error)?.message || "Failed to post");
        }
    }
    console.log("result", result);
    console.log("walletClient", walletClient);
    return (
        <div className="flex flex-col items-center  w-full  bg-muted/40  px-2">
           <div className="flex flex-col items-center w-full bg-muted/40 px-2">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-2 w-full max-w-2xl mx-auto bg-background rounded-xl px-4 py-3 shadow-sm border border-border mt-4"
            >
                <div className="flex items-center gap-2">
                    <textarea
                        className="border rounded p-2 bg-muted flex-1"
                        placeholder="Write your post..."
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        rows={4}
                        required
                    />
                    <button
                        type="button"
                        className="p-2 rounded hover:bg-muted transition"
                        title="Add image"
                    >
                        <ImageIcon className="w-6 h-6 text-muted-foreground" />
                    </button>
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                    disabled={loading || !content.trim()}
                >
                   Send message
                </button>
                {error && <div className="text-red-600">{error}</div>}
                {result && <div className="text-green-600">Post submitted!</div>}
            </form>
        </div>
        </div>
    );
}
