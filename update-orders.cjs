const fs = require('fs');

let typesFile = 'src/features/orders/types.ts';
let types = fs.readFileSync(typesFile, 'utf-8');
if(!types.includes('orderItems?: IOrderItem[];')) {
    types = types.replace(/createdAt: string;/, 'orderItems?: IOrderItem[];\n    createdAt: string;');
    fs.writeFileSync(typesFile, types);
}

let hooksFile = 'src/features/orders/useOrders.ts';
let hooks = fs.readFileSync(hooksFile, 'utf-8');

hooks = hooks.replace(/const ordersQuery = useQuery\({[^]*?enabled: bills\.length > 0,\n    }\);/m, `const ordersQuery = useQuery({
        queryKey: ["orders-with-items-bulk", bills.map((b) => b.id).join(',')],
        queryFn: async (): Promise<IOrderRow[]> => {
            return bills.map((bill) => {
                const items = bill.orderItems || [];
                const staffName = bill.openedByStaff
                    ? \`\${bill.openedByStaff.firstName} \${bill.openedByStaff.lastName}\`
                    : "Noma'lum";

                const computedStatus = computeOrderStatus(bill, items);
                const itemsLabel = computeItemsLabel(items);
                const itemsCount = items.length;

                return {
                    bill,
                    items,
                    staffName,
                    computedStatus,
                    itemsLabel,
                    itemsCount,
                };
            });
        },
        enabled: bills.length > 0,
    });`);

fs.writeFileSync(hooksFile, hooks);
console.log("Updated hooks successfully");
