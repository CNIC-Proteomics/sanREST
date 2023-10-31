# sanREST
A RESTful API that describes the web services and the operations for the report files of iSanXoT.

To start it, install Node:
```
npm install
```

Copy into the "data" folder, the APPRIS annotation table for the correct execution of "get_appris" service.


And run (on Windows):
```
npm run start.win
```
And run (on Linux):
```
npm run start
```

# RUN SCRIPTS

`` 
npm run restart
npm run restart.win
npm run stopall
npm run restartall
```

<!--

## How to set up a git project to use an external repo submodule?

You have a project -- call it MyWebApp that already has a github repo
You want to use the jquery repository in your project
You want to pull the jquery repo into your project as a submodule.
Submodules are really, really easy to reference and use. Assuming you already have MyWebApp set up as a repo, from terminal issue these commands:
```
cd MyWebApp
git submodule add git://github.com/jquery/jquery.git externals/jquery
```

This will create a directory named externals/jquery* and link it to the github jquery repository. Now we just need to init the submodule and clone the code to it:
```
git submodule update --init --recursive
```

You should now have all the latest code cloned into the submodule. If the jquery repo changes and you want to pull the latest code down, just issue the submodule update command again. Please note: I typically have a number of external repositories in my projects, so I always group the repos under an "externals" directory.

-->