#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

// Helper to print colored messages
function log(message, color = '') {
  console.log(`${color}${message}${colors.reset}`);
}

// Get source directory (this repository)
function getSourceDir() {
  return __dirname;
}

// Prompt user for input
function promptInput(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`${colors.cyan}${question}${colors.reset} `, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// Directories to copy recursively
const DIRS_TO_COPY = [
  {
    source: '.cursor/commands',
    target: '.cursor/commands',
    description: 'Cursor command templates',
  },
  {
    source: '.specify',
    target: '.specify',
    description: 'Speckit framework files',
  },
];

// Individual files to install
const FILES_TO_INSTALL = [
  {
    source: 'README.md',
    target: 'n8n-speckit-README.md',
    description: 'Documentation',
    optional: true,
  },
];

// Create directory if it doesn't exist
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    return true;
  }
  return false;
}

// Copy file with interactive overwrite handling
async function copyFile(sourcePath, targetPath, options = {}) {
  const { force = false, interactive = true } = options;
  
  if (fs.existsSync(targetPath) && !force) {
    if (interactive) {
      const answer = await prompt(`File exists: ${targetPath}\n  Overwrite? (y/n/a=all):`);
      if (answer === 'a' || answer === 'all') {
        return { success: true, forceAll: true };
      }
      if (answer !== 'y' && answer !== 'yes') {
        log(`  ⊘ Skipped: ${targetPath}`, colors.yellow);
        return { success: false, forceAll: false };
      }
    } else {
      log(`  ⚠️  Skipped (already exists): ${targetPath}`, colors.yellow);
      return { success: false, forceAll: false };
    }
  }

  try {
    const content = fs.readFileSync(sourcePath, 'utf8');
    fs.writeFileSync(targetPath, content, 'utf8');
    log(`  ✓ Copied: ${path.relative(process.cwd(), targetPath)}`, colors.green);
    return { success: true, forceAll: false };
  } catch (error) {
    log(`  ✗ Failed: ${targetPath}`, colors.red);
    log(`    Error: ${error.message}`, colors.red);
    return { success: false, forceAll: false };
  }
}

// Copy directory recursively
async function copyDirectory(sourceDir, targetDir, options = {}) {
  const { force = false, interactive = true } = options;
  let stats = { copied: 0, skipped: 0, failed: 0 };
  let forceAll = force;

  if (!fs.existsSync(sourceDir)) {
    log(`  ✗ Source directory not found: ${sourceDir}`, colors.red);
    return stats;
  }

  ensureDir(targetDir);

  const items = fs.readdirSync(sourceDir);

  for (const item of items) {
    const sourcePath = path.join(sourceDir, item);
    const targetPath = path.join(targetDir, item);
    const stat = fs.statSync(sourcePath);

    if (stat.isDirectory()) {
      const subStats = await copyDirectory(sourcePath, targetPath, { force: forceAll, interactive });
      stats.copied += subStats.copied;
      stats.skipped += subStats.skipped;
      stats.failed += subStats.failed;
      if (subStats.forceAll) forceAll = true;
    } else if (stat.isFile()) {
      const result = await copyFile(sourcePath, targetPath, { force: forceAll, interactive });
      if (result.success) {
        stats.copied++;
      } else {
        stats.skipped++;
      }
      if (result.forceAll) {
        forceAll = true;
      }
    }
  }

  stats.forceAll = forceAll;
  return stats;
}

// Make scripts in .specify folder executable
function makeScriptsExecutable(targetDir) {
  const specifyDir = path.join(targetDir, '.specify');
  
  if (!fs.existsSync(specifyDir)) {
    return { count: 0, failed: 0 };
  }

  let count = 0;
  let failed = 0;

  function processDirectory(dir) {
    try {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          processDirectory(fullPath);
        } else if (stat.isFile() && (item.endsWith('.sh') || item.endsWith('.bash'))) {
          try {
            fs.chmodSync(fullPath, 0o755);
            log(`  ✓ Made executable: ${path.relative(targetDir, fullPath)}`, colors.green);
            count++;
          } catch (error) {
            log(`  ✗ Failed to chmod: ${path.relative(targetDir, fullPath)} - ${error.message}`, colors.red);
            failed++;
          }
        }
      }
    } catch (error) {
      log(`  ✗ Error processing directory: ${dir} - ${error.message}`, colors.red);
      failed++;
    }
  }

  processDirectory(specifyDir);
  return { count, failed };
}

// Prompt user for yes/no
function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`${colors.cyan}${question}${colors.reset} `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase().trim() === 'y' || answer.toLowerCase().trim() === 'yes');
    });
  });
}

