const fs = require('fs');
const filePath = 'c:\\Users\\User\\Documents\\GitHub\\exchange_marathon_dashboard\\app\\dashboard\\[team]\\page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// The problematic lines were 2690-2696
// We need to remove the extra backtick on line 2691 and fix the inner div
const errorSnippet = /<div \s*className={`absolute left-1\/2 -top-\[13\.5rem\] z-\[200\] w-64 -translate-x-1\/2 rounded-3xl border border-white\/20 bg-black\/95 p-5 shadow-\[0_32px_64px_rgba\(0,0,0,0\.9\)\] backdrop-blur-3xl transition-all duration-300 ease-\[cubic-bezier\(0\.23,1,0\.32,1\)\]` \s*\${activeB2BRow === row\.email \s*\? 'opacity-100 scale-100 pointer-events-auto visible' \s*: 'opacity-0 scale-95 pointer-events-none invisible group-hover\/row:opacity-100 group-hover\/row:scale-100 group-hover\/row:pointer-events-auto group-hover\/row:visible'}`}\s*>\s*/;

const fixedSnippet = `<div 
                                     className={\`absolute left-1/2 -top-[13.5rem] z-[200] w-64 -translate-x-1/2 rounded-3xl border border-white/20 bg-black/95 p-5 shadow-[0_32px_64px_rgba(0,0,0,0.9)] backdrop-blur-3xl transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] 
                                       \${activeB2BRow === row.email 
                                         ? 'opacity-100 scale-100 pointer-events-auto visible' 
                                         : 'opacity-0 scale-95 pointer-events-none invisible group-hover/row:opacity-100 group-hover/row:scale-100 group-hover/row:pointer-events-auto group-hover/row:visible'}\`}
                                   >
                                     {/* Pointing Arrow */}
                                     <div className="absolute -bottom-1.5 left-1/2 h-3.5 w-3.5 -translate-x-1/2 rotate-45 border-b border-r border-white/20 bg-black/95 
                                      shadow-[0_4px_8px_rgba(0,0,0,0.4)]" />
                                     
                                     <div className="relative z-10 flex w-full flex-col gap-4">
`;

content = content.replace(errorSnippet, fixedSnippet);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Build error fix successful');
