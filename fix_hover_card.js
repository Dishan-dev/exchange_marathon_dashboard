const fs = require('fs');
const filePath = 'c:\\Users\\User\\Documents\\GitHub\\exchange_marathon_dashboard\\app\\dashboard\\[team]\\page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Lower the card by changing -top-56 to -top-[12.8rem] or similar
// 2. Add an arrow at the bottom center
const oldCardLine = /className=\{`absolute left-1\/2 -top-56 z-\[200\] w-64 -translate-x-1\/2 rounded-3xl border border-white\/20 bg-black\/95 p-5 shadow-\[0_32px_64px_rgba\(0,0,0,0\.9\)\] backdrop-blur-3xl transition-all duration-300 ease-\[cubic-bezier\(0\.23,1,0\.32,1\)\]/;

const newCardLine = `className={\`absolute left-1/2 -top-[13.5rem] z-[200] w-64 -translate-x-1/2 rounded-3xl border border-white/20 bg-black/95 p-5 shadow-[0_32px_64px_rgba(0,0,0,0.9)] backdrop-blur-3xl transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]\``;

content = content.replace(oldCardLine, newCardLine);

// 3. Add pointing arrow at the top of the div content
if (!content.includes('Pointing Arrow')) {
    content = content.replace('className={activeB2BRow === row.email', '/* Pointing Arrow */\n                                     <div className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-white/20 bg-black/95" />\n                                     <div className="relative z-10 w-full flex-col gap-4 flex">');
    // Removing the old inner div if we are wrapping
    content = content.replace('<div className="flex w-full flex-col gap-4">', '');
}

// 4. Also fix the "SQUAD STATS" wording for MST
content = content.replace(': "Squad Stats"', ': "Member Stats"');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Hover card position and arrow fix successful');
