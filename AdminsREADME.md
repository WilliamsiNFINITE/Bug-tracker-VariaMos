# Informations for VariaMos team
This file is intended for VariaMos developers.

## Google reCAPTCHA
Once the Bug Tracker is added to VariaMos, the `GoogleReCaptchaKey` variable in `client/src/utils/variables` needs to be changed.

The current one only works for localhost.

You need to create a new one [here](https://www.google.com/recaptcha/admin/create).

## Github REST API
In order to use the Github REST API to link the Bug Tracker to Github Issues a **personal access token** is required.

It should be created by the owner of the VariaMos github repository.

To create it go to **Settings > Developer settings > Personnal access token** and select the scope **repo**.

Then change the `GithubPersonnalToken`, `GithubRepo` and `GithubUser` variables in `server/src/utils/variables` to match the newly created token and the names of the VariaMos repository and its owner.

*Note: The token is deleted if it is pushed to github (for security)*

