To avoid "CLIENT CLOSED ERROR", use redis v3.1.2 instead of version 4+. Use "npm uninstall redis" to remove redis version 4 and install version 3.1.2 using --> npm i redis@3.1.2

If you get "bash: mongo: command not found" at 1:49:00, then Use mongosh. mongo shell was deprecated in mongo:6.0.


Day 1:

Firstly I created a simple node.js/express app. Then I created a dockerfile to create an image that will create a container with the application files -> index.js, package,json,etc.

I started the container and exposed it on port 3000. After this we observed that changes made in code from the local host are not reflected in container, which is obvious since the container is built from the image that is outdated.

So to solve this we created a shared volume between the host os and the container. Now the changes in the code made from local host were reflected in the container but the output on the web browser was still the same, that is it didn't change.

Of course it didn't change because we had to restart the node process. Now restarting this node process again n again is cubersome, so we use Nodemon.
Nodemon looks at the code and if any change take place it restarts the node process.

Now since we are doing things with the container, we didn't need the node_modules folder on the local host. So we went ahead and deleted it. But doing this crashed the container. 
Since we had shared a volume between the local host and container, the node_modules file is gone from the container as well.
To fix this we created another volume specifically for node_modules.

Another issue with bind mount is that the changes made via container were also reflected on the local host. To fix this we can make our bind volume read only for the container.

Observed I had some unused volumes lying around so removed them. 


Day 2:

Then the command I was using to spin up a container was pretty long. So to optimize it we're gonna use docker-compose. Also with docker-compose, keep in mind that it is pretty stupid. If you make a change in the dockerfile and spin up containers again using docker-compose, it will not build a new image, rather will use the same old image. So we need to tell it explicitly to create a new image by using `--build` flag.

Now we will be configuring our docker-compose file for both development environment and production environment.
("nodemon index.js" does  the exact same thing as "node index.js" only diff is that nodemon starts the node process again if any change in the code is observed)
Now if we go inside our production container and open up node_modules folder, we'll see that the nodemon is there. But we don't need nodemon over there, it should in the development container. If we look at our package.json file, nodemon is listed under devDependencies.
So now we need to configure or Dockerfile so that it becomes smart enough to know which container we are creating, and install only prod related dependencies in the prod container and dev related dependencies in the dev container.

Now we explore and log into our mongo container and create a database. We enter some values in the db and log out of the container. After that we tear down the container and create a fresh new mongo container. But we observed that the db data was lost. To fix this we'll create a named volume. Since it's a "named" volume we can easily recognise the purpose of this volume unlike in anonymous volume where the name is just a random bunch of characters and numbers.
Also when creating named volumes we also need to mention created named volumes in a seperate section as these volumes can be used by other containers as well.

Alright so the thing is when we tear down containers using -v flag in docker-compose, it removes the named volumes as well. So to work around this, what we can do is to delete all the unused volume using "docker volume prune", it's better to use this command when your containers are up and running so that you don't accidently delete a volume that you didn't wanted to.

Day 3:

Now our mongo database is up and running so let's connect our express app to the database. We are going to use the library called mongoose which makes it a little easier to talk to the database. One little thing we did here was rather than giving ip-addr to the function, we gave service name since docker uses built-in dns for custom containers. (containers that we create)

Now we need to make sure that our mongo container is spun up first, cause if node container is up first it will try to connect to database and it'll cause some errors or crash the application.
It's not only about starting the mongo container first, we need to make sure that database too is up and running before the node or application container. What I did is I just made the mongoose try to connect after every 5 sec if no connections is made.

Day 4:

So now the connection between db and node-app is made, we're going to make a crud application. Made controllers, models and routes.

Day 5:

Okay now we're going to make a user sign up and login functionality and to do that we introduce a redis container.

Day 6-7:

Killed crud app, things were getting slight complicated and I don't like do things without understanding them. So I'll leave this project till here, upgrade my knowledge more and then continue with making a crud app, introducing more containers and instances and make this app more functional to simulate real world scenarios. : )

