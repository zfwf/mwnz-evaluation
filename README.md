# mwnz-evaluation
For tech evaluation at MWNZ.

## Usage
Start the project with `npm run dev` command. 
After starting, open the http://localhost:3000/ URL in your browser. 
On the welcome page you can test the generated services via API Gateway and check the nodes & services.

In the terminal, try the following commands:
- `nodes` - List all connected nodes.
- `actions` - List all registered service actions.
- `call companies.getDetailById --id <a company id>` - Call the `companies.getDetailById` action with the `id` parameter.



## Services
- **api**: API Gateway services
- **companies**: A service to provide detail of an available company via the `getDetailById` action.


## Useful links
* Evaluation instructions: https://github.com/MiddlewareNewZealand/evaluation-instructions

## NPM scripts

- `npm run dev`: Start development mode (load all services locally with hot-reload & REPL)
- `npm run start`: Start production mode (set `SERVICES` env variable to load certain services)
- `npm run cli`: Start a CLI and connect to production. Don't forget to set production namespace with `--ns` argument in script
- `npm run lint`: Run ESLint
- `npm run ci`: Run continuous test mode with watching
- `npm test`: Run tests & generate coverage report
- `npm run dc:up`: Start the stack with Docker Compose
- `npm run dc:down`: Stop the stack with Docker Compose
