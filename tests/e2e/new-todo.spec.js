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

        // Write test context
        const testContext = {
          testName: this.currentTest.title,
          testFile: Cypress.spec.relative,
          specFile: Cypress.spec.name,
          timestamp: new Date().toISOString()
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
