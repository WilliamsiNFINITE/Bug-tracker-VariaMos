describe('testing application with backend', ()=>{
  // Following test is commented because it does not test a functionnal but an aesthetic feature.
  // it('user should be able to use dark mode', () => {
  //   cy.visit('http://localhost:3000');
  //   cy.get('button[type="button"][tabindex="0"][style="min-width: 0px; padding: 0.3em; border-radius: 2em; margin-left: 1em;"]').click();
  //   cy.wait(4000)
  //   cy.get('button[type="button"][tabindex="0"][style="min-width: 0px; padding: 0.3em; border-radius: 2em; margin-left: 1em;"]').click();
  //
  // })

  describe('user should be able to manage profiles', () => {
    beforeEach(()=>{
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
      cy.findByText('Hi, username! Welcome to Bug Tracker :D').should('be.visible')

    })
    it('user should not be able to sign up if username is taken', () => {
      //Go to the form
      cy.findByRole('button', {
        name: /sign up/i
      }).click()

      //Fill the form
      cy.get('input[name="username"]').type('username');
      cy.get('input[name="password"]').type('password');
      cy.get('input[name="confirmPassword"]').type('password');
      cy.get('input[name="email"]').type('valid@mail.com');
      cy.get('button[type="submit"]').click();

      //Check that saving the profile is impossible
      cy.findByText('Username \'username\' is already taken.').should('be.visible')

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
      cy.findByText('Welcome back, username!').should('be.visible')

    })
    it('user should not be able to log in if info are incorrect',()=>{
      //Go to place
      cy.findByRole('button', {
        name: /log in/i
      }).click()

      //Enter wrong credits
      cy.get('input[name="username"]').type('false_username');
      cy.get('input[name="password"]').type('false_password');
      cy.get('button[type="submit"]').click()
      cy.findByText('User: \'false_username\' not found.\n').should('be.visible')

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

      //Create the bug and verify is has been created
      cy.findByRole('button', {  name: /create new bug/i}).click()
      cy.findByText('title').should('be.visible')
    })
    it('user should not be able to create twice the same bug', ()=>{
      //Open and fill form
      cy.findByRole('button', {  name: /add bug/i}).click()
      cy.get('input[name="title"]').type('title');
      cy.get('textarea[name="description"]').type('description');
      cy.findByRole('button', {  name: /create new bug/i}).click()

      //Assert that it cant be added
      cy.findByText('A reported bug already has this title. Make sure this issue has not already been reported.').should('be.visible')

      cy.get('button[class="MuiButtonBase-root MuiIconButton-root Component-closeButton-67"]').click()

    })
    it('creating other bugs for testing purposes',()=>{
      //Bug#2
      cy.findByRole('button', {  name: /add bug/i}).click()
      cy.get('input[name="title"]').type('title2');
      cy.get('textarea[name="description"]').type('description');
      cy.findByRole('radio', {name: /high/i}).click();
      cy.findByRole('button', {  name: /create new bug/i}).click()

      //Bug#3
      cy.findByRole('button', {  name: /add bug/i}).click()
      cy.get('input[name="title"]').type('title3');
      cy.get('textarea[name="description"]').type('description');
      cy.findByRole('button', {  name: /create new bug/i}).click()

    })
    it('user should be able to leave a note', ()=> {
      //find a bug to leave a note
      cy.findByRole('cell', {
        name: /title/i
      }).click()
      cy.findByText('No notes added yet.').should('be.visible')

      //Open form, type the note and submit
      cy.findByRole('button', {
        name: /leave a note/i
      }).click();
      cy.findByRole('textbox').type('This is my note')
      cy.findByRole('button', {
        name: /submit note/i
      }).click()

      //Check if it was added
      cy.findByText('Reply').should('be.visible')

    })
    it('user should be able to edit a note',()=>{
      cy.findByText('Edit').click()
      cy.findByRole('textbox').clear().type('This is my edited note')
      cy.findByRole ('button', {
        name: /submit response/i
      }).click()
    })
    it('user should be able to reply to notes', ()=>{
      cy.findByText('Reply').click()
      cy.findByRole('textbox').type('This is my reply')
      cy.findByRole ('button', {
        name: /submit response/i
      }).click()

    })
    it('Creating other notes for testing purposes',()=>{

      //Note#2
      cy.findByRole('button', {
        name: /leave a note/i
      }).click();
      cy.findByRole('textbox').type('This is my second note')
      cy.findByRole('button', {
        name: /submit note/i
      }).click()

      //Note#3
      cy.findByRole('button', {
        name: /leave a note/i
      }).click();
      cy.findByRole('textbox').type('This is my last note')
      cy.findByRole('button', {
        name: /submit note/i
      }).click()

    })
    it('user should be able to sort notes', ()=>{
      //TODO

      cy.findByRole('button', {
        name: /sort notes by/i
      }).click()

      cy.findByRole('option', {
        name: /oldest/i
      }).click()
      //TODO assert for changes

      cy.findByRole('button', {
        name: /sort notes by/i
      }).click()

      cy.findByRole('option', {
        name: /recently updated/i
      }).click()
      //TODO assert for changes


      cy.findByRole('button', {
        name: /sort notes by/i
      }).click()

      cy.findByRole('option', {
        name: /newest/i
      }).click()
      //TODO assert for changes

    })
    it('user should be able to search bugs', ()=>{
      //TODO : type title2
      cy.findByRole('textbox').type('title2')
      //TODO : erase button
      cy.get('button[class="MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeSmall"]').click()
      cy.findByRole('textbox').type('title2')

      //TODO verify element not on screen (title)
      //TODO : check results if positive



      //TODO : type negative
      cy.findByRole('textbox').clear().type('negative_bug')
      //TODO : check results if negative ('No matches found.')
      cy.findByText('No matches found.').should('be.visible')

    })
    it('user should be able to close a bug',()=>{
      //TODO : want to close title 2 to sort by recent closed after
      cy.get('').should('be.visible')
    })
    it('user should be able to filter the bugs ', ()=>{


      cy.visit('http://localhost:3000');
      cy.findByRole('radio', {
        name: /closed/i
      }).click()
      //TODO check if change was made
      cy.wait(5000)

      cy.visit('http://localhost:3000');
      cy.findByRole('radio', {
        name: /open/i
      }).click()
      //TODO check if change was made
      cy.wait(5000)

      cy.visit('http://localhost:3000');
      cy.findByRole('radio', {
        name: /all/i
      }).click()
      //TODO check if change was made
      cy.wait(5000)

    })
    it('user should be able to re-open a bug',()=>{
      cy.get('').should('be.visible')
    })
    it('user should be able to sort the bugs ', ()=>{
      cy.findByRole('button', {
        name: /sort bugs by/i
      }).click();

      cy.findByRole('option', {
        name: /oldest/i
      }).click()

      //TODO : title az, --> verify that title is first

      cy.wait(1000)

      //TODO : title az, --> verify that title is first
      cy.findByRole('button', {
        name: /sort bugs by/i
      }).click();

      cy.findByRole('option', {
        name: /title \(a \- z\)/i
      }).click()

      cy.wait(1000)
      //TODO : title za, --> verify that title2 is first
      cy.findByRole('button', {
        name: /sort bugs by/i
      }).click();

      cy.findByRole('option', {
        name: /title \(z \- a\)/i
      }).click()

      cy.wait(1000)
      //TODO : prio hl,--> verify that title2 is first
      cy.findByRole('button', {
        name: /sort bugs by/i
      }).click();

      cy.findByRole('option', {
        name: /priority \(high \- low\)/i
      }).click()

      cy.wait(1000)
      //TODO : prio lh,--> verify that title is first
      cy.findByRole('button', {
        name: /sort bugs by/i
      }).click();

      cy.findByRole('option', {
        name: /priority \(low \- high\)/i
      }).click()

      cy.wait(1000)
      //TODO : recent clsd,
      cy.findByRole('button', {
        name: /sort bugs by/i
      }).click();

      cy.findByRole('option', {
        name: /recently closed/i
      }).click()

      cy.wait(1000)
      //TODO : recent r-opnd,
      cy.findByRole('button', {
        name: /sort bugs by/i
      }).click();

      cy.findByRole('option', {
        name: /recently re\-opened/i
      }).click()

      cy.wait(1000)
      //TODO : recent updtd,
      cy.findByRole('button', {
        name: /sort bugs by/i
      }).click();

      cy.findByRole('option', {
        name: /recently updated/i
      }).click()

      cy.wait(1000)
      //TODO : most notes,
      cy.findByRole('button', {
        name: /sort bugs by/i
      }).click();

      cy.findByRole('option', {
        name: /most notes/i
      }).click()

      cy.wait(1000)
      //TODO : least notes,
      cy.findByRole('button', {
        name: /sort bugs by/i
      }).click();

      cy.findByRole('option', {
        name: /least notes/i
      }).click()

      cy.wait(1000)
      //TODO : Newest,
      cy.findByRole('button', {
        name: /sort bugs by/i
      }).click();

      cy.findByRole('option', {
        name: /newest/i
      }).click()

      cy.wait(1000)
    })
  })
})
