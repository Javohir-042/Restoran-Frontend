export interface ICategoryRef {
    id: string;
    name: string;
    nameRu: string;
}

export interface IMenuItem {
    id: string;
    name: string;
    nameRu: string;
    description: string | null;
    price: number;
    avatarUrl: string | null;
    isAvailable: boolean;
    categoryId: string;
    category?: ICategoryRef;
}

export interface ICreateMenuItemDto {
    name: string;
    nameRu: string;
    description?: string;
    price: number;
    categoryId: string;
}

export type IUpdateMenuItemDto = Partial<ICreateMenuItemDto>;