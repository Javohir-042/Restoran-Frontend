const fs = require('fs');
const filePath = 'src/pages/admin/menu.tsx';

if(fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');

    // Safe general replacements for containers
    content = content.replace(/bg-white border/g, 'bg-white dark:bg-[#18181b] border');
    content = content.replace(/bg-white rounded/g, 'bg-white dark:bg-[#18181b] rounded');
    content = content.replace(/border-gray-100/g, 'border-gray-100 dark:border-[#27272a]');
    content = content.replace(/border-gray-200/g, 'border-gray-200 dark:border-[#27272a]');
    content = content.replace(/text-gray-900/g, 'text-gray-900 dark:text-[#fafafa]');
    content = content.replace(/text-gray-700/g, 'text-gray-700 dark:text-[#f4f4f5]');
    content = content.replace(/text-gray-500/g, 'text-gray-500 dark:text-[#a1a1aa]');
    content = content.replace(/text-gray-400/g, 'text-gray-400 dark:text-[#71717a]');
    content = content.replace(/bg-gray-50/g, 'bg-gray-50 dark:bg-[#27272a]');
    content = content.replace(/hover:bg-gray-50/g, 'hover:bg-gray-50 dark:hover:bg-[#27272a]');

    // Safe Input and Form fields replacements
    content = content.replace(/bg-\[\#f1f3f5\]/g, 'bg-[#f1f3f5] dark:bg-[#1e1e1e]');
    content = content.replace(/bg-\[\#f8f9fb\]/g, 'bg-[#f8f9fb] dark:bg-[#09090b]');

    fs.writeFileSync(filePath, content);
    console.log('Class mapping complete for menu.tsx');
}
