import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Link } from "@tanstack/react-router";

function lensUriToHttp(uri: string) {
    if (!uri || uri.trim() === "") {
        return "/default-group-icon.png";
    }
    return uri.startsWith("lens://")
        ? "https://api.grove.storage/" + uri.replace("lens://", "")
        : uri;
}

function formatTimestamp(ts: string) {
    if (!ts) return "";
    const d = new Date(ts);
    return d.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function GroupCard({icon, name, description, timestamp, address }: { icon: string, name: string, description: string, address: string, timestamp: string }) {
    return (
        <Link key={address} to={"/group/" + address} className="block w-full">
            <Card className="flex flex-col gap-0 p-0 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row mt-4 items-center gap-4 pb-2">
                    <Avatar className="w-16 h-16">
                        <AvatarImage src={lensUriToHttp(icon)} alt={name} />
                        <AvatarFallback>{name?.slice(0,2).toUpperCase() ?? "CN"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <CardTitle className="text-lg font-semibold">{name}</CardTitle>
                        <CardDescription className="text-xs text-muted-foreground break-all">{address}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="pt-0 pb-2">
                    <div className="text-sm text-foreground mb-2">{description}</div>
                </CardContent>
            </Card>
        </Link>
    )
}