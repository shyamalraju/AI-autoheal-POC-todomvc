/**
 * Code Fixer for AI-Generated Test Fixes
 * 
 * Applies structured fixes to test files based on AI analysis
 */

const fs = require('fs');
const path = require('path');

/**
 * Applies a fix to a specific file and line
 */
function applyFix(fixData) {
  const { file, line, column, oldCode, newCode, reason } = fixData;

  console.log(`🔧 Applying fix to ${file}:${line}:${column}`);
  console.log(`📝 Reason: ${reason}`);

  // Read the target file
  if (!fs.existsSync(file)) {
    throw new Error(`Target file does not exist: ${file}`);
  }

  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  // Validate line exists
  if (line < 1 || line > lines.length) {
    throw new Error(`Line ${line} does not exist in file ${file}`);
  }

  // Get the target line (0-indexed)
  const targetLine = lines[line - 1];

  // Check if oldCode exists on the line
  if (!targetLine.includes(oldCode)) {
    throw new Error(`Expected code '${oldCode}' not found on line ${line}`);
  }

  // Apply the fix
  const newLine = targetLine.replace(oldCode, newCode);
  lines[line - 1] = newLine;

  // Write the updated content
  const updatedContent = lines.join('\n');
  fs.writeFileSync(file, updatedContent, 'utf8');

  console.log(`✅ Fix applied successfully`);
  console.log(`📄 Old: ${targetLine.trim()}`);
  console.log(`📄 New: ${newLine.trim()}`);

  return {
    file,
    line,
    oldLine: targetLine.trim(),
    newLine: newLine.trim(),
    success: true
  };
}

/**
 * Creates a backup of the file before applying fixes
 */
function createBackup(filePath) {
  const backupPath = `${filePath}.backup`;
  fs.copyFileSync(filePath, backupPath);
  console.log(`💾 Backup created: ${backupPath}`);
  return backupPath;
}

/**
 * Main function to process and apply AI fixes
 */
function processAndApplyFix(fixDataPath) {
  try {
    console.log('🔧 Processing AI fix data...');

    // Read the fix data
    const fixData = JSON.parse(fs.readFileSync(fixDataPath, 'utf8'));

    if (!fixData.fix) {
      throw new Error('No fix data found in the provided file');
    }

    const { file, line, column, oldCode, newCode, reason } = fixData.fix;

    console.log(`📄 Target file: ${file}`);
    console.log(`📍 Location: line ${line}, column ${column}`);
    console.log(`🔍 Old code: ${oldCode}`);
    console.log(`✨ New code: ${newCode}`);
    console.log(`📝 Reason: ${reason}`);

    // Create backup
    const backupPath = createBackup(file);

    // Apply the fix
    const result = applyFix(fixData.fix);

    // Save fix summary
    const summary = {
      timestamp: new Date().toISOString(),
      fix: fixData.fix,
      result: result,
      backup: backupPath
    };

    fs.writeFileSync('fix-summary.json', JSON.stringify(summary, null, 2));
    console.log('📊 Fix summary saved to fix-summary.json');

    return result;

  } catch (error) {
    console.error(`❌ Error applying fix: ${error.message}`);
    throw error;
  }
}

/**
 * Reverts a fix using the backup file
 */
function revertFix(filePath) {
  const backupPath = `${filePath}.backup`;

  if (fs.existsSync(backupPath)) {
    fs.copyFileSync(backupPath, filePath);
    console.log(`🔄 Reverted fix using backup: ${backupPath}`);
    return true;
  } else {
    console.error(`❌ No backup found for: ${filePath}`);
    return false;
  }
}

module.exports = {
  applyFix,
  createBackup,
  processAndApplyFix,
  revertFix
};

// Run if called directly
if (require.main === module) {
  const fixDataPath = process.argv[2];
  if (!fixDataPath) {
    console.error('Usage: node code-fixer.js <fix-data-file>');
    process.exit(1);
  }

  try {
    const result = processAndApplyFix(fixDataPath);
    console.log('✅ Fix applied successfully!');
    console.log('📊 Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('❌ Failed to apply fix');
    process.exit(1);
  }
} 