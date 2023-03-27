# API Documentation

> GET `/`

Request:
>...

Response:
* `status: 200`
>`Welcome to Chatt Instant Messaging`

.\
.

> GET  `/api/v1/status`

Request:
>...

Response:
* `status: 200`
>`{ "db": <boolean>, "redis": <boolean> }`

.\
.
> GET  `/api/v1/status`

Request:
>...

Response:
* `status:  200`
>`{ "users": <number of users>, "messages": <number of messages>, "messageContainers": <number of messsage containers> }`

.\
.
> POST `/api/v1/auth/register`

Request:
>`{ "username": <username>, "email": <email>, "password": <password> }`

Response:
* `status:  201`
>`{ "id": <objectId>, "username": <username>, "email": <email> }`

.\
.
> GET `/api/v1/auth/login`

Request:
> * Headers :\
>"`Authorization: Bearer <base64_auth_string>`"

Response:
* `status:  200`
> * Headers:\
>"`Set_Cookie: X-Token=<authentication token>`"
>
>`{ "token": <authentication token> }`

.\
.
> DELETE `/api/v1/auth/logout`

Request:
> * Headers :\
>"`X-Token: <authentication token>`"

Response:
* `status:  200`
>`{}`

.\
.
> GET `/api/v1/users/me`

Request:
> * Headers :\
>"`X-Token: <authentication token>`"

Response:
* `status:  200`
> * Headers:\
>"`Set_Cookie: X-Token=<authentication token>`"
>
>`{ "id": <objectId>, "username": <username>, "email": <email> }`

.\
.
> GET `/api/v1/users/all`

Request:
> * Headers :\
>"`X-API-Key: <API Key>`"

Response:
* `status:  200`

>`{ "id": <objectId>, "username": <username>, "email": <email> }`

.\
.
> POST `/api/v1/messages/new`

Request:
> * Headers :\
>"`X-Token: <authentication token>`"
>
>`{ "message": <message>, "type": <message type>, "receiverId": <receiverId>, "containerId": <containerId> }`

Response:
* `status:  201`
> * Headers:\
>"`Set_Cookie: X-Token=<authentication token>`"
>
>`{ sentMessage: { "message": <message>, "type": <message type>, "timestamp": <date and time >, "username": <username>, "senderId": <senderId (UserId)>, "receiverId": <receiverId>, "containerId": <containerId> }, updatedContainer: { "id": <ObjectId>, "lastMessage": <message>, "timestamp": <date and time 1>, "members": [<senderId>, <receiverId>], "numberOfMessages": <number of messages in container> } }`

.\
.
> GET `/api/v1/messages/:containerId/all`

Request:
> * Headers :\
>"`X-Token: <authentication token>`"

Response:
* `status:  200`
> * Headers:\
>"`Set_Cookie: X-Token=<authentication token>`"
>
>`[{ "id": <ObjectId 1>, "message": <message 1>, "type": <message type 1>, "timestamp": <date and time 1>, "senderId": <senderId 1>, "receiverId": <receiverId 1>, "containerId": <containerId> }, { "id": <ObjectId 2>, "message": <message 2>, "type": <message type 2>, "timestamp": <date and time 2>, "senderId": <senderId 2>, "receiverId": <receiverId 2>, "containerId": <containerId> }, ...]`

.\
.
> GET `/api/v1/container`

Request:
> * Headers :\
>"`X-Token: <authentication token>`"\
>
>`{ "receiverId": <receiverId> }`

Response:
* `status:  200/201`
> * Headers:\
>"`Set_Cookie: X-Token=<authentication token>`"
>
>`{ "id": <ObjectId>, "lastMessage": <message>, "timestamp": <date and time 1>, "members": [<senderId>, <receiverId>], "numberOfMessages": <number of messages in container> }`

.\
.
> GET `/api/v1/containers/:containerId`

Request:
> * Headers :\
>"`X-Token: <authentication token>`"

Response:
* `status:  200`
> * Headers:\
>"`Set_Cookie: X-Token=<authentication token>`"
>
>`{ "id": <ObjectId>, "lastMessage": <message>, "timestamp": <date and time 1>, "members": [<senderId>, <receiverId>], "numberOfMessages": <number of messages in container> }`

.\
.
> GET `/api/v1/containers/all`

Request:
> * Headers :\
>"`X-Token: <authentication token>`"

Response:
* `status:  200`
> * Headers:\
>"`Set_Cookie: X-Token=<authentication token>`"
>
>`[{ "id": <ObjectId 1>, "lastMessage": <message 1>, "timestamp": <date and time 1>, "members": [<senderId>, <receiverId>], "numberOfMessages": <number of messages in container 1> },{ "id": <ObjectId 2>, "lastMessage": <message 2>, "timestamp": <date and time 2>, "members": [<senderId>, <receiverId>], "numberOfMessages": <number of messages in container> 2 }, ...]`