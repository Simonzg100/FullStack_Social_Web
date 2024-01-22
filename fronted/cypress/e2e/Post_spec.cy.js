/* eslint-disable */
describe('post spec', () => {
  
  it('creates a new post and verifies its visibility in the activity feed', () => {
    cy.visit('http://localhost:3000/user/login'); 
    cy.get('#username').type('username');
    cy.get('#password').type('password');
    cy.get('button').contains('Login').click();
    cy.contains('Post Something').click();

    cy.get('input[placeholder="Title"]').type('Test Photo Post');
    cy.get('textarea[placeholder="Content"]').type('This is a test photo post.');
    cy.get('input[type="file"]').attachFile('testPhoto.jpg');
    cy.contains('Upload New Media').click();
    cy.contains('Upload complete').should('be.visible'); 
    cy.contains('Add Post').click();
    cy.contains('Profile').click();
    cy.contains('Test Photo Post').should('be.visible');
    cy.contains('This is a test photo post.').should('be.visible'); 
    cy.contains('Return to Activities').click();
    cy.contains('Logout').click();
  });
})