// Main installation function
async function install() {
  log('\n╔════════════════════════════════════════════════╗', colors.bright + colors.blue);
  log('║     n8n Cursor Speckit Installation           ║', colors.bright + colors.blue);
  log('╚════════════════════════════════════════════════╝\n', colors.bright + colors.blue);

  const sourceDir = getSourceDir();
  
  // Parse command line flags
  const args = process.argv.slice(2);
  const force = args.includes('--force') || args.includes('-f');
  const skipPrompts = args.includes('--skip-prompts') || args.includes('-y');

  log(`📂 Source: ${sourceDir}\n`, colors.cyan);

  // Prompt for target directory
  let targetDir = '';
  
  if (args.length > 0 && !args[0].startsWith('--')) {
    // Target directory provided as argument
    targetDir = path.resolve(args[0]);
  } else {
    // Prompt for target directory
    const input = await promptInput('Enter target project directory path:');
    
    if (!input) {
      log('\n✗ No target directory provided. Installation cancelled.\n', colors.red);
      process.exit(1);
    }
    
    // Handle relative paths and home directory
    targetDir = input.startsWith('~') 
      ? path.join(process.env.HOME, input.slice(1))
      : path.resolve(input);
  }

  // Validate target directory
  if (!fs.existsSync(targetDir)) {
    log(`\n⚠️  Target directory does not exist: ${targetDir}`, colors.yellow);
    const shouldCreate = await prompt('Create it? (y/n):');
    
    if (shouldCreate) {
      try {
        fs.mkdirSync(targetDir, { recursive: true });
        log(`✓ Created directory: ${targetDir}\n`, colors.green);
      } catch (error) {
        log(`\n✗ Failed to create directory: ${error.message}\n`, colors.red);
        process.exit(1);
      }
    } else {
      log('\n✗ Installation cancelled.\n', colors.yellow);
      process.exit(0);
    }
  }

  // Check if we're installing to the same directory
  const isSameDir = path.resolve(sourceDir) === path.resolve(targetDir);
  
  if (isSameDir) {
    log('\n⚠️  Error: Cannot install to the same directory as source', colors.red);
    log('   Please specify a different target directory.\n', colors.red);
    process.exit(1);
  }

  log(`📂 Target: ${targetDir}\n`, colors.cyan);

  if (force) {
    log('⚡ Force mode: Will overwrite all existing files\n', colors.yellow);
  }

  const interactive = !force && !skipPrompts;

  // Install directories
  log('📦 Installing n8n Speckit files...\n', colors.bright);

  let totalCopied = 0;
  let totalSkipped = 0;
  let totalFailed = 0;

  for (const dir of DIRS_TO_COPY) {
    const sourcePath = path.join(sourceDir, dir.source);
    const targetPath = path.join(targetDir, dir.target);

    log(`\n📁 ${dir.description} (${dir.source}):`, colors.bright);

    if (!fs.existsSync(sourcePath)) {
      log(`  ✗ Source not found: ${sourcePath}`, colors.red);
      totalFailed++;
      continue;
    }

    const stats = await copyDirectory(sourcePath, targetPath, { force, interactive });
    totalCopied += stats.copied;
    totalSkipped += stats.skipped;
    totalFailed += stats.failed;
    
    if (stats.forceAll) {
      force = true; // User chose "all" for overwriting
    }
  }

  // Install optional individual files
  log('\n📄 Optional files:\n', colors.bright);

  for (const file of FILES_TO_INSTALL) {
    if (file.optional && !skipPrompts) {
      const shouldInstall = await prompt(`Install ${file.description}? (y/n):`);
      if (!shouldInstall) {
        log(`  ⊘ Skipped: ${file.target}`, colors.yellow);
        totalSkipped++;
        continue;
      }
    }

    const sourcePath = path.join(sourceDir, file.source);
    const targetPath = path.join(targetDir, file.target);

    if (!fs.existsSync(sourcePath)) {
      log(`  ✗ Source not found: ${file.source}`, colors.red);
      totalFailed++;
      continue;
    }

    ensureDir(path.dirname(targetPath));
    const result = await copyFile(sourcePath, targetPath, { force, interactive });
    
    if (result.success) {
      totalCopied++;
    } else {
      totalSkipped++;
    }
    
    if (result.forceAll) {
      force = true;
    }
  }

  // Make scripts executable
  log('\n🔧 Making scripts executable:\n', colors.bright);
  const chmodStats = makeScriptsExecutable(targetDir);
  if (chmodStats.count > 0) {
    log(`  ✓ Made ${chmodStats.count} script(s) executable`, colors.green);
  }
  if (chmodStats.failed > 0) {
    log(`  ✗ Failed to chmod ${chmodStats.failed} script(s)`, colors.red);
    totalFailed += chmodStats.failed;
  }

  // Summary
  log('\n' + '═'.repeat(60), colors.blue);
  log('Installation Summary:', colors.bright);
  log(`  ✓ Copied:  ${totalCopied} file(s)`, colors.green);
  if (totalSkipped > 0) log(`  ⊘ Skipped: ${totalSkipped} file(s)`, colors.yellow);
  if (totalFailed > 0) log(`  ✗ Failed:  ${totalFailed} file(s)`, colors.red);
  log('═'.repeat(60) + '\n', colors.blue);

  if (totalCopied > 0) {
    log('✨ Installation complete!\n', colors.green + colors.bright);
    log('📖 What was installed:', colors.cyan);
    log(`   • Cursor commands in: ${targetDir}/.cursor/commands/`, colors.cyan);
    log(`   • Speckit framework in: ${targetDir}/.specify/`, colors.cyan);
    log('');
    log('🚀 Next steps:', colors.cyan);
    log(`   1. cd ${targetDir}`, colors.cyan);
    log('   2. Open directory in Cursor: cursor .', colors.cyan);
    log('   3. Type /n8n.specify to start building workflows\n', colors.cyan);
    log('💡 Available commands:', colors.cyan);
    log('   /n8n.specify   - Create workflow specification', colors.cyan);
    log('   /n8n.clarify   - Resolve ambiguities', colors.cyan);
    log('   /n8n.plan      - Design technical architecture', colors.cyan);
    log('   /n8n.implement - Build the workflow', colors.cyan);
    log('   /n8n.analyze   - Validate quality', colors.cyan);
    log('   /n8n.align     - Sync specs with changes', colors.cyan);
    log('   /n8n.checklist - Generate quality checklists\n', colors.cyan);
  } else {
    log('⚠️  No files were copied.\n', colors.yellow);
  }
}

// Run installation
install().catch((error) => {
  log('\n✗ Installation failed:', colors.red);
  log(`  ${error.message}\n`, colors.red);
  process.exit(1);
});

