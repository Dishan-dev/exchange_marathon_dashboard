const fs = require('fs');
const path = require('path');
const filePath = 'c:\\Users\\User\\Documents\\GitHub\\exchange_marathon_dashboard\\app\\dashboard\\[team]\\page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Refine the className to NOT apply a background if we have an inline style candidate (like for MST/oGV/B2B)
// Current line 2955: className={`relative flex items-center justify-center transition-all duration-700 hover:brightness-125 origin-left ${(!isIgvIr && !isOgvCr && !isOgvIr) ? colors[valIdx] : ''}`}
content = content.replace(/className=\{`relative flex items-center justify-center transition-all duration-700 hover:brightness-125 origin-left \$\{\(!isIgvIr && !isOgvCr && !isOgvIr\) \? colors\[valIdx\] : ''\}`\}/, 
  'className={`relative flex items-center justify-center transition-all duration-700 hover:brightness-125 origin-left ${(!isIgvIr && !isOgvCr && !isOgvIr && !isB2B && !isMST) ? colors[valIdx] : ""}`}');

// 2. Ensure backgroundColor logic is bulletproof
const chartColorLogic = /backgroundColor: isIgvIr\s+\?\s+\["#FF1744", "#9d4edd", "#00f5d4"\]\[valIdx\]\s+:\s+\(\(entry as any\)\.segmentType === "cr" \|\| isOgvCr\)\s+\?\s+ogvCrHexColors\[valIdx\]\s+:\s+\(\(entry as any\)\.segmentType === "ir" \|\| isOgvIr\)\s+\?\s+ogvIrHexColors\[valIdx\]\s+:\s+\(\(entry as any\)\.segmentType === "b2b" \|\| isB2B\)\s+\?\s+igvB2bHexColors\[valIdx\]\s+:\s+isMST\s+\?\s+mstVibrantColors\[entryIdx % mstVibrantColors.length\]\s+:\s+undefined/;
const newChartColorLogic = `backgroundColor: isIgvIr 
                                               ? ["#FF1744", "#9d4edd", "#00f5d4"][valIdx] 
                                               : ((entry as any).segmentType === "cr" || isOgvCr) 
                                                 ? ogvCrHexColors[valIdx] 
                                                 : ((entry as any).segmentType === "ir" || isOgvIr) 
                                                   ? ogvIrHexColors[valIdx] 
                                                   : ((entry as any).segmentType === "b2b" || isB2B)
                                                     ? igvB2bHexColors[valIdx]
                                                     : isMST
                                                       ? (mstVibrantColors[entryIdx % mstVibrantColors.length] || "#FFFFFF")
                                                       : undefined`;

content = content.replace(chartColorLogic, newChartColorLogic);

// 3. One more check: is entryIdx definitely there?
if (!content.includes('entryIdx: number')) {
  content = content.replace(/chart\.entries\?\.map\(\(entry: \{ label: string; values: number\[\]; email: string \}\) => \{/, 
    'chart.entries?.map((entry: { label: string; values: number[]; email: string }, entryIdx: number) => {');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Final MST color fix applied');
