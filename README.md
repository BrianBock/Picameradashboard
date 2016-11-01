# Remote Pi Controller

This will walk you through setting up the Raspberry Pi and Dashboard for remote controlling the Pi.

## Installation


### The Server

You need to configure and deploy the [Remote PI Controller: Server]() repo to the Heroku app.

Clone the [Remote PI Controller: Server]() and install the required dependencies on your computer. 
```
git clone [repo_url]remote-pi-controller-server.git
cd remote-pi-controller-server
npm install
```

In `config/clients.json` change "client-id" to your own unique id for your pi. You can make it any unique string, i.e. "my-super-secret-client-id" or "bananas". This is how we'll validate your Pi's connection to the server.

Now you need to deploy the repo to some server. I suggest using Heroku for this as its free and easy to get started (Plus the project is already configured for it :P). Create a new app in Heroku  and follow the instructions for deploying using Heroku Git.

Once the repo is deployed you should see the dashboard running at your app url.

### The Raspberry Pi

Now that we have the dashboard running we need to set up a Raspberry Pi to control. 

Clone the [Remote PI Controller: Clinet]() repository and install the required dependencies on your Raspberry Pi.
```
git clone [repo_url]remote-pi-controller-client.git
cd remote-pi-controller-client
npm install
```

Now you'll configure your `.env` variables. You need to set `SERVER_URL` to match your app's URL. You also need to set your `CLIENT_ID` to the id you used earlier in the `config/clients.json` file on the server.

And now your Pi is ready to go!
Start the client by running:
```
npm start
```


### Verifying and Testing
Lets take it for a spin. On your app page you should see the Pi listed as online. You can run any of the commands listed! See what happens :)


## Documentation

### Adding a command

#### The Server
Add the command in the `config/commands.json`.

#### The Client
Add the command in the `app/commands.js`.

### Making your own Dashboard

Go into the `.env` on the server and set `GENERATE_UI` to `false`. You can use `dashboard.js` to send and listen for events.