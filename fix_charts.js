const fs = require('fs');
const path = require('path');
const filePath = 'c:\\Users\\User\\Documents\\GitHub\\exchange_marathon_dashboard\\app\\dashboard\\[team]\\page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Update data population to be segment-aware
content = content.replace(/values: isOgvCr\s+\?\s+\[p\.metrics\?\.cr_signups \|\| 0, p\.metrics\?\.cr_apps \|\| 0, p\.metrics\?\.cr_approvals \|\| 0\]\s+:\s+\[p\.metrics\?\.ir_scheduled \|\| 0, p\.metrics\?\.ir_calls \|\| 0, p\.metrics\?\.ir_matching \|\| 0\]/, 
  'segmentType: (mt.name.toLowerCase().includes(\'cr\') || isOgvCr) ? "cr" : "ir",\n        values: (mt.name.toLowerCase().includes(\'cr\') || isOgvCr)\n          ? [p.metrics?.cr_signups || 0, p.metrics?.cr_apps || 0, p.metrics?.cr_approvals || 0]\n          : [p.metrics?.ir_scheduled || 0, p.metrics?.ir_calls || 0, p.metrics?.ir_matching || 0]');

// Update chart segment coloring
const oldChartCode = /backgroundColor: isIgvIr\s+\?\s+\["#FF1744", "#9d4edd", "#00f5d4"\]\[valIdx\]\s+:\s+isOgvCr\s+\?\s+ogvCrHexColors\[valIdx\]\s+:\s+isOgvIr\s+\?\s+ogvIrHexColors\[valIdx\]\s+:\s+undefined/;
const newChartCode = `backgroundColor: isIgvIr 
                                              ? ["#FF1744", "#9d4edd", "#00f5d4"][valIdx] 
                                              : ((entry as any).segmentType === "cr" || isOgvCr) 
                                                ? ogvCrHexColors[valIdx] 
                                                : ((entry as any).segmentType === "ir" || isOgvIr) 
                                                  ? ogvIrHexColors[valIdx] 
                                                  : undefined`;

content = content.replace(/initial:\{\s*opacity: 0, scaleX: 0\s*\}/g, 'initial:{ scaleX: 0 }');
content = content.replace(/whileInView:\{\s*opacity: 1, scaleX: 1\s*\}/g, 'whileInView:{ scaleX: 1 }');
content = content.replace(oldChartCode, newChartCode);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Update successful');
