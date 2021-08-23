# Backend for Crítica Overview

Critica is a Book rating and recommending application. Crítica Backend provides rich API's, Authentication and Authorization, Notifications, Payment and Database connection(Firestore) to the [Crítica Frontend](https://github.com/LuciKritZ/critica).


# Contributers
Links:

-   [Crítica Backend](https://github.com/sameer-555/critica-backend).

-   [Crítica Frontend](https://critica-frontend.netlify.app/)

-   [Backend Host](https://critica-production.herokuapp.com/)

Created by:

-   Sameer Borkar

    -   [GitHub](https://github.com/sameer-555)
    -   [LinkedIn](https://www.linkedin.com/in/sameer-borkar-3809b0b3/)

-   Tirth Patel

    -   [GitHub](https://github.com/tirth089)
    -   [LinkedIn](https://www.linkedin.com/in/tirth-p-7191b7215/)

-   Krishal Shah
    -   [GitHub](https://github.com/LuciKritZ)
    -   [LinkedIn](https://www.linkedin.com/in/krishal-shah/)


##  Requirements

 - Nodejs
 - Git
 
 Nodejs environment is required to run this application, Git is required to pull the project from github.

## Dependencies 
Node packages used in the project.
 - cors
 - dotenv
 - express
 - firebase
 - jsonwebtoken
 - node-cron
 - nodemailer
 - stripe

## Development setup

Step 1:- Take the pull of the project.
Step 2:- Go to root folder of the project and run below command.
> npm install

Step 3:- Install Dev dependencies using commands below.
> npm install nodemon --save-dev
> npm install jest --save-dev
> npm install supertest --save-dev

Step 3:- Create .env file in root folder.
Step 4:- Add env variables from environment section.
Step 5:- Run the command below and backend is up!
>npm run dev
 

## Production Deployment  With Heroku

This applican can be easily deployed using [heroku](https://dashboard.heroku.com/apps)

Step 1: Install Heroku CLI
Step 2: Add env variables from environment section.
> Optional: if you want to deploy it automatically when you push the code to github, please read  [Heroku Integration](https://devcenter.heroku.com/articles/github-integration) 

## Enviroment Variable and Setup
[Create firebase](https://console.firebase.google.com/u/0/) project and get the credentails from project setting.


|Variable Name                |     Value            
|----------------|------------------------------
|API_KEY|`your firebase project's api key`  
|AUTH_DOMAIN|`your firebase project's auth domain`     
|PROJECT_ID |`your firebase project's project id`
STORAGE_BUCKET|`your firebase project's storage bucket`
MESSAGE_SENDER_ID|`your firebase project's message sender id`
|APP_ID|`your firebase project's app id`
|MESURMENT_ID|`your firebase project's mesurment id`
|PORT| `8000`
|HOST|`localhost`
|HOST_URL|`http://localhost:8000`
|ACCESS_TOKEN_SECRET|`create access token`
|EMAIL_ADDRESS|`email address using which you will send notifications`
|EMAIL_PASSWORD|`email password`
|BLOCK_MAIL|`1` to block the mails
|STRIP_SECRET_KEY|`strip secret key`

