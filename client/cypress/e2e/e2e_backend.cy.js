/* eslint no-use-before-define: 0 */
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
    beforeEach(() =>{
      cy.visit('http://localhost:3000');
    })
    it('user should be able to sign up', ()=>{
      cy.wait(1500)
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

      //Put a wrong email adress
      cy.get('input[name="email"]').type('invalidemail');

      //Verify that the second password should be the same
      cy.get('button[type="submit"]').click();
      cy.findByText('Both passwords need to match.').should('be.visible')

      //Changing the second password
      cy.get('input[name="confirmPassword"]').clear().type('password');

      //Verify the email and save profile
      cy.get('button[type="submit"]').click();
      cy.findByText('Invalid email adress.').should('be.visible')
      cy.get('input[name="email"]').clear().type('valid@mail.com');
      cy.get('button[type="submit"]').click();
      cy.findByText('Hi, username! Welcome to Bug Tracker :D').should('be.visible')

    })
    it('user should not be able to sign up if username is taken', ()=>{
      cy.wait(1500)
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
    it('user should be able to log in', ()=>{
      cy.wait(1500)
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
      cy.wait(1500)
      //Go to place
      cy.findByRole('button', {
        name: /log in/i
      }).click()

      //Enter wrong credits
      cy.get('input[name="username"]').type('false_username');
      cy.get('input[name="password"]').type('false_password');
      cy.get('button[type="submit"]').click()
      cy.findByText("User: 'false_username' not found.").should('be.visible')

    })
  })

  describe('user should be able to manage bugs', () => {
    describe('user should be able to report bugs', () => {
      beforeEach(() =>{
        cy.visit('http://localhost:3000');
        //Logging in
        cy.findByRole('button', {name: /log in/i }).click()
        cy.get('input[name="username"]').type('username2');
        cy.get('input[name="password"]').type('password');
        cy.get('button[type="submit"]').click()
        cy.wait(1500)

      })
      it('user should be able to report a bug without login', ()=>{
        //Log out
        cy.findByRole('button', {
          name: /log out/i
        }).click()
        cy.wait(1000)

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

        //Changing the priority (medium with 4)
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
        cy.wait(1500)
        //Open and fill form
        cy.findByRole('button', {  name: /add bug/i}).click()
        cy.get('input[name="title"]').type('title');
        cy.get('textarea[name="description"]').type('description');
        cy.findByRole('button', {  name: /create new bug/i}).click()

        //Assert that it cant be added
        cy.findByText('A reported bug already has this title. Make sure this issue has not already been reported.').should('be.visible')
      })

      it('user should be able to see bug details', ()=>{
        cy.get('button[class="MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeSmall"]').click()
        cy.findByRole('menuitem', {
          name: /bug details/i
        }).click()

        cy.findByText('ERROR: Page Not Found!').should('be.visible')
      })
      it('admin should be able to assign a bug', ()=>{
        //Assign the bug to username2
        cy.get('button[class="MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeSmall"]').click()
        cy.findByRole('menuitem', {
          name: /assign bug/i
        }).click()

        cy.findByRole('textbox', {
          name: /select admin\(s\) to assign the bug to/i
        }).type('username3')

        cy.findByText('username3').click()

        cy.findByRole('button', {
          name: /assign bug/i
        }).click()

      })
      it('admin user should be able to close a bug and cancel', ()=>{
        //cancel
        cy.get('button[class="MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeSmall"]').click()
        cy.findByRole('menuitem', {
          name: /close bug/i
        }).click()
        cy.findByRole('button', {
          name: /cancel/i
        }).click()

      })
      it('user should be able to close a bug',()=>{
        //Delete
        cy.get('button[class="MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeSmall"]').click()
        cy.findByRole('menuitem', {
          name: /close bug/i
        }).click()
        cy.findByRole('button', {
          name: /close bug/i
        }).click()

      })
      it('user should be able to re-open a bug',()=>{
        cy.get('button[class="MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeSmall"]').click()
        cy.findByRole('menuitem', {
          name: /re-open bug/i
        }).click()
        cy.findByRole('button', {
          name: /re-open bug/i
        }).click()

      })
      it('admin user should be able to delete a bug and cancel', ()=>{
        //cancel
        cy.get('button[class="MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeSmall"]').click()
        cy.findByRole('menuitem', {
          name: /delete bug/i
        }).click()
        cy.findByRole('button', {
          name: /cancel/i
        }).click()

      })
      it('admin user should be able to delete a bug', ()=>{
        //Delete
        cy.get('button[class="MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeSmall"]').click()
        cy.findByRole('menuitem', {
          name: /delete bug/i
        }).click()
        cy.findByRole('button', {
          name: /delete bug/i
        }).click()

      })

    })
    describe('creating data for testing purposes', () => {
      beforeEach(() =>{
        cy.visit('http://localhost:3000');

      })
      it('creating one bug to close',()=>{
        //Logging in
        cy.findByRole('button', {name: /log in/i }).click()
        cy.get('input[name="username"]').type('username2');
        cy.get('input[name="password"]').type('password');
        cy.get('button[type="submit"]').click()
        cy.wait(1500)

        //Bug#2 high prio with 5
        cy.findByRole('button', {  name: /add bug/i}).click()
        cy.get('input[name="title"]').type('title2');
        cy.get('textarea[name="description"]').type('description');
        cy.findByRole('radio', {name: /high/i}).click();
        cy.findByRole('button', {  name: /create new bug/i}).click()

      })
      it('closing the previous bug',()=>{
        //Logging in
        cy.findByRole('button', {name: /log in/i }).click()
        cy.get('input[name="username"]').type('username2');
        cy.get('input[name="password"]').type('password');
        cy.get('button[type="submit"]').click()

        cy.wait(1500)
        //Delete
        cy.get('button[class="MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeSmall"]').click()
        cy.findByRole('menuitem', {
          name: /close bug/i
        }).click()
        cy.findByRole('button', {
          name: /close bug/i
        }).click()

      })
      it('creating other bugs', ()=>{

        //Bug#3 low prio alone
        cy.findByRole('button', {  name: /add bug/i}).click()
        cy.get('input[name="title"]').type('title3');
        cy.get('textarea[name="description"]').type('description');
        cy.findByRole('button', {  name: /create new bug/i}).click()

        //Bug#4 medium prio with 1
        //Bug#5 high prio with 2
      })
      it('creating notes',()=>{
        //find a bug to leave a note
        cy.findByRole('cell', {
          name: 'title2'
        }).click()

        //Check there is not any note
        cy.findByRole('heading', {
          name: /no notes added yet\./i
        })

        //Note#2
        cy.findByRole('button', {
          name: /leave a note/i
        }).click();
        cy.findByRole('textbox').type('T').clear().type('This is my first note')
        cy.findByRole('button', {
          name: /submit note/i
        }).click()

        //Check if it was added
        cy.findByText('Reply').should('be.visible')

        //Note#3
        cy.findByRole('button', {
          name: /leave a note/i
        }).click();
        cy.findByRole('textbox').type('This is my other note')
        cy.findByRole('button', {
          name: /submit note/i
        }).click()

      })

    })
    describe('user should be able to use note features', () => {
      beforeEach(() =>{
        cy.visit('http://localhost:3000');
        //Logging in
        cy.findByRole('button', {name: /log in/i }).click()
        cy.get('input[name="username"]').type('username2');
        cy.get('input[name="password"]').type('password');
        cy.get('button[type="submit"]').click()
        cy.wait(1500)
      })
      it('user should be able to leave a note while logged in', ()=>{

        //find a bug to leave a note
        cy.findByRole('cell', {
          name: 'title2'
        }).click()

        //Open form, type the note and submit
        cy.findByRole('button', {
          name: /leave a note/i
        }).click();
        cy.findByRole('textbox').type('This is my logged in note')
        cy.findByRole('button', {
          name: /submit note/i
        }).click()

      })
      it('user should be able to edit a note',()=>{

        //find a bug to leave a note
        cy.findByRole('cell', {
          name: 'title2'
        }).click()

        cy.findByText('Edit').click()
        cy.findByRole('textbox').clear().type('This is my edited note')
        cy.findByRole ('button', {
          name: /update note/i
        }).click()

      })
      it('user should be able to leave a note without login', ()=>{

        //find a bug to leave a note
        cy.findByRole('cell', {
          name: 'title2'
        }).click()

        //Log out
        cy.findByRole('button', {
          name: /log out/i
        }).click()
        cy.wait(1000)

        //find a bug to leave a note
        cy.findByRole('cell', {
          name: 'title3'
        }).click()
        // cy.findByText('No notes added yet.').should('be.visible')

        //Open form, type the note and submit
        cy.findByRole('button', {
          name: /leave a note/i
        }).click();
        cy.findByRole('textbox').type('This is my not logged in note')
        cy.findByRole('button', {
          name: /submit note/i
        }).click()

      })
      it('user should be able to reply to notes', ()=>{

        //find a bug to leave a note
        cy.findByRole('cell', {
          name: 'title3'
        }).click()

        cy.findByText('Reply').click()
        cy.findByRole('textbox').type('This is my reply')
        cy.findByRole ('button', {
          name: /submit response/i
        }).click()

      })
      it('user should be able to delete a note',()=>{
        //find a bug to leave a note
        cy.findByRole('cell', {
          name: 'title3'
        }).click()


        cy.findByText('Delete').click()
        cy.findByRole('button', {
          name: /delete note/i
        }).click()

      })


    })
    describe('user should be able to use sorting features', () => {
      beforeEach(() =>{
        cy.visit('http://localhost:3000');
        //Logging in
        cy.findByRole('button', {name: /log in/i }).click()
        cy.get('input[name="username"]').type('username2');
        cy.get('input[name="password"]').type('password');
        cy.get('button[type="submit"]').click()
        cy.wait(1500)

      })
      it('user should be able to search bugs', ()=>{
        //Positive result
        cy.findByRole('textbox').type('title2')
        //TODO : check results if positive

        //Negative result
        cy.findByRole('textbox').clear().type('negative_bug')
        cy.findByText('No matches found.').should('be.visible')

      })
      it('user should be able to filter the bugs', ()=>{
        //Closed
        cy.findByRole('radio', {
          name: /closed/i
        }).click()
        cy.findByText('title2').should('be.visible')
        cy.findByText('title3').should('not.be.visible')

        //Open
        cy.findByRole('radio', {
          name: /open/i
        }).click()
        cy.findByText('title3').should('be.visible')
        cy.findByText('title2').should('not.be.visible')

        //All
        cy.findByRole('radio', {
          name: /all/i
        }).click()
        cy.findByText('title2').should('be.visible')
        cy.findByText('title3').should('be.visible')

        cy.findByRole('radio', {
          name: /mybugs/i
        }).click()
        cy.findByText('title2').should('be.visible')
        cy.findByText('title3').should('not.be.visible')

      })
      it('user should be able to sort the bugs', ()=>{
        //Oldest
        cy.findByRole('button', {name: /sort bugs by/i}).click();
        cy.findByRole('option', {name: /oldest/i}).click()

        //Title A to Z
        cy.findByRole('button', {name: /sort bugs by/i}).click();
        cy.findByRole('option', {name: /title \(a - z\)/i}).click()

        //Title Z to A
        cy.findByRole('button', {name: /sort bugs by/i}).click();
        cy.findByRole('option', {name: /title \(z - a\)/i}).click()

        //Priority high to low
        cy.findByRole('button', {name: /sort bugs by/i}).click();
        cy.findByRole('option', {name: /priority \(high - low\)/i}).click()

        //Priority low to high
        cy.findByRole('button', {name: /sort bugs by/i}).click();
        cy.findByRole('option', {name: /priority \(low - high\)/i}).click()

        //Recent closed
        cy.findByRole('button', {name: /sort bugs by/i}).click();
        cy.findByRole('option', {name: /recently closed/i}).click()

        //Recent re-opened
        cy.findByRole('button', {name: /sort bugs by/i}).click();
        cy.findByRole('option', {name: /recently re-opened/i}).click()

        //Recent updated
        cy.findByRole('button', {name: /sort bugs by/i}).click();
        cy.findByRole('option', {name: /recently updated/i}).click()

        //Most notes
        cy.findByRole('button', {name: /sort bugs by/i}).click();
        cy.findByRole('option', {name: /most notes/i}).click()

        //Least notes
        cy.findByRole('button', {name: /sort bugs by/i}).click();
        cy.findByRole('option', {name: /least notes/i}).click()

        //Newest
        cy.findByRole('button', {name: /sort bugs by/i}).click();
        cy.findByRole('option', {name: /newest/i}).click()

      })
      it('user should be able to sort notes', ()=>{
        //find a bug to leave a note
        cy.findByRole('cell', {
          name: 'title2'
        }).click()

        //Old
        cy.findByRole('button', {name: /sort notes by/i}).click()
        cy.findByRole('option', {name: /oldest/i}).click()

        //Recent
        cy.findByRole('button', {name: /sort notes by/i}).click()
        cy.findByRole('option', {name: /recently updated/i}).click()

        //New
        cy.findByRole('button', {name: /sort notes by/i}).click()
        cy.findByRole('option', {name: /newest/i}).click()

      })

    })

  })
  //
  // describe('user should be able to manage admins', () => {
  //
  // })
  //
  // describe('user should be able to change his settings', () => {
  //
  // })
})
