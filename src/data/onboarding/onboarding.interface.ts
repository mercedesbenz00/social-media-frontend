export interface ICategoryData {
    name: string;
    description: string;
    parentCategoryId?: number;
}

export interface ICategory extends ICategoryData {
    id: number;
    createdAt: number;
    patentCategory?: ICategory;
    groupCount: number | null;
}

export interface IPersonCategory {
    id: number;
    personId: number;
    categories: ICategory[];
    createdAt: number;
}
