import type {IPagination} from "@/data/main.model";

export function toGenericPageParams(page: IPagination): { [key: string ]: string} {
    let params = new Map<string, string>();

    if (page?.page !== null && page?.page !== undefined) params.set('page', page.page.toString());
    if (page?.size !== null && page?.size !== undefined) params.set('size', page.size.toString());

    if (page.sortBy) params = params.set("sort", `${page.sortBy},${page.sortOrder || 'asc'}`);

    return Object.fromEntries(params.entries());
}