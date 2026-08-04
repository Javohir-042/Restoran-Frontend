const fs = require('fs');

const filesToUpdate = [
    'src/pages/admin/dashboard.tsx',
    'src/pages/admin/staff.tsx',
    'src/pages/admin/categories.tsx',
    'src/pages/admin/tables.tsx',
    'src/pages/admin/orders.tsx',
    'src/layout/admin-layout.tsx',
    'src/layout/admin-sidebar.tsx'
];

function processFile(filePath) {
    if(!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf-8');

    // Make the chassis (admin-layout) really dark
    content = content.replace(/bg-\[\#f8f9fb\] dark:bg-\[\#121212\]/g, 'bg-[#f8f9fb] dark:bg-[#09090b]'); // zinc-950

    // Make cards/sidebar use zinc-900
    content = content.replace(/dark:bg-\[\#121212\]/g, 'dark:bg-[#18181b]'); // zinc-900
    
    // Make subtle hovers / secondary backgrounds zinc-800
    content = content.replace(/dark:bg-\[\#1e1e1e\]/g, 'dark:bg-[#27272a]'); // zinc-800
    content = content.replace(/dark:bg-\[\#2a2a2a\]/g, 'dark:bg-[#27272a]'); 
    
    // Fix borders to zinc-800
    content = content.replace(/dark:border-\[\#27272a\]\/50/g, 'dark:border-[#27272a]');
    
    // Fix any leftover slate string
    content = content.replace(/dark:text-slate-400/g, 'dark:text-[#a1a1aa]');
    content = content.replace(/dark:text-slate-200/g, 'dark:text-[#e4e4e7]');
    content = content.replace(/dark:hover:text-slate-200/g, 'dark:hover:text-[#e4e4e7]');
    content = content.replace(/dark:hover:bg-white\/5/g, 'dark:hover:bg-[#27272a]');

    fs.writeFileSync(filePath, content);
}

filesToUpdate.forEach(processFile);
console.log('Contrast fixed!');
