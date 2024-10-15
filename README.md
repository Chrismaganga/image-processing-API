# Image Processing API

## Overview

The **Image Processing API** is a Node.js application that allows users to resize images dynamically. Leveraging the power of the `sharp` library, the API provides an efficient and scalable solution for image manipulation, enabling developers to integrate image processing capabilities into their applications seamlessly.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation Instructions](#installation-instructions)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#MIT)

## Features

- Resize images to specified dimensions (width and height).
- Return processed image file paths.
- Handle errors gracefully with informative messages.
- Easily extendable for future image processing features (e.g., cropping, rotating).

## Technologies Used

- **Node.js**: JavaScript runtime for building server-side applications.
- **Express**: Fast, unopinionated, minimalist web framework for Node.js.
- **Sharp**: High-performance image processing library.
- **TypeScript**: Superset of JavaScript that adds static typing.

## Installation Instructions

1. **Clone the repository**:

   ```bash
   **https://github.com/Chrismaganga/image-processing-API
   **cd image-processing-api
   npm install
   npm start

   **THUNDER-CLIENT API CALLS
   GET http://localhost:5000/?filename=image.jpg&width=200&height=300
   ```

\*\*TESTING
npm test
