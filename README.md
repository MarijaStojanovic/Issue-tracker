# Issue   log   application

# Stack
* Node.js v8.3.0+
* Express Framework
* MongoDB v3.4

# Prerequisites
`$ npm install -g nodemon`

# Guidelines
* Prefer ES6
* HTTP requests used:
    * `GET` - The GET method requests a representation of the specified resource. Requests using GET should only retrieve data.
    * `POST` - The POST method is used to submit an entity to the specified resource, often causing a change in state or side effects on the server
    * `PUT` - The PUT method replaces all current representations of the target resource with the request payload.
    * `DELETE` - The DELETE method deletes the specified resource.
    * `PATCH` - The PATCH method is used to apply partial modifications to a resource.

## Run the project

To run the project install the dependencies using the `npm install` command.
Then run a script from `scripts` folder to create admin user and run the project by running `dev.sh` command.

### Project description

Scenario had many situations that were not fully defined. In a real-world project, I would ask client for more info before programming. In this test I had following assumptions:

- There are 2 types of users — admin and regular user.
- Only admin can add new users. This will probably be changed in the future.
- Users can add issues, they can also edit and delete their own issues.
- Everyone can see the issues.
- Issues are in pending status by default, but they can be marked as completed.
- Issues are deleted on destroy action.
- Files are assigned to issue on upload, they are fully deleted on delete action.
- Files are stored to local filesystem, they should be moved S3 or similar service in future. 

Technical info

I used:

- Node.js (version 8+) for the project
- Express framework
- Mongoose library for MongoDB
- git and Github
- Mocha for testing
- JWT for authentication 