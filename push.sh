#!/bin/bash
cd "/c/Personal Expense - FYP"

echo "Step 1: Adding files..."
git add .

echo "Step 2: Committing..."
git commit -m "Initial commit: Personal Expense Tracker FYP Project - Complete with Firebase auth, Firestore backend, and all features"

echo "Step 3: Creating main branch..."
git branch -M main

echo "Step 4: Pushing to GitHub..."
git push -u origin main

echo "✅ Done! Your project has been pushed to GitHub!"
