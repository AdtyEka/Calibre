const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src/app/api', (filePath) => {
  if (!filePath.endsWith('.ts')) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // 1. Replace `wsl docker exec ...` string literals
  content = content.replace(/`wsl docker /g, '`${process.platform === "win32" ? "wsl docker" : "docker"} ');

  // 2. Replace runCommand("wsl", args) where args is an array
  // We'll replace "wsl" with process.platform === "win32" ? "wsl" : "docker"
  // And we need to remove the first element of args if it's "docker" when not on Windows.
  // The easiest way is to modify the runCommand definition!
  // Let's find function runCommand(
  
  const functionDefs = [
      'function runCommand(command: string, args: string[])',
      'function runCommandString(command: string, args: string[])',
      'function runCommandBinary(command: string, args: string[])',
      'function runCommandBuffer(command: string, args: string[])'
  ];

  for (const def of functionDefs) {
      if (content.includes(def) && !content.includes('// Patched by fix_wsl.js')) {
          content = content.replace(def, def + ` {
  // Patched by fix_wsl.js
  if (command === "wsl" && process.platform !== "win32") {
    command = "docker";
    if (args[0] === "docker") {
      args.shift();
    }
  }
  // End Patch`);
      }
  }
  
  // 3. Replace spawn("wsl", ["docker", ...]) inline
  content = content.replace(/spawn\("wsl",\s*\["docker"/g, 'spawn(process.platform === "win32" ? "wsl" : "docker", process.platform === "win32" ? ["docker" : [');
  // Actually the above spawn regex replaces '[' with '[' so we need to be careful.
  content = content.replace(/spawn\("wsl",\s*\["docker",/g, 'spawn(process.platform === "win32" ? "wsl" : "docker", process.platform === "win32" ? ["docker", : [');

  if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed', filePath);
  }
});
