#!/bin/bash

# Vercel exit codes:
# 1 = Build can proceed
# 0 = Build is cancelled

echo "Checking for frontend changes..."

# Check if any files in the 'frontend' folder have changed 
# compared to the previous commit (HEAD^)
git diff HEAD^ HEAD --quiet ./frontend

# Store the exit code of the git diff command
# (git diff --quiet returns 0 if NO changes, 1 if changes found)
RESULT=$?

if [ $RESULT -eq 1 ]; then
  echo "✅ - Changes detected in frontend. Proceeding with build."
  exit 1
else
  echo "🛑 - No changes in frontend folder. Build cancelled."
  exit 0
fi
