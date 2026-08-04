const fs = require('fs');

const filesToUpdate = [
    'src/pages/admin/dashboard.tsx',
    'src/pages/admin/staff.tsx',
    'src/pages/admin/categories.tsx',
    'src/pages/admin/tables.tsx',
    'src/pages/admin/orders.tsx',
    'src/layout/admin-layout.tsx',
    'src/layout/admin-sidebar.tsx',
    'src/features/cashier/components/CashierBillsList.tsx',
    'src/features/reports/components/RevenueChart.tsx'
];

function processFile(filePath) {
    if(!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf-8');

    // Upgrade slate backgrounds to extremely premium zinc backgrounds
    content = content.replace(/dark:bg-slate-950/g, 'dark:bg-[#0a0a0a]'); // Deepest background
    content = content.replace(/dark:bg-slate-900/g, 'dark:bg-[#121212]'); // Card background
    content = content.replace(/dark:bg-slate-800/g, 'dark:bg-[#1e1e1e]'); // Hover states or secondary
    content = content.replace(/dark:bg-slate-700/g, 'dark:bg-[#2a2a2a]'); 

    // Smooth out borders
    content = content.replace(/dark:border-white\/10/g, 'dark:border-[#27272a]'); // zinc-800
    content = content.replace(/dark:border-white\/5/g, 'dark:border-[#27272a]/50'); 

    // Soften text colors
    content = content.replace(/dark:text-white/g, 'dark:text-[#fafafa]'); // zinc-50
    content = content.replace(/dark:text-gray-100/g, 'dark:text-[#f4f4f5]');
    content = content.replace(/dark:text-gray-200/g, 'dark:text-[#e4e4e7]');
    content = content.replace(/dark:text-gray-300/g, 'dark:text-[#d4d4d8]');
    content = content.replace(/dark:text-gray-400/g, 'dark:text-[#a1a1aa]');
    content = content.replace(/dark:text-gray-500/g, 'dark:text-[#71717a]');

    // Fix sidebar active item background
    content = content.replace(/dark:bg-blue-600/g, 'dark:bg-[#1e1e1e]');

    fs.writeFileSync(filePath, content);
}

filesToUpdate.forEach(processFile);
console.log('Premium dark mode applied');
