
import { Card, CardContent, CardHeader } from "@mui/material"
import { Skeleton } from "./ui/skeleton"

export function MetricCardSkeleton() {
    return (
        <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
            </CardContent>
        </Card>
    )
}

export function ChartCardSkeleton({ className }: { className?: string }) {
    return (
        <Card className={className}>
            <CardHeader>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-[300px] w-full" />
            </CardContent>
        </Card>
    )
}

export function CollaboratorSkeleton() {
    return (
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
            <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-16" />
                </div>
            </div>
            <div className="text-right">
                <Skeleton className="h-4 w-12 mb-1" />
                <Skeleton className="h-3 w-16" />
            </div>
        </div>
    )
}
