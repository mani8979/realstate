
const fs = require('fs');
const content = fs.readFileSync('d:\\reals\\src\\app\\properties\\[id]\\page.tsx', 'utf8');

const lines = content.split('\n');
let divBalance = 0;
let motionDivBalance = 0;
let output = [];

lines.forEach((line, i) => {
    const lineNum = i + 1;
    
    // Count opening tags
    const openDivs = (line.match(/<div(\s|>)/g) || []).length;
    const openMotionDivs = (line.match(/<motion\.div(\s|>)/g) || []).length;
    
    // Count closing tags
    const closeDivs = (line.match(/<\/div>/g) || []).length;
    const closeMotionDivs = (line.match(/<\/motion\.div>/g) || []).length;
    
    divBalance += openDivs - closeDivs;
    motionDivBalance += openMotionDivs - closeMotionDivs;
    
    output.push(`${lineNum}: D:${divBalance} M:${motionDivBalance} | ${line.trim()}`);
});

fs.writeFileSync('d:\\reals\\scratch\\tag_output.txt', output.join('\n'), 'utf8');
