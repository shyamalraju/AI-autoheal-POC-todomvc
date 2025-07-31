/**
 * Code Fixer for Auto-Healing
 * Applies AI-generated fixes to test files
 */

const fs = require('fs');
const path = require('path');

/**
 * Parse AI response and extract fix information
 */
function parseAIResponse(analysisFile) {
  try {
    const content = fs.readFileSync(analysisFile, 'utf8');
    const response = JSON.parse(content);

    // Extract fix from AI response
    const fix = response.fix || response;

    return {
      file: fix.file || 'tests/e2e/new-todo.spec.js',
      line: fix.line,
      old: fix.old,
      new: fix.new,
      type: fix.type || 'text_replacement',
      description: fix.description || 'Auto-healing fix'
    };
  } catch (error) {
    console.error('❌ Error parsing AI response:', error.message);
    return null;
  }
}

/**
 * Apply text replacement to file
 */
function applyFix(fixData) {
  if (!fixData || !fixData.file || !fixData.old || !fixData.new) {
    console.error('❌ Invalid fix data');
    return false;
  }

  try {
    const filePath = fixData.file;
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      return false;
    }

    // Read file content
    let content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    // Find and replace the specific line
    if (fixData.line && fixData.line > 0 && fixData.line <= lines.length) {
      const lineIndex = fixData.line - 1;
      const oldLine = lines[lineIndex];

      if (oldLine.includes(fixData.old)) {
        lines[lineIndex] = oldLine.replace(fixData.old, fixData.new);
        console.log(`✅ Applied fix to line ${fixData.line}`);
        console.log(`   Old: ${oldLine.trim()}`);
        console.log(`   New: ${lines[lineIndex].trim()}`);
      } else {
        console.error(`❌ Line ${fixData.line} doesn't contain expected text`);
        return false;
      }
    } else {
      // Fallback: replace all occurrences
      if (content.includes(fixData.old)) {
        content = content.replace(fixData.old, fixData.new);
        console.log(`✅ Applied fix (replaced all occurrences)`);
      } else {
        console.error(`❌ Text not found in file: ${fixData.old}`);
        return false;
      }
    }

    // Write updated content
    const newContent = fixData.line ? lines.join('\n') : content;
    fs.writeFileSync(filePath, newContent);

    return true;
  } catch (error) {
    console.error('❌ Error applying fix:', error.message);
    return false;
  }
}

/**
 * Main function to process and apply fixes
 */
function processFix(analysisFile) {
  console.log('🔧 Processing AI fix...');

  const fixData = parseAIResponse(analysisFile);
  if (!fixData) {
    console.error('❌ Failed to parse AI response');
    return false;
  }

  console.log(`📁 Target file: ${fixData.file}`);
  console.log(`🎯 Fix type: ${fixData.type}`);

  const success = applyFix(fixData);

  if (success) {
    console.log('✅ Fix applied successfully');
    // Save fix info for commit message
    fs.writeFileSync('fix-info.json', JSON.stringify(fixData, null, 2));
  } else {
    console.log('❌ Fix application failed');
  }

  return success;
}

module.exports = { parseAIResponse, applyFix, processFix };

// Run if called directly
if (require.main === module) {
  const analysisFile = process.argv[2] || 'openai_analysis.txt';
  processFix(analysisFile);
} 