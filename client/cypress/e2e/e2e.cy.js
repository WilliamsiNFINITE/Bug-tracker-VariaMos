describe('testing application without backend', ()=>{
  // Following test is commented because it does not test a functionnal but an aesthetic feature.
  // it('user should be able to use dark mode', () => {
  //   cy.visit('http://localhost:3000');
  //   cy.get('button[type="button"][tabindex="0"][style="min-width: 0px; padding: 0.3em; border-radius: 2em; margin-left: 1em;"]').click();
  //   cy.wait(4000)
  //   cy.get('button[type="button"][tabindex="0"][style="min-width: 0px; padding: 0.3em; border-radius: 2em; margin-left: 1em;"]').click();
  //
  // })

  describe('user should be able to manage profiles', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000');
    })
    it('user should be able to sign up', () => {
      //Go to the form
      cy.findByRole('button', {
        name: /sign up/i
      }).click()

      //Put a username with the minimum number of characters
      cy.get('input[name="username"]').type('u');
      cy.findByText('Must be at least 3 characters').should('be.visible')
      cy.get('input[name="username"]').clear().type('username');

      //Put a password with the minimum number of characters
      cy.get('input[name="password"]').type('pass');
      cy.findByText('Must be at least 6 characters').should('be.visible')
      cy.get('input[name="password"]').clear().type('password');

      //Put a different password
      cy.get('input[name="confirmPassword"]').type('pass');
      cy.findByText('Must be at least 6 characters').should('be.visible')
      cy.get('input[name="confirmPassword"]').clear().type('passwords');

      //Verify the email adress is right
      cy.get('input[name="email"]').type('invalidemail');
      cy.findByText('Invalid email adress.').should('be.visible')
      cy.get('input[name="email"]').clear().type('valid@mail.com');

      //Verify that the second password should be the same
      cy.get('button[type="submit"]').click();
      cy.findByText('Both passwords need to match.').should('be.visible')

      //Changing the second password and save the profile
      cy.get('input[name="confirmPassword"]').clear().type('password');
      cy.get('button[type="submit"]').click();
      cy.findByText('Network Error').should('be.visible')

    })
    it('user should be able to log in', () => {
      //Go to form
      cy.findByRole('button', {
        name: /log in/i
      }).click()

      //fill the form and log in
      cy.get('input[name="username"]').type('username');
      cy.get('input[name="password"]').type('password');
      // cy.get('button[class="MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeSmall"]').click() //The button to see the password
      cy.get('button[type="submit"]').click()
      cy.findByText('Network Error').should('be.visible')

    })
  })

  describe('user should be able to manage bugs', () => {
    it('user should be able to report a bug', () => {
      //Visit the application
      cy.visit('http://localhost:3000');

      //Open form
      cy.findByRole('button', {  name: /add bug/i}).click()

      //Put a title without the minimum number of characters
      cy.get('input[name="title"]').type('t');
      cy.findByText('Must be at least 3 characters').should('be.visible')
      cy.get('input[name="title"]').clear();

      //Check if the textbox is empty
      cy.findByText('Required').should('be.visible')

      //Put a title with too many characters
      let wrongText = 'x'
      cy.get('input[name="title"]').type(wrongText.repeat(70));
      cy.findByText('Must be at most 60 characters').should('be.visible')
      cy.get('input[name="title"]').clear();

      //Put a valid title
      cy.get('input[name="title"]').type('title');

      //Check if description is empty and add a description.
      cy.get('textarea[name="description"]').type('d');
      cy.get('textarea[name="description"]').clear();
      cy.findByText('Required').should('be.visible')
      cy.get('textarea[name="description"]').type('description');

      //Changing the priority
      cy.findByRole('radio', {
        name: /high/i
      }).click();
      cy.findByRole('radio', {
        name: /medium/i
      }).click();

      // cy.findByRole('button', {  name: /create new bug/i}).click()

      // cy.findByText('Network Error').should('be.visible')

      cy.get('button[class="MuiButtonBase-root MuiIconButton-root Component-closeButton-67"]').click()
    })
  })
})

