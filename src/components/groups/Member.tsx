/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useGroups } from '@lens-protocol/react';

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import GroupCard from "../ui/GroupCard";
export default function Member({ lensAddress }: { lensAddress: string }) {
    const [cursor, setCursor] = useState<string | null>(null);

    const { data, loading } = useGroups({
        pageSize: "FIFTY",
        cursor: cursor,
        orderBy: "LATEST_FIRST",
        filter: { member: lensAddress }
    });

    return (
        <div className="w-full">
            {loading && <div>Loading...</div>}
            {data && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {data.items.map((group: any) => (
                            <GroupCard
                                key={group.address}
                                icon={group.metadata.icon}
                                name={group.metadata.name}
                                description={group.metadata.description}
                                address={group.address}
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