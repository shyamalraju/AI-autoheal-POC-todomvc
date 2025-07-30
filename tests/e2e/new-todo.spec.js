describe('New todo', () => {
  afterEach(function () {
    if (this.currentTest.state === 'failed') {
      const testTitle = this.currentTest.title //.replace(/[<>:"\/\\|?*]+/g, '-'); // Sanitize filename
      const errorMessage = this.currentTest.err?.stack || this.currentTest.err?.message || 'Unknown error';

      cy.screenshot(`${testTitle} (failure)`);

      cy.window({ log: false }).then((win) => {
        const html = win.document.documentElement.outerHTML;
        cy.writeFile(`cypress/failures/${testTitle}.html`, html);
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
