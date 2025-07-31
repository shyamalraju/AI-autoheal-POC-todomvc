/**
 * OpenAI Prompts for Test Auto-Healing
 * 
 * Centralized prompt definitions for AI analysis of test failures.
 */

/**
 * System prompt - defines the AI's role and expertise
 */
const SYSTEM_PROMPT = `You are an expert test automation engineer specializing in fixing Cypress test failures. 
Your expertise includes:
- Cypress selector strategies and best practices
- DOM analysis and element identification
- Test failure diagnosis and resolution
- Web application testing patterns

Analyze test failures and provide specific selector/locator fixes.`;

/**
 * User prompt template - defines the analysis request structure
 */
const USER_PROMPT_TEMPLATE = `Analyze the following test failure and provide specific selector/locator fixes.

**INSTRUCTIONS:**
1. Compare the test expectations with the actual DOM content
2. Identify why selectors are failing (element not found, text mismatch, etc.)
3. Provide the exact code changes needed to fix the test
4. Focus on selector/locator fixes only
5. Respond in JSON format with 'analysis' and 'fix' fields

**TEST FILE:**
\`\`\`javascript
{{TEST_CONTENT}}
\`\`\`

**ACTUAL DOM CONTENT:**
\`\`\`html
{{DOM_CONTENT}}
\`\`\`

**WORKFLOW INFO:**
- Repository: {{REPOSITORY}}
- Workflow: {{WORKFLOW_NAME}}
- Failure URL: {{FAILURE_URL}}

**RESPONSE FORMAT:**
\`\`\`json
{
  "analysis": "Brief description of the issue",
  "fix": {
    "file": "tests/e2e/new-todo.spec.js",
    "line": 25,
    "old": "cy.contains('h1', 'todos')",
    "new": "cy.contains('h1', \"todo's\")",
    "type": "text_replacement",
    "description": "Update selector to match actual text content"
  }
}
\`\`\`

Provide your analysis and fix in the exact JSON format above.`;

/**
 * OpenAI API configuration
 */
const OPENAI_CONFIG = {
  model: 'gpt-4',
  max_tokens: 1000,
  temperature: 0.1
};

module.exports = {
  SYSTEM_PROMPT,
  USER_PROMPT_TEMPLATE,
  OPENAI_CONFIG
}; 