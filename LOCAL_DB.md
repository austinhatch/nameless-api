# Local DB Setup

Prisma requires a replicaset for mongo in order to function even in development. 
This enforces transactional updates in development environments to avoid introducing unexpected behavior when moving to a production environment


## Open new terminal execute below command (dbpath must exist in directory)
`mongod --port=27017 --dbpath=./data/db --replSet=rs0`
## Open another terminal window execute below command to connect to running Mongo Instance
`mongo`
## Then below command
`rs.initiate( {    _id : "rs0", members: [ { _id: 0, host: "localhost:27017" } ] })`
## your new connection String
`mongodb://localhost:27017`