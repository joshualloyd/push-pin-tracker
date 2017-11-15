# Push Pin Tracker

A usefull app that aids designers in tracking revisions and client feedback through the iteration process.

## Overview

In that past when doing design work I have had frustrations with managing client and management feedback and revisions. Email is not well suited for such an iteration loop. This is an app that would allow a user/designer to upload an image, allow others to put pins in it, attach comments, add design revisions, and track those pins and comments through a feedback loop until resolved.

## Requirements

1. Node.js/NPM (LTS or later)
2. Ruby & Sass
3. Grunt and http-server (or alternative) modules installed globaly

## Setup

1. Clone this repository,
2. Create a firebase account and setup a project with the realtime database, file storage, and authentication.
3. Copy appropriate api credentials to ./app/values/fb-creds.js
4. Run Grunt within the ./lib directory and the server at root.

## Structure

After Setup you can use the app locally or deploy to firebase hosting. The user types are client and designer. The data consists of projects, pins, and comments. A project may have one client and one designer. One project may have many pins, each pin consists of its name, coordinates, and a project id. Each pin may have many comments, each comment consists of its user and project id as well as text.