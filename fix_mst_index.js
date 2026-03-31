const fs = require('fs');
const path = require('path');
const filePath = 'c:\\Users\\User\\Documents\\GitHub\\exchange_marathon_dashboard\\app\\dashboard\\[team]\\page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add entryIdx to the outer map
content = content.replace(/chart\.entries\?\.map\(\(entry: \{ label: string; values: number\[\]; email: string \}\) => \{/, 
  'chart.entries?.map((entry: { label: string; values: number[]; email: string }, entryIdx: number) => {');

// 2. Ensure backgroundColor uses the now-available entryIdx
// (The previous script already added the logic, but it was using entryIdx which was undefined)
// I'll check if it already has the logic or if I need to re-apply it.
if (!content.includes('mstVibrantColors[entryIdx % mstVibrantColors.length]')) {
  // Re-apply the color logic fix if it somehow failed or got mangled
  const colorLogic = /backgroundColor: isIgvIr\s+\?\s+\["#FF1744", "#9d4edd", "#00f5d4"\]\[valIdx\]\s+:\s+\(\(entry as any\)\.segmentType === "cr" \|\| isOgvCr\)\s+\?\s+ogvCrHexColors\[valIdx\]\s+:\s+\(\(entry as any\)\.segmentType === "ir" \|\| isOgvIr\)\s+\?\s+ogvIrHexColors\[valIdx\]\s+:\s+\(\(entry as any\)\.segmentType === "b2b" \|\| isB2B\)\s+\?\s+igvB2bHexColors\[valIdx\]\s+:\s+undefined/;
  const newColorLogic = `backgroundColor: isIgvIr 
                                               ? ["#FF1744", "#9d4edd", "#00f5d4"][valIdx] 
                                               : ((entry as any).segmentType === "cr" || isOgvCr) 
                                                 ? ogvCrHexColors[valIdx] 
                                                 : ((entry as any).segmentType === "ir" || isOgvIr) 
                                                   ? ogvIrHexColors[valIdx] 
                                                   : ((entry as any).segmentType === "b2b" || isB2B)
                                                     ? igvB2bHexColors[valIdx]
                                                     : isMST
                                                       ? mstVibrantColors[entryIdx % mstVibrantColors.length]
                                                       : undefined`;
  content = content.replace(colorLogic, newColorLogic);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('MST entryIdx fix successful');
