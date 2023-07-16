# Authentication course from TheOdinProject
https://www.theodinproject.com/lessons/nodejs-members-only

- Make app that authenticates user and lets them create messages.
- If user is member of the clubhouse, ie is registered and has the correct password to join the private club, he'll be able to see the messages' authors and timestamps.
- Finally, if user is admin, he'll be able to delete messages.
- Structure of project, a full-stack app !

# Back-end build on express to handle routes and send correct response

App :
- Express
- passport and passport-local for authentication and keep session
- bcryptjs to get hashed passwords
- use of mongoose and models
Database : 
- MongoDb

# Deployment

By far, one of the toughest parts. 
- AWS Lambda and API gateways created thanks to serverless framework.

# Front-end

Views are stored in a s3 bucket then server-side-rendered.