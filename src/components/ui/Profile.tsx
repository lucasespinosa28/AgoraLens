import Login from "../Login";
import Loginout from "../Loginout";
import { useAuthenticatedUser } from '@lens-protocol/react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";

type Metadata = {
    name?: string;
    bio?: string;
    picture?: string;
    coverPicture?: string;
    attributes?: Array<{ key: string; value: string }>;
};

export default function Profile({
    address,
    owner,
    createdAt,
    metadata,
}: {
    address: string;
    owner: string;
    createdAt: string;
    metadata?: Metadata;
}) {
    const { data: Authenticated } = useAuthenticatedUser();
    // Format the createdAt date
    const createdAtFormatted = createdAt
        ? new Date(createdAt).toLocaleString(undefined, {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        })
        : createdAt;
    return (
        <Card className="mr-4">
            <CardContent>
                {metadata && (
                    <div className="relative flex flex-col items-center w-full">
                        {/* Cover Image */}
                        {metadata.coverPicture && (
                            <div className="w-full flex justify-start">
                                <img
                                    src={metadata.coverPicture}
                                    alt="cover"
                                    className="w-full h-16 object-cover rounded-md"
                                />
                            </div>
                        )}
                        {/* Profile Picture - overlapping and centered above cover */}
                        {metadata.picture && (
                            <div className="absolute left-2 -bottom-2 z-10">
                                <img
                                    src={metadata.picture}
                                    alt="profile"
                                    className="w-20 h-20 rounded-full border-4 border-background object-cover shadow-lg"
                                />
                            </div>
                        )}
                        {/* Spacer for picture overlap */}
                        <div className="h-10" />
                    </div>
                )}
                <div className="mt-8 space-y-2">
                    <div className="font-semibold text-lg">{metadata?.name}</div>
                    <div className="text-sm text-muted-foreground">{metadata?.bio}</div>
                    <div className="font-mono text-xs text-muted-foreground">
                        <strong>Address:</strong> {address}
                    </div>
                    <div className="text-sm">
                        <strong>Created At:</strong> {createdAtFormatted}
                    </div>
                    {metadata?.attributes && (
                        <div>
                            <strong>Attributes:</strong>
                            <ul className="list-disc list-inside text-xs">
                                {metadata.attributes.map((attr, idx) => (
                                    <li key={idx}>
                                        {attr.key}:{" "}
                                        {attr.key === "timestamp"
                                            ? new Date(attr.value).toLocaleString(undefined, {
                                                year: "numeric",
                                                month: "short",
                                                day: "2-digit",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })
                                            : attr.value}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                </div>
            </CardContent>
            <CardFooter>
                <div className="mt-2">
                    {Authenticated ? (
                        <Loginout />
                    ) : (
                        <Login lensAddress={address} walletAddress={owner} />
                    )}
                </div>
            </CardFooter>
        </Card>
    );
}