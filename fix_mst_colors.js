const fs = require('fs');
const path = require('path');
const filePath = 'c:\\Users\\User\\Documents\\GitHub\\exchange_marathon_dashboard\\app\\dashboard\\[team]\\page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add mstVibrantColors constant if not exists
if (!content.includes('const mstVibrantColors')) {
  content = content.replace('const igvB2bHexColors = ["#00B0FF", "#6200EA", "#FF9800"]; // Blue, Deep Purple, Orange', 
    'const igvB2bHexColors = ["#00B0FF", "#6200EA", "#FF9800"]; // Blue, Deep Purple, Orange\nconst mstVibrantColors = ["#FF5252", "#FF4081", "#E040FB", "#7C4DFF", "#536DFE", "#448AFF", "#40C4FF", "#18FFFF", "#64FFDA", "#69F0AE", "#B2FF59", "#EEFF41", "#FFFF00", "#FFD740", "#FFAB40", "#FF6E40"];');
}

// 2. Update rendering loop to use vibrant colors for MST
// We need to match the actual literal array for isIgvIr
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

// 3. Hide legend for MST
content = content.replace(/\{isMST \?\(/g, '{isMST && false ? (');

fs.writeFileSync(filePath, content, 'utf8');
console.log('MST color update successful');
