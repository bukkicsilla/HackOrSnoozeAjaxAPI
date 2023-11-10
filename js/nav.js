"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show story submit from on clicking story "submit"*/
/*added code*/
function showStoryForm(evt) {
  console.debug("showStoryForm", evt);
  hidePageComponents();
  $allStoriesList.show();
  $submitNewStory.show();
}

$navStory.on("click", showStoryForm);

/** Show favorite stories on click on "favorites" */
/*added code*/
function showFavoriteStories(evt) {
  console.debug("showFavoriteStories", evt);
  hidePageComponents();
  getFavoriteStories();
}

$body.on("click", "#nav-favorites", showFavoriteStories);

/** Show My Stories on clicking "my stories" */
/*added code*/
function showUserStories(evt) {
  console.debug("showUserStories", evt);
  hidePageComponents();
  getUserStories();
  $userStories.show();
}

$body.on("click", "#nav-user-stories", showUserStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** Hide everything but profile on click on "profile" */
/*added code*/
function showProfile(evt) {
  console.debug("showProfile", evt);
  hidePageComponents();
  $userProfile.show();
}
$navUserProfile.on("click", showProfile);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  //$(".main-nav-links").show();
  //changed code
  $(".main-nav-links").css("display", "flex");
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
