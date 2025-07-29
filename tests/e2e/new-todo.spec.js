describe('New todo', () => {
  afterEach(function () {
    if (this.currentTest.state === 'failed') {
      cy.screenshot(`${this.currentTest.title} (failure)`);

      cy.document().then((doc) => {
        const html = doc.documentElement.outerHTML;
        cy.writeFile(`cypress/failures/${this.currentTest.title}.html`, html);
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
