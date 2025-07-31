/**
 * AI Payload Builder for Test Auto-Healing
 */

const fs = require('fs');
const path = require('path');
const { SYSTEM_PROMPT, USER_PROMPT_TEMPLATE, OPENAI_CONFIG } = require('./prompts');

function readFile(filePath, errorMsg) {
  try {
    if (!fs.existsSync(filePath)) throw new Error(`${errorMsg}: ${filePath}`);
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`❌ ${error.message}`);
    return null;
  }
}

function extractTestName(domFilePath) {
  return path.basename(domFilePath).replace('-clean.html', '');
}

function buildOpenAIPayload(context) {
  const { testContent, domContent, repository, workflowName, failureUrl } = context;

  if (!testContent || !domContent) {
    throw new Error('Missing required content: testContent and domContent are required');
  }

  const userPrompt = USER_PROMPT_TEMPLATE
    .replace('{{TEST_CONTENT}}', testContent)
    .replace('{{DOM_CONTENT}}', domContent)
    .replace('{{REPOSITORY}}', repository || 'Unknown')
    .replace('{{WORKFLOW_NAME}}', workflowName || 'Unknown')
    .replace('{{FAILURE_URL}}', failureUrl || 'Unknown');

  return {
    model: OPENAI_CONFIG.model,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt }
    ],
    max_tokens: OPENAI_CONFIG.max_tokens,
    temperature: OPENAI_CONFIG.temperature
  };
}

function processTestFailure(options = {}) {
  const {
    testFilePath = 'tests/e2e/new-todo.spec.js',
    domFilePath,
    repository,
    workflowName,
    failureUrl,
    outputPath = 'openai_payload.json'
  } = options;

  console.log('🔧 Building AI payload...');

  const testContent = readFile(testFilePath, 'Test file not found');
  const domContent = readFile(domFilePath, 'DOM file not found');

  if (!testContent || !domContent) {
    throw new Error('Failed to read required content');
  }

  const testName = extractTestName(domFilePath);
  console.log(`🧪 Test: ${testName}`);

  const payload = buildOpenAIPayload({
    testContent, domContent, repository, workflowName, failureUrl
  });

  fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2));
  console.log(`✅ Payload saved to ${outputPath}`);

  return {
    testName, testContent, domContent, payload,
    metrics: {
      testLines: testContent.split('\n').length,
      domChars: domContent.length,
      payloadTokens: JSON.stringify(payload).length
    }
  };
}

module.exports = { processTestFailure, buildOpenAIPayload };

if (require.main === module) {
  const domFile = process.argv[2];
  if (!domFile) {
    console.error('Usage: node ai-payload-builder.js <dom-file-path>');
    process.exit(1);
  }

  try {
    const result = processTestFailure({
      domFilePath: domFile,
      repository: process.env.GITHUB_REPOSITORY || 'test/repo',
      workflowName: process.env.GITHUB_WORKFLOW || 'Test Workflow',
      failureUrl: process.env.GITHUB_SERVER_URL || 'https://github.com'
    });
    console.log('📊 Metrics:', result.metrics);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
} 