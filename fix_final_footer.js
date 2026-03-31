const fs = require('fs');

// 1. Update components/Footer.tsx for inline layout
const footerPath = 'c:\\Users\\User\\Documents\\GitHub\\exchange_marathon_dashboard\\components\\Footer.tsx';
let footerContent = fs.readFileSync(footerPath, 'utf8');

// Change flex-col to flex-row and Gap 4 to Gap 6
footerContent = footerContent.replace('flex flex-col items-center gap-4', 'flex flex-row items-center gap-6 md:gap-8');
// Adjust the mascot image size for inline layout
footerContent = footerContent.replace('width={48}', 'width={32}');
footerContent = footerContent.replace('height={48}', 'height={32}');
footerContent = footerContent.replace('className="relative w-12 h-12', 'className="relative w-8 h-8');
// Remove background blur/bg to make it cleaner on the home page
footerContent = footerContent.replace('bg-black border-t border-white/5', 'bg-transparent border-t border-white/5');

fs.writeFileSync(footerPath, footerContent, 'utf8');
console.log('Modified Footer.tsx for inline layout');

// 2. Add Footer to app/page.tsx
const homePath = 'c:\\Users\\User\\Documents\\GitHub\\exchange_marathon_dashboard\\app\\page.tsx';
let homeContent = fs.readFileSync(homePath, 'utf8');
if (!homeContent.includes('<Footer />')) {
    homeContent = homeContent.replace('</div>\n    </div>\n  );\n}', '</div>\n      <Footer />\n    </div>\n  );\n}');
}
fs.writeFileSync(homePath, homeContent, 'utf8');
console.log('Added Footer to page.tsx');

// 3. Remove Footer from app/dashboard/[team]/page.tsx
const dashPath = 'c:\\Users\\User\\Documents\\GitHub\\exchange_marathon_dashboard\\app\\dashboard\\[team]\\page.tsx';
let dashContent = fs.readFileSync(dashPath, 'utf8');
dashContent = dashContent.replace(/\s*<Footer \/>/, '');
fs.writeFileSync(dashPath, dashContent, 'utf8');
console.log('Removed Footer from dashboard/[team]/page.tsx');
