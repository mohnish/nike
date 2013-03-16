
## Nike

Nike is just another todo list app. Do It™.

### API

Nike has a RESTful API that supports CRUD operations on users and their todos.

#### TODOs

- Retrieve all the user's todos: `GET /user/:id/todos`.

- Retrieve a single todo: `GET /user/:id/todos/:todoId`.

- Create a todo: `POST /user/:id/todos`.
- - Allowed params: `content`
- - Request payload: `{content: 'your todo content'}`.

- Update a todo: `PATCH /user/:id/todos/:todoId`.
- - Allowed params: `status`, `content`.
- - Request payload: `{status: 'your status', content: 'your updated content'}`. `status` and `content` need not necessarily be used at the same time.

- Delete a todo: `DELETE /user/:id/todos/:todoId`.

#### USERs

- Create a user: `POST /users/`.
- - Allowed params: `name`, `id`
- - Request payload: `{name: 'your name', id: 'yourusername'}`.

- Retrieve a user (and a list of the user's todos): `GET /users/:id`.

- Delete a user (Not yet implemented): `DELETE /users/:id`.

### Stack

- Server
	- NodeJS
	- Express
	- Redis

- Client
	- Implement it the way you want. The client is just a UI to interact with the server. You can either use the one I wrote or if you think you can write a better one, that's even better.
	- The default client that ships with the code is written using AngularJS.
	- You can use EmberJS or Knockout or even plain old jQuery to implement your client.

### Development

- Clone the repo to your machine - `git clone git@github.com:mohnish/nike.git /path/to/nike`.
- Change to the clone's directory - `cd /path/to/nike`.
- Install the dependencies - `npm install`.
- Fire up redis - `redis-server`.
- Start the server: `npm start`.
- If you want to use `node-dev`, use `make serve` instead of `npm start`. This is recommended for `development` environment (removes the hasstle of restarting the server each time there's a change in code).

### Tests

- To run the test suite (from your app root) - `make test` or just `make`.
- To "watch" the tests while you write new tests - `make watch`.

Code contribution is always welcome.

Known Issues: Most of the tests are dependent on the existing data, which should not be the case. Need to update the tests to remove existing data dependencies.

## LICENSE

MIT
