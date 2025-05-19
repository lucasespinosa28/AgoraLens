/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGroups } from '@lens-protocol/react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type OrderBy = "LATEST_FIRST" | "OLDEST_FIRST" | "ALPHABETICAL";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import GroupCard from "../ui/GroupCard";
export default function Search() {
    const [query, setQuery] = useState("");
    const [cursor, setCursor] = useState<string | null>(null);
    const [orderBy, setOrderBy] = useState<"LATEST_FIRST" | "OLDEST_FIRST" | "ALPHABETICAL">("LATEST_FIRST");

    const { data, loading } = useGroups({
        pageSize: "FIFTY",
        cursor: cursor,
        orderBy: orderBy,
        filter: query ? { searchQuery: query } : null,
    });

    return (
        <div className="flex flex-col m-4 w-full items-center space-y-2">
            <div className="flex w-full max-w-3xl space-x-2">
                <Select value={orderBy} onValueChange={v => setOrderBy(v as OrderBy)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Order by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Order By</SelectLabel>
                            <SelectItem value="LATEST_FIRST">Latest First</SelectItem>
                            <SelectItem value="OLDEST_FIRST">Oldest First</SelectItem>
                            <SelectItem value="ALPHABETICAL">Alphabetical</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Input
                    type="text"
                    placeholder="Group name."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                />

                <Button>
                    Search
                </Button>
            </div>
            {loading && <div>Loading...</div>}
            {data && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-7xl mx-auto">
                        {data.items.map((group: any) => (
                            <GroupCard
                                key={group.address}
                                icon={group.metadata.icon}
                                name={group.metadata.name}
                                description={group.metadata.description}
                                address={group.address}
                                timestamp={group.timestamp}
                            />
                        ))}
                    </div>
                    <div className="flex justify-between w-full mt-4">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious onClick={() => setCursor(data.pageInfo?.prev ?? null)} />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationNext onClick={() => setCursor(data.pageInfo?.next ?? null)} />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </>
            )}
        </div>
    );
}