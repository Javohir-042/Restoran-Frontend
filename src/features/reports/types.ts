export interface ISummary {
    totalRevenue: number;
    totalBills: number;
    averageCheck: number;
}

export interface IRevenueRow {
    period: string;
    total: number;
    naqd: number;
    uzcard: number;
    humo: number;
}

export interface ITopItem {
    menuItemId: string;
    name: string;
    totalQuantity: number;
    totalRevenue: number;
}