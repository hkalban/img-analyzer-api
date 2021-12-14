# Image Analyzer API
HTTP REST API for a service that ingests user images, analyzes them for object detection, and returns the enhanced content.

## Tech Stack
* Node.js
* TypeScript
* Express.js
* TypeORM
* PostgreSql
* Docker
* Google Cloud Storage
* Google Cloud Vision AI

# API Specification

## GET /images
* Returns HTTP 200 OK with a JSON response containing all image metadata.

## GET /images?objects="dog,cat"
* Returns a HTTP 200 OK with a JSON response body containing only images that have the detected objects specified in the query parameter.

## GET /images/{imageId}
* Returns HTTP 200 OK with a JSON response containing image metadata for the specified image.

## POST /images
* Send a JSON request body including an image file or URL, an optional label for the image, and an optional field to enable object detection.
* Returns a HTTP 200 OK with a JSON response body including the image data, its label.