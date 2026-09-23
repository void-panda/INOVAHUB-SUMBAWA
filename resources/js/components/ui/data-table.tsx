import React, { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Inbox, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export interface Column<T> {
    header: string;
    accessorKey?: keyof T;
    cell?: (row: T) => React.ReactNode;
    sortable?: boolean;
    align?: 'left' | 'center' | 'right';
    className?: string;
}

export interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    searchPlaceholder?: string;
    searchKey?: (row: T) => string;
    filterOptions?: { label: string; value: string }[];
    filterKey?: (row: T) => string;
    emptyTitle?: string;
    emptyDescription?: string;
    emptyAction?: React.ReactNode;
    headerRightAction?: React.ReactNode;
    pageSize?: number;
    title?: React.ReactNode;
    description?: React.ReactNode;
    toolbarRight?: React.ReactNode;
}

export function DataTable<T extends { id?: string | number }>({
    data,
    columns,
    searchPlaceholder = 'Cari data...',
    searchKey,
    filterOptions,
    filterKey,
    emptyTitle = 'Tidak ada data',
    emptyDescription = 'Belum ada data yang tersedia untuk ditampilkan.',
    emptyAction,
    headerRightAction,
    pageSize = 10,
    title,
    description,
    toolbarRight,
}: DataTableProps<T>) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [sortColumnIndex, setSortColumnIndex] = useState<number | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(pageSize);

    // 1. Filter data
    const filteredData = useMemo(() => {
        return data.filter((row) => {
            // Search filter
            let matchesSearch = true;
            if (searchTerm.trim() !== '') {
                const query = searchTerm.toLowerCase();
                if (searchKey) {
                    matchesSearch = searchKey(row).toLowerCase().includes(query);
                } else {
                    matchesSearch = Object.values(row as Record<string, unknown>).some((val) =>
                        String(val ?? '').toLowerCase().includes(query),
                    );
                }
            }

            // Category/Status filter
            let matchesCategory = true;
            if (filterKey && selectedFilter !== 'all') {
                matchesCategory = filterKey(row) === selectedFilter;
            }

            return matchesSearch && matchesCategory;
        });
    }, [data, searchTerm, selectedFilter, searchKey, filterKey]);

    // 2. Sort data
    const sortedData = useMemo(() => {
        if (sortColumnIndex === null) return filteredData;

        const col = columns[sortColumnIndex];
        if (!col || !col.accessorKey) return filteredData;

        const key = col.accessorKey;
        return [...filteredData].sort((a, b) => {
            const valA = a[key];
            const valB = b[key];

            if (valA === valB) return 0;
            if (valA === null || valA === undefined) return 1;
            if (valB === null || valB === undefined) return -1;

            const comp = String(valA).localeCompare(String(valB), undefined, { numeric: true });
            return sortDirection === 'asc' ? comp : -comp;
        });
    }, [filteredData, sortColumnIndex, sortDirection, columns]);

    // 3. Paginate data
    const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1;
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return sortedData.slice(start, start + itemsPerPage);
    }, [sortedData, currentPage, itemsPerPage]);

    const handleSort = (index: number) => {
        if (sortColumnIndex === index) {
            if (sortDirection === 'asc') {
                setSortDirection('desc');
            } else {
                setSortColumnIndex(null);
                setSortDirection('asc');
            }
        } else {
            setSortColumnIndex(index);
            setSortDirection('asc');
        }
    };

    return (
        <Card className="border-border/60 shadow-xs overflow-hidden">
            {(title || description || headerRightAction || searchPlaceholder || filterOptions || toolbarRight) && (
                <CardHeader className="border-b bg-muted/20 p-4 md:p-6 space-y-4">
                    {(title || description || headerRightAction) && (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                {title && <div className="text-lg font-bold tracking-tight text-foreground">{title}</div>}
                                {description && <div className="text-xs text-muted-foreground mt-0.5">{description}</div>}
                            </div>
                            {headerRightAction && <div>{headerRightAction}</div>}
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                        {/* Search Input */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                placeholder={searchPlaceholder}
                                className="pl-9 pr-8 h-9 text-xs"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Custom Toolbar Right / Tabs */}
                        {toolbarRight}

                        {/* Filter Tabs / Select */}
                        {!toolbarRight && filterOptions && filterOptions.length > 0 && (
                            <div className="flex rounded-md border bg-muted/50 p-1 text-xs w-fit">
                                {filterOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => {
                                            setSelectedFilter(opt.value);
                                            setCurrentPage(1);
                                        }}
                                        className={`px-3 py-1 rounded-sm font-medium transition-all ${
                                            selectedFilter === opt.value
                                                ? 'bg-background text-foreground shadow-xs'
                                                : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </CardHeader>
            )}

            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent bg-muted/40">
                                {columns.map((col, idx) => (
                                    <TableHead
                                        key={idx}
                                        className={`text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 ${
                                            col.align === 'center'
                                                ? 'text-center'
                                                : col.align === 'right'
                                                  ? 'text-right'
                                                  : 'text-left'
                                        } ${col.className || ''}`}
                                    >
                                        {col.sortable && col.accessorKey ? (
                                            <button
                                                type="button"
                                                onClick={() => handleSort(idx)}
                                                className="inline-flex items-center gap-1 hover:text-foreground transition-colors font-semibold"
                                            >
                                                {col.header}
                                                {sortColumnIndex === idx ? (
                                                    sortDirection === 'asc' ? (
                                                        <ArrowUp className="h-3.5 w-3.5 text-primary" />
                                                    ) : (
                                                        <ArrowDown className="h-3.5 w-3.5 text-primary" />
                                                    )
                                                ) : (
                                                    <ArrowUpDown className="h-3 w-3 opacity-40" />
                                                )}
                                            </button>
                                        ) : (
                                            col.header
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-48 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground p-6">
                                            <Inbox className="h-10 w-10 stroke-1 text-muted-foreground/40" />
                                            <div className="text-sm font-semibold text-foreground">{emptyTitle}</div>
                                            <div className="text-xs max-w-sm">{emptyDescription}</div>
                                            {emptyAction && <div className="pt-2">{emptyAction}</div>}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedData.map((row, rowIdx) => (
                                    <TableRow
                                        key={row.id ?? rowIdx}
                                        className="hover:bg-accent/40 transition-colors border-b last:border-0"
                                    >
                                        {columns.map((col, colIdx) => (
                                            <TableCell
                                                key={colIdx}
                                                className={`py-3 text-xs ${
                                                    col.align === 'center'
                                                        ? 'text-center'
                                                        : col.align === 'right'
                                                          ? 'text-right'
                                                          : 'text-left'
                                                } ${col.className || ''}`}
                                            >
                                                {col.cell
                                                    ? col.cell(row)
                                                    : col.accessorKey
                                                      ? (row[col.accessorKey] as React.ReactNode)
                                                      : null}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Footer Controls */}
                {sortedData.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t p-4 bg-muted/10 text-xs">
                        <div className="text-muted-foreground">
                            Menampilkan <strong className="text-foreground">{(currentPage - 1) * itemsPerPage + 1}</strong> -{' '}
                            <strong className="text-foreground">
                                {Math.min(currentPage * itemsPerPage, sortedData.length)}
                            </strong>{' '}
                            dari <strong className="text-foreground">{sortedData.length}</strong> data
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-muted-foreground">
                                <span>Per halaman:</span>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => {
                                        setItemsPerPage(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                    className="bg-background border rounded px-1.5 py-0.5 text-xs text-foreground cursor-pointer"
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>

                            <div className="flex items-center space-x-1">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="h-8 w-8 p-0"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span className="px-2 text-xs font-semibold">
                                    {currentPage} / {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="h-8 w-8 p-0"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
