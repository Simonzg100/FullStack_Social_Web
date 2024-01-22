/* eslint-disable */
describe('registration spec', () => {
  it('successfully registers a new user', () => {
    cy.visit('http://localhost:3000/user/register');
    cy.contains('Register').click();
    cy.get('#username-input').type('tinawang');
    cy.get('#first-name-input').type('Tina');
    cy.get('#last-name-input').type('Wang');
    cy.get('#email-input').type('tina.wang@example.com');
    cy.get('#password-input').type('password123');
    cy.get('#major-input').type(' CIS');
    cy.get('button').contains('Register').click();
    cy.contains('Registration successful!').should('be.visible');
  });

  it('shows an error message when username, password, or email are not provided', () => {
    
    cy.visit('http://localhost:3000/user/register');
    cy.get('button').contains('Register').click(); 
    cy.get('#password-input').type('password');
    cy.get('#email-input').type('email@example.com');
    cy.get('button').contains('Register').click();
    cy.contains('Username, password, and email are required!').should('be.visible');
    cy.get('#username-input').type('username');
    cy.get('#email-input').clear();
    cy.get('button').contains('Register').click(); 
    cy.contains('Username, password, and email are required!').should('be.visible');
    cy.get('#email-input').type('email@example');
    cy.get('button').contains('Register').click(); 
    cy.contains('Registration successful!').should('be.visible');
  });
  
});

