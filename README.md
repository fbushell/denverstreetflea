Denver Street Flea
===============================

#### Getting started
```shell
// Clone the repo
git clone https://github.com/fbushell/denverstreetflea.git boulderbeer/

// Install the node modules and bower
npm install
bower install
```


#### Local Server
Using [node-squarespace-server](https://github.com/kitajchuk/node-squarespace-server) we will setup a local dev environment.
```bash
// Install the package globally on your computer if you have not already
npm install -g node-squarespace-server

// Change directories into the sqs template workspace
cd sqs_template

// Start the server on localhost:5050
sqs server
 
// Clear the site cache and start the server again
sqs buster && sqs server
```

#### Pushing to Squarespace
We are using a git subtree to push up our Squarespace template from within our main repo. The [grunt-git-subtree](https://github.com/liaodrake/grunt-cmv-git-subtree) module will help with this process. More on subtree workflow [here](https://medium.com/@v/git-subtrees-a-tutorial-6ff568381844).
```bash
// Setup subtree remote
git remote add squarespace https://cannabis-cup.squarespace.com/template.git
```

```shell
// Push to the squarespace subtree
grunt git_subtree_push
```

#### Preprocess our SASS and JS
We are preprocessing our Sass and Js files in root and dumping them into our `/sqs_template` folder. There is a grunt task setup to watch for file changes and run the preprocesser. 
```shell
grunt watch
```
*more to come on the js side...
