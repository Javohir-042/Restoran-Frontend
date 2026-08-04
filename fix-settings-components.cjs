const fs = require('fs');
const path = require('path');
const dir = 'src/features/settings/components/';

const filesToUpdate = fs.readdirSync(dir).map(f => path.join(dir, f));

filesToUpdate.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf-8');

    // General Containers
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
    
    // Form and inputs
    content = content.replace(/bg-white focus/g, 'bg-white dark:bg-[#121212] dark:text-[#fafafa] focus'); 
    content = content.replace(/bg-white block/g, 'bg-white dark:bg-[#121212] block'); // select boxes often
    
    // Buttons
    content = content.replace(/bg-gray-50/g, 'bg-gray-50 dark:bg-[#27272a]/50');
    content = content.replace(/hover:bg-gray-50/g, 'hover:bg-gray-50 dark:hover:bg-[#27272a]');

    // Border specifics for inputs
    content = content.replace(/border-gray-300 dark:border-\[\#27272a\]/g, 'border-gray-300 dark:border-[#27272a]');
    content = content.replace(/border-gray-300/g, 'border-gray-300 dark:border-[#27272a]');
    
    fs.writeFileSync(filePath, content);
});
console.log('Fixed tabs components!');
