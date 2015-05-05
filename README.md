
# Nike

Nike is a todo list API for users to consume and build your own client or use the default client.

## API

Nike has a RESTful API that supports CRUD operations on users and their todos.

### TODO

- Retrieve all the user's todos: `GET /users/:userId/todos`.

- Retrieve a single todo: `GET /users/:userId/todos/:todoId`.

- Create a todo: `POST /users/:userId/todos`.
- Allowed params: `content`, `status`.
- Request payload: `{content: 'your todo content', status: 'whatever your client uses'}`.

- Update a todo: `PATCH /users/:userId/todos/:todoId`.
- Allowed params: `status`, `content`.
- Request payload: `{status: 'your updated status', content: 'your updated content'}`.

- Delete a todo: `DELETE /users/:userId/todos/:todoId`.

### USER

- Create a user: `POST /users/`.
- Allowed params: `name`, `id`.
- Request payload: `{name: 'your name', id: 'yourusername'}`.

- Update a user: `PATCH /users/:userId`.
- Allowed params: `name`.
- Request payload: `{name: 'your corrected name'}`.

- Retrieve a user (and a list of the user's todos): `GET /users/:userId`.

- Delete a user (Not yet implemented): `DELETE /users/:userId`.

## Stack

### Server
-  NodeJS (:heart:)
- Express (:heart:)
- Redis (:heart:)

### Client
- Implement it the way you want. The client is just a UI to interact with the server. You can either use the one I wrote or if you think you can write a better one, go for it.
- The default client that ships with the code is written using AngularJS.
- You can use EmberJS or Knockout or even plain old jQuery to implement your client.
- The reason the `Todo` object has a status and not a `done` (true|false) attribute is to allow the client developers to have the freedom to use the todos the way they want to. Since `status` is a string, it can have whatever values you want. For example, `status` can be used to

## Development

- Clone the repo to your machine - `git clone git@github.com:mohnish/nike.git /path/to/nike`.
- Change to the clone's directory - `cd /path/to/nike`.
- Install the dependencies - `npm install`.
- Fire up redis - `redis-server`.
- Start the server: `npm start`.
- If you want to use `node-dev`, use `make serve` instead of `npm start`. This is recommended for `development` environment (removes the hasstle of restarting the server each time there's a change in code).
- For debugging, use `make debug`.

## Tests

- To run the test suite (from your app root) - `make test` or just `make`.
- To "watch" the tests while you write new tests - `make watch`.

Code contribution is always welcome.

Known Issues: Most of the tests are dependent on the existing data, which should not be the case. Need to update the tests to remove existing data dependencies.

## LICENSE

(The MIT License)

Copyright (c) 2015 Mohnish Thallavajhula &lt;i@mohni.sh&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

