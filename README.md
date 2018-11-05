# Description
A minimal personal resume/blog/website, with admin controls that can also be used as a template to develop other websites and REST APIs.

Technologies and tools used in this project:
- NodeJS
- MongoDB
- Pug
- ExpressJS
- Bootstrap 4

# Build and Run
Project is build using NodeJS, MongoDB.
## Install dependencies
- Install NodeJS.
- Install MongoDB.
## Install Node packages
- `npm install express`
- `npm install express-fileupload`
- `npm install express-session`
- `npm install mongodb`
- `npm install pug`
- `npm install passport`
- `npm install passport-local`
## Initialize Database
- Create a database in MongoDB called `personal-website`.
	- `use personal-website`
- Create a collection `users` and add a user:
	- `db.insertOne({username:"admin", password: "123"})`.
## Run
- Start NodeJS.
- Start MongoDB.
	- On Linux: `sudo service mongod start`.
- `node app.js`
- Navigate to `localhost:4000` in your browser.

# Contribute
You are welcome to contribute by:
- Work on tasks [here](https://github.com/sharabiania/blogs/projects/1),
- Creating issues / suggestions,
- Creating Pull Request for:
	- bug fixes
	- new features
	- improvment
	- documentation
- Reviewing Pull Requests,
- Look for `TODO` tags in the code and complete them.
