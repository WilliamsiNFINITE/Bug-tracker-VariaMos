describe('user should be able to manage profiles', () => {

  beforeEach(()=>{
    cy.visit('http://localhost:3000');
  })
  it('user should be able to sign up', () => {
    // eslint-disable-next-2-line no-undef

    cy.findByRole('button', {
      name: /sign up/i
    }).click()

    cy.get('input[name="username"]').type('u');
    cy.findByText('Must be at least 3 characters').should('be.visible')
    cy.get('input[name="username"]').clear().type('username');

    cy.get('input[name="password"]').type('pass');
    cy.findByText('Must be at least 6 characters').should('be.visible')
    cy.get('input[name="password"]').clear().type('password');

    cy.get('input[name="confirmPassword"]').type('pass');
    cy.findByText('Must be at least 6 characters').should('be.visible')
    cy.get('input[name="confirmPassword"]').clear().type('passwords');

    cy.get('input[name="email"]').type('email@email.com');

    cy.get('button[type="submit"]').click();

    cy.findByText('Both passwords need to match.').should('be.visible')

    cy.get('input[name="confirmPassword"]').clear().type('password');

    cy.get('button[type="submit"]').click();

    cy.findByText('Network Error').should('be.visible')

  })

  it('user should be able to log in', () => {
    // eslint-disable-next-2-line no-undef

    cy.findByRole('button', {
      name: /log in/i
    }).click()


    cy.get('input[name="username"]').type('username');
    cy.get('input[name="password"]').type('password');

    cy.get('button[class="MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeSmall"]').click()

    cy.get('button[type="submit"]').click()

    cy.findByText('Network Error').should('be.visible')
  })

  it('user should be able to report a bug', () => {
    // eslint-disable-next-2-line no-undef

    cy.findByRole('button', {  name: /add bug/i}).click()

    cy.findByRole('button', {  name: /create new bug/i}).click()

    cy.get('input[name="title"]').type('t');
    cy.findByText('Must be at least 3 characters').should('be.visible')
    cy.get('input[name="title"]').clear();
    cy.findByText('Required').should('be.visible')
    cy.get('input[name="title"]').type('title');

    cy.get('textarea[name="description"]').type('d');
    cy.get('textarea[name="description"]').clear();
    cy.findByText('Required').should('be.visible')
    cy.get('textarea[name="description"]').type('description');

    cy.findByRole('radio', {
      name: /high/i
    }).click();
    cy.findByRole('radio', {
      name: /medium/i
    }).click();

    cy.findByRole('button', {  name: /create new bug/i}).click()

    cy.findByText('Network Error').should('be.visible')

    cy.get('button[class="MuiButtonBase-root MuiIconButton-root Component-closeButton-67"]').click()


  })

})
