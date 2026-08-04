const fs = require('fs');
const path = require('path');

const filesToUpdate = [
    'src/pages/admin/staff.tsx',
    'src/pages/admin/categories.tsx',
    'src/pages/admin/tables.tsx',
    'src/pages/admin/orders.tsx',
    'src/features/cashier/components/CashierBillsList.tsx',
    'src/features/reports/components/RevenueChart.tsx'
];

function processFile(filePath) {
    if(!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf-8');

    // Safe general replacements for containers
    content = content.replace(/bg-white border/g, 'bg-white dark:bg-slate-900 border');
    content = content.replace(/bg-white rounded/g, 'bg-white dark:bg-slate-900 rounded');
    content = content.replace(/border-gray-100/g, 'border-gray-100 dark:border-white/10');
    content = content.replace(/border-gray-200/g, 'border-gray-200 dark:border-white/10');
    content = content.replace(/text-gray-900/g, 'text-gray-900 dark:text-white');
    content = content.replace(/text-gray-700/g, 'text-gray-700 dark:text-gray-200');
    content = content.replace(/text-gray-500/g, 'text-gray-500 dark:text-gray-400');
    content = content.replace(/text-gray-400/g, 'text-gray-400 dark:text-gray-500');
    content = content.replace(/bg-gray-50/g, 'bg-gray-50 dark:bg-slate-800');
    content = content.replace(/hover:bg-gray-50/g, 'hover:bg-gray-50 dark:hover:bg-white/5');

    // Safe Input and Form fields replacements
    content = content.replace(/bg-\[\#f1f3f5\]/g, 'bg-[#f1f3f5] dark:bg-slate-800');
    content = content.replace(/bg-\[\#f8f9fb\]/g, 'bg-[#f8f9fb] dark:bg-slate-950');
    
    fs.writeFileSync(filePath, content);
}

filesToUpdate.forEach(processFile);
console.log('Class mapping complete');
