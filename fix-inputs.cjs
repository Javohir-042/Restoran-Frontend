const fs = require('fs');
const path = require('path');
const dir = 'src/features/settings/components/';
const filesToUpdate = fs.readdirSync(dir).map(f => path.join(dir, f));

filesToUpdate.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Completely wipe out the chaotic string and replace with clean one
    content = content.replace(/className="w-full px-4 py-2.5 [^"]+"/g, 'className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#18181b] border border-gray-200 dark:border-[#27272a] rounded-xl text-gray-900 dark:text-[#fafafa] placeholder:text-gray-400 dark:placeholder:text-[#71717a] focus:bg-white dark:focus:bg-[#1e1e1e] focus:outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db]/50 transition-all"');
    
    // Fix select tag which might have a different string
    content = content.replace(/className="w-full px-4 py-2.5 appearance-none [^"]+"/g, 'className="w-full px-4 py-2.5 appearance-none bg-gray-50 dark:bg-[#18181b] border border-gray-200 dark:border-[#27272a] rounded-xl text-gray-900 dark:text-[#fafafa] focus:bg-white dark:focus:bg-[#1e1e1e] focus:outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db]/50 transition-all font-medium"');

    // Fix small input elements if any
    content = content.replace(/className="w-full px-3 py-2 text-sm [^"]+"/g, 'className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-[#18181b] border border-gray-200 dark:border-[#27272a] rounded-lg text-gray-900 dark:text-[#fafafa] focus:bg-white dark:focus:bg-[#1e1e1e] focus:outline-none"');

    fs.writeFileSync(filePath, content);
});
console.log('Fixed inputs cleanly!');
