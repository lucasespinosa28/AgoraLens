import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { MenuIcon } from "lucide-react"
import { Link, useRouterState } from "@tanstack/react-router"
import { ConnectKitButton } from "connectkit"

export function Sidebar({ className }: { className?: string }) {
    const { location } = useRouterState()
    const links = [
        { to: "/", label: "Home" },
        { to: "/search", label: "Search groups" },
        { to: "/create", label: "Create group" },
    ]

    return (
        <aside
            className={cn(
                "hidden md:flex flex-col w-64 h-screen bg-sidebar text-sidebar-foreground border-r px-4 py-6 gap-2 fixed left-0 top-0 z-40",
                className
            )}
            data-slot="sidebar"
        >
            <div className="text-xl font-bold mb-8">AgoraLens</div>
            <nav className="flex flex-col gap-2">
                {links.map((link) => (
                    <Link
                        key={link.to}
                        to={link.to}
                        className={cn(
                            "rounded-md px-3 py-2 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                            location.pathname === link.to && "bg-sidebar-primary text-sidebar-primary-foreground font-semibold"
                        )}
                    >
                        {link.label}
                    </Link>
                ))}
                    <ConnectKitButton />
            </nav>
        </aside>
    )
}

export function SidebarMobile() {
    const { location } = useRouterState()
    const links = [
        { to: "/", label: "Home" },
        { to: "/search", label: "Search groups" },
        { to: "/create", label: "Create group" },
    ]


    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className="md:hidden p-2">
                    <MenuIcon className="size-6" />
                    <span className="sr-only">Open sidebar</span>
                </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
                <aside className="flex flex-col h-full bg-sidebar text-sidebar-foreground border-r px-4 py-6 gap-2">
                    <div className="text-xl font-bold mb-8">AgoraLens</div>
                    <nav className="flex flex-col gap-2">
                        {links.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={cn(
                                    "rounded-md px-3 py-2 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                    location.pathname === link.to && "bg-sidebar-primary text-sidebar-primary-foreground font-semibold"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                            <ConnectKitButton />
                    </nav>
                </aside>
            </SheetContent>
        </Sheet>
    )
}
