const fs = require('fs');
const path = require('path');
const filePath = 'c:\\Users\\User\\Documents\\GitHub\\exchange_marathon_dashboard\\app\\dashboard\\[team]\\page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove incorrect segmentType from MST mapping
content = content.replace(/entries: isMST\s*\?\s*leaderboardRows\s*\.filter\(\(p\) => p\.score > 0\)\s*\.slice\(0, 1000\)\s*\.map\(\(p\) => \(\{([\s\S]+?)\}\)\)/, 
  (match, inner) => {
    const cleaned = inner.replace(/\s*segmentType:\s*"b2b",/, '');
    return `entries: isMST\n        ? leaderboardRows\n            .filter((p) => p.score > 0)\n            .slice(0, 1000)\n            .map((p) => ({${cleaned}}))`;
  });

// 2. Add correct segmentType to IGV B2B mapping
content = content.replace(/isB2B\s*\?\s*leaderboardRows\s*\.filter\(\(p\) => \(p\.metrics\?\.mous \|\| 0\) \+ \(p\.metrics\?\.coldCalls \|\| 0\) \+ \(p\.metrics\?\.followups \|\| 0\) > 0\)\s*\.slice\(0, 50\)\s*\.map\(\(p\) => \(\{([\s\S]+?)\}\)\)/,
  (match, inner) => {
     if (!inner.includes('segmentType')) {
        const updated = inner.replace('label: p.name,', 'label: p.name,\n                segmentType: "b2b",');
        return `isB2B\n          ? leaderboardRows\n              .filter((p) => (p.metrics?.mous || 0) + (p.metrics?.coldCalls || 0) + (p.metrics?.followups || 0) > 0)\n              .slice(0, 50)\n              .map((p) => ({${updated}}))`;
     }
     return match;
  });

fs.writeFileSync(filePath, content, 'utf8');
console.log('MST/B2B data mapping corrected');
