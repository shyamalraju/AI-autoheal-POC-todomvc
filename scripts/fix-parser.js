/**
 * Fix Parser for AI-Generated Test Fixes
 * 
 * Parses and validates structured fix responses from OpenAI
 */

const fs = require('fs');

/**
 * Validates the structure of an AI fix response
 */
function validateFixResponse(response) {
  try {
    const parsed = typeof response === 'string' ? JSON.parse(response) : response;

    // Check required fields
    if (!parsed.analysis || typeof parsed.analysis !== 'string') {
      throw new Error('Missing or invalid analysis field');
    }

    if (!parsed.fix || typeof parsed.fix !== 'object') {
      throw new Error('Missing or invalid fix field');
    }

    const fix = parsed.fix;
    const requiredFields = ['file', 'line', 'column', 'oldCode', 'newCode', 'reason'];

    for (const field of requiredFields) {
      if (!fix[field]) {
        throw new Error(`Missing required fix field: ${field}`);
      }
    }

    // Validate data types
    if (typeof fix.file !== 'string') throw new Error('file must be a string');
    if (typeof fix.line !== 'number') throw new Error('line must be a number');
    if (typeof fix.column !== 'number') throw new Error('column must be a number');
    if (typeof fix.oldCode !== 'string') throw new Error('oldCode must be a string');
    if (typeof fix.newCode !== 'string') throw new Error('newCode must be a string');
    if (typeof fix.reason !== 'string') throw new Error('reason must be a string');

    return parsed;
  } catch (error) {
    throw new Error(`Invalid fix response: ${error.message}`);
  }
}

/**
 * Parses AI response and extracts fix data
 */
function parseFixResponse(aiResponse) {
  try {
    // Try to extract JSON from the response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response');
    }

    const jsonStr = jsonMatch[0];
    const parsed = JSON.parse(jsonStr);

    return validateFixResponse(parsed);
  } catch (error) {
    throw new Error(`Failed to parse AI response: ${error.message}`);
  }
}

/**
 * Checks if a fix can be safely applied
 */
function validateFix(fixData) {
  const { file, line, oldCode } = fixData;

  // Check if file exists
  if (!fs.existsSync(file)) {
    throw new Error(`Target file does not exist: ${file}`);
  }

  // Read file content
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  // Check if line exists
  if (line < 1 || line > lines.length) {
    throw new Error(`Line ${line} does not exist in file ${file}`);
  }

  // Check if oldCode exists on the specified line
  const targetLine = lines[line - 1];
  if (!targetLine.includes(oldCode)) {
    throw new Error(`Expected code '${oldCode}' not found on line ${line}`);
  }

  return true;
}

/**
 * Main function to process AI response and extract fix
 */
function processAIResponse(aiResponsePath) {
  try {
    const aiResponse = fs.readFileSync(aiResponsePath, 'utf8');
    const fixData = parseFixResponse(aiResponse);

    console.log('✅ AI response parsed successfully');
    console.log(`📝 Analysis: ${fixData.analysis}`);
    console.log(`🔧 Fix: ${fixData.fix.file}:${fixData.fix.line}`);
    console.log(`📄 Reason: ${fixData.fix.reason}`);

    // Validate the fix can be applied
    validateFix(fixData.fix);
    console.log('✅ Fix validation passed');

    return fixData;
  } catch (error) {
    console.error(`❌ Error processing AI response: ${error.message}`);
    throw error;
  }
}

module.exports = {
  parseFixResponse,
  validateFixResponse,
  validateFix,
  processAIResponse
};

// Run if called directly
if (require.main === module) {
  const aiResponsePath = process.argv[2];
  if (!aiResponsePath) {
    console.error('Usage: node fix-parser.js <ai-response-file>');
    process.exit(1);
  }

  try {
    const fixData = processAIResponse(aiResponsePath);
    console.log('📊 Fix data:', JSON.stringify(fixData, null, 2));
  } catch (error) {
    console.error('❌ Failed to process AI response');
    process.exit(1);
  }
} 