const fs = require('fs');
const filePath = 'src/pages/admin/settings.tsx';

if(fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');

    // Safe general replacements for containers
    content = content.replace(/bg-white border/g, 'bg-white dark:bg-[#18181b] border');
    content = content.replace(/bg-white rounded/g, 'bg-white dark:bg-[#18181b] rounded');
    content = content.replace(/border-gray-100/g, 'border-gray-100 dark:border-[#27272a]');
    content = content.replace(/border-gray-200/g, 'border-gray-200 dark:border-[#27272a]');
    
    // Text colors
    content = content.replace(/text-gray-900/g, 'text-gray-900 dark:text-[#fafafa]');
    content = content.replace(/text-gray-700/g, 'text-gray-700 dark:text-[#f4f4f5]');
    content = content.replace(/text-gray-600/g, 'text-gray-600 dark:text-[#e4e4e7]');
    content = content.replace(/text-gray-500/g, 'text-gray-500 dark:text-[#a1a1aa]');
    content = content.replace(/text-gray-400/g, 'text-gray-400 dark:text-[#71717a]');
    
    // Tabs hover and inactive
    content = content.replace(/hover:text-gray-700 hover:border-gray-300/g, 'hover:text-gray-700 dark:hover:text-[#e4e4e7] hover:border-gray-300 dark:hover:border-[#27272a]');
    
    // Badges/Icons
    content = content.replace(/bg-blue-50/g, 'bg-blue-50 dark:bg-blue-500/10');
    content = content.replace(/text-\[\#1a56db\]"/g, 'text-[#1a56db] dark:text-blue-400"');
    
    // Special Input Focus colors
    content = content.replace(/focus:bg-white/g, 'focus:bg-white dark:focus:bg-[#18181b]');
    
    // Special Input/Select backgrounds
    content = content.replace(/bg-gray-50/g, 'bg-gray-50 dark:bg-[#27272a]/50');

    fs.writeFileSync(filePath, content);
    console.log('Class mapping complete for settings.tsx');
}
