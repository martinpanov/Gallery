# Project Documentation: Gallery

## Overview

My App is a single-page application built with React that allows users to go through a list of images. Whenever you click on one of the images, a lightbox popup will appear displaying the image that you clicked on. Each of the images has a tags and category and you have the ability to filter the images based on their tags or category. 

### The link to the website is https://begachka.donttouchmydomain.com

![Cars](https://user-images.githubusercontent.com/106311309/230741582-e7f9954e-e37f-45d2-adcf-debcf9d6e8a4.jpg)

## Technology Stack

 * React

## Project Architecture

The app consists of several main components:

 1. App: A component that displays all the images in a grid layout.
  * The `images` variable stores an array of objects with information about each image.
  * `displayedImages` state is used so that we can determine which images should be displayed on the screen after filtering.
  * `screenSize` state is used to determine what is the current screen size so that we can display the images in a different grid layout.
  * `selectedImage` state is used to store the image that the user clicked on and then display the Lighbox popup.
  * `formData` stores all the data coming from the form in the navigation menu.
  * `imagesRef` gives us access to the div elements of the images.
  * `visibleImages` uses a custom hook called `useInteresectionObserver` which gives us a list of images that are visible on the screen and that should be displayed.
  * `handleResize` is a function that sets the `screenSize` based on the current window size.
 2. Header: A section where you can filter the images based on their tags or category.
  * `dropDownMenuRef` uses a custom hook called `useClickOutside`. The ref is being passed to this hook and then the hook checks if the user clicked outside the menu to determine if the menu should be closed.
  * `isInputFocused` is used to check if the input field is focused so that its styling can be changed.
  * `isOpenFilterMenu` is used to check if the filter menu is opened.
  * `handleFormSubmit` is a function that handles the form submission. `formDataObjectValues` checkes if every value in the formData is empty and if it is, all the images are returned, otherwise, the `setDisplayedImages` filters the images based on the tags or category.
  * `handleChange` is a function that handles changes to the formData.
 3. Lightbox: A component that displays the image zoomed in so that you can view the image in more detail.
  * `touchStart` checks where the touch of the screen started and `touchEnd` checks where the touch has ended.
  * `minSwipeDistance` this is the minimum distance between `touchStart` and `touchEnd` that is required in order to change the image.
  * `handlePreviousImage` and `handleNextImage` find the index of the current image and change the image to the previous/next image and if the index is lower than 0 or higher than the length of the displayedImages array, the functions return the same image.
  * `handleKeyDown` is a function which checks if the arrow keys or if the escape key has been pressed so that it can change the image to the next one, previous one or close the lightbox popup
  * `onTouchStart`, `onTouchMove` and `onTouchEnd` are functions that determine where the touch started, what is the distance between the start and the end and check when the touch has ended.

## Project Setup

To set up the project locally, follow these steps:

1. Clone the project repository from GitHub
2. Install the dependencies using `npm install`.
3. Run the dev server using `npm run dev`.

## Project Features

 * Search for images by using the input field in the navigation bar based on their tags or category.
 * Click on an image for a lightbox popup to appear which will display the image in greater detail.
 * Hover the images to see the tags of the images.
 * Scrolling makes the images appear smoothly .

