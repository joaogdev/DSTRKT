import fs from 'fs';
import path from 'path';

const files = [
  'src/app/admin/users/page.tsx',
  'src/app/admin/products/page.tsx',
  'src/app/admin/orders/page.tsx',
  'src/app/admin/logs/page.tsx',
  'src/app/orders/page.tsx',
  'src/app/orders/[id]/page.tsx',
];

for (const file of files) {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');

  // Replace light mode classes with brutalist dark mode classes
  content = content.replace(/bg-gray-50/g, 'bg-black');
  content = content.replace(/bg-white/g, 'bg-[#111]');
  content = content.replace(/text-gray-900/g, 'text-white font-display uppercase tracking-wider');
  content = content.replace(/text-gray-800/g, 'text-white');
  content = content.replace(/text-gray-700/g, 'text-[#ccc]');
  content = content.replace(/text-gray-600/g, 'text-[#aaa]');
  content = content.replace(/text-gray-500/g, 'text-[#888] font-mono text-xs uppercase');
  content = content.replace(/text-gray-400/g, 'text-[#666]');
  content = content.replace(/bg-gray-100/g, 'bg-[#222] border border-[#333]');
  content = content.replace(/bg-gray-200/g, 'bg-[#333]');
  content = content.replace(/border-gray-200/g, 'border-[#333]');
  content = content.replace(/hover:bg-gray-50/g, 'hover:bg-[#111]');
  content = content.replace(/hover:bg-gray-100/g, 'hover:bg-[#222]');
  
  // Tables
  content = content.replace(/className="w-full"/g, 'className="w-full text-left brutalist-outline"');
  content = content.replace(/<tr className="border-t/g, '<tr className="border-b border-[#333]');
  
  // Specific pill colors to brutalist style
  content = content.replace(/bg-yellow-100 text-yellow-800/g, 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20');
  content = content.replace(/bg-blue-100 text-blue-800/g, 'bg-blue-500/10 text-blue-400 border border-blue-500/20');
  content = content.replace(/bg-purple-100 text-purple-800/g, 'bg-purple-500/10 text-purple-400 border border-purple-500/20');
  content = content.replace(/bg-green-100 text-green-800/g, 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20');
  content = content.replace(/bg-red-100 text-red-800/g, 'bg-red-500/10 text-red-400 border border-red-500/20');
  content = content.replace(/bg-cyan-100 text-cyan-800/g, 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20');
  content = content.replace(/bg-orange-100 text-orange-800/g, 'bg-orange-500/10 text-orange-400 border border-orange-500/20');

  // Input styles (including select)
  content = content.replace(/className="input/g, 'className="input bg-black text-white border border-[#333] rounded-none focus:border-[var(--accent-red)] transition-colors');

  fs.writeFileSync(filePath, content, 'utf8');
}
console.log('✅ Done replacing colors');
