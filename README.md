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
## Initialize and seed the database (One time only)
_NOTE: at some point in the future, this part should be automatically done or the database seed code should be in a script file._
- Create a database in MongoDB called `personal-website`.
	- `use personal-website`.
- Create a collection `users` and add a user:
	- `db.users.insertOne({username:"admin", password: "123"})`.
- Create a collection `content` and add first page content:
	- `db.content.insertOne({_id:'home', content :'enter some text...'})`.
- Create a collection `categories`:
	- `db.categories.insertOne({name:'category name', desc: 'description of the category...'})`.
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
