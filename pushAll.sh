#!/usr/bin/env bash

#Universal git push script

#update to newest
echo "Checking for up to date local repo..."
git pull
echo "done"

#add all
clear
echo "Adding all files"
git add .
echo "done"

#commit with message
clear
read -p "Specify a commit message: " commitMsg
git commit -m "$commitMsg"

#push
clear
echo "Pushing commit..."
git push
echo "done"

#exit
clear
echo "Exiting..."
exit 0
