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
