# iVolunteerWebsiteRepository


#project members
#Rhys William Singrin: rsingrin@csus.edu
#Danielle Tasabia
#Maximino Licon
#Angel Espinoza
#Eduar Gutierrez


#all members have a dev branch that they do assigned sprint work on, then create a pull request to merge with main which is apporved by #other members 

HOW TO USE:
navigate to the root directory (named iVolunteerWebsiteRepository) and run the command 'make dev', this uses a make file in the root dir that runs the backend connection and the front end at the same time. If you want to run it yourself you can cd into backend and run 'npm run dev', then cd into frontend and run 'npm run dev'. you can also run make clean to delete the package-lock and nodemodule files so you can rebuild them

MAKE COMMANDS:
    make dev : launches the backend and frontend
    make clean : deletes the node_modules and package-lock files


GIT COMMANDS:
git status : checks the commit status of the files on your branch
git add . : stages all the files in the directory you are in so that you can commit them
git commit -m : pushes your changes to the local branch on your computer
git push : pushes your changes onto the github repository (now it's available to everybody)
git pull : updates your branch from the online version
git branch -a : lists all the branches
git switch 'branch name" : swaps to a branch
git merge 'branch name' : merges the branch you are in with the branch you named, after this you can 
    run git commit and git push to make that merge permanent
git log --oneline : lets you view the history of commits on the branch you are in


Cookie-Based Authentication (Development Notes)

This project uses HTTP-only cookies for user authentication. Because browsers treat localhost and 127.0.0.1 as different site origins, cookie-based login will only work correctly when the frontend and backend share the same hostname. To ensure this, the Vite dev server has been configured to always run at http://localhost:5173 rather than http://127.0.0.1:5173. This change is required because authentication cookies issued by the backend at http://localhost:5000 are blocked when the frontend is accessed via 127.0.0.1, causing protected routes to return 401 Unauthorized. In production, this issue does not occur because the application will run under a single, consistent domain (e.g., https://ivolunteer.app), or under coordinated subdomains with proper CORS and cookie settings (sameSite: "none", secure: true, and a shared domain). This setup ensures that cookies are successfully stored, sent with API requests, and validated by the server in all environments.
