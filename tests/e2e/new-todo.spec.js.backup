describe('New todo', () => {
  afterEach(function () {
    if (this.currentTest.state === 'failed') {
      const testTitle = this.currentTest.title //.replace(/[<>:"\/\\|?*]+/g, '-'); // Sanitize filename
      const errorMessage = this.currentTest.err?.stack || this.currentTest.err?.message || 'Unknown error';

      cy.screenshot(`${testTitle} (failure)`);

      cy.document().then((doc) => {
        const html = doc.documentElement.outerHTML;

        // Write DOM snapshot
        cy.writeFile(`cypress/failures/${testTitle}.html`, html);

        // Write error message
        cy.writeFile(`cypress/failures/${testTitle}.log.txt`, errorMessage);

        // Parse error stack to extract line information
        const errorStack = this.currentTest.err?.stack || '';
        let errorLine = null;
        let errorColumn = null;

        // Try to extract line/column from stack trace
        const stackMatch = errorStack.match(/at.*\(.*:(\d+):(\d+)\)/);
        if (stackMatch) {
          errorLine = parseInt(stackMatch[1]);
          errorColumn = parseInt(stackMatch[2]);
        }

        // Write test context
        const testContext = {
          testName: this.currentTest.title,
          testFile: Cypress.spec.relative,
          specFile: Cypress.spec.name,
          timestamp: new Date().toISOString(),
          error: {
            message: this.currentTest.err?.message || 'Unknown error',
            stack: this.currentTest.err?.stack || '',
            line: errorLine,
            column: errorColumn
          }
        };
        cy.writeFile(`cypress/failures/${testTitle}.context.json`, JSON.stringify(testContext, null, 2));
      });
    }
  });

  it('should create new todo', () => {
    cy.visit('/');
    cy.contains('h1', 'todos');

    cy.get('.new-todo')
      .type('Demo')
      .type('{enter}');

    cy.get('.main .todo-list .view').contains('Demo');
  });
});
