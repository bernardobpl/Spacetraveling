# Spacetraveling

This is a free blog.

Post List (Home Page)
![alt Post List on Home Page](https://github.com/bernardobpl/Spacetraveling/blob/main/public/appPreview1.png?raw=true)

Post Details
![alt Post Details on Post Page](https://github.com/bernardobpl/Spacetraveling/blob/main/public/appPreview2.png?raw=true)

Prismic Custom Type "Post"
![alt Prismic custom type "Post"](https://github.com/bernardobpl/Spacetraveling/blob/main/public/appPreview3.png?raw=true)

## Running the project
To run this project, you will need a prismic project linked to this repository.

First you clone this repo  
`git clone {url}`  
Install dependencies  
`yarn` or `npm install`  
  
Them you open your prismic project online and follow their commands to link to this repo.  
Create a Post custom type identical to the screenshot above.  
Take the api key and set to `.env.local`.  
  
To see the posts, create your own posts on prismic website and it's done.

## Created with

* Nextjs
* Typescript
* Prismic
* Sass

## Notes

This blog is a little project to practice Nexjs integration with Prismic (Headless CMS).
Used jest and testing-library to make unit tests.
Used Sass for styling since it's easier to config on NextJS and the style wasn't the focus.