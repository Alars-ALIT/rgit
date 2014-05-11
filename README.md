rgit
====

Recursive asynchronous GIT

RGit is a simple wrapper around git that executes your git command recursivly and asynchronously in all subfolders of your current work directory. (Subfolders that contain a .git folder)

Installation:
```
npm install -g rgit
```

Usage:

As you would use git. RGit passes all arguments to git. So a:
```
rgit status -sb 
```
.. would execute "git status -sb" in all git subfolders
