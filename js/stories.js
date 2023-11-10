"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

//changed code
function generateStoryMarkup(story, isRemoveButtonVisible = false) {
  console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  const isHeartVisible = !!currentUser;

  return $(`
    <li id="${story.storyId}">
      <div>
      ${isRemoveButtonVisible ? getRemoveButton() : ""}
      ${isHeartVisible ? getHeart(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <div class="story-author">by ${story.author}</div>
        <div class="story-user">posted by ${story.username}</div>
      </div>
    </li>
    `);
}
/** Make remove button for story */
//added code
function getRemoveButton() {
  console.debug("getRemoveButton");
  return `
      <span class="eraser">
        <i class="fas fa-eraser"></i>
      </span>`;
}

/** Make favorite/not-favorite heart for story */
//added code
function getHeart(story, user) {
  console.debug("getHeart");
  const isfavorite = user.isFavorite(story);
  if (!isfavorite) {
    return `<span class="heart"><i class="far fa-heart"></i></span>`;
  }
  return `
      <span class="heart">
        <i class="fas fa-heart"></i>
      </span>`;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");
  $allStoriesList.empty();
  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  $allStoriesList.show();
}

/** Handle removing a story. */
/*added code*/
async function removeStory(evt) {
  console.debug("removeStory", evt);
  const $target = $(evt.target); //<i>
  const $storyLi = $target.closest("li");
  const storyId = $storyLi.attr("id");
  await storyList.removeStory(currentUser, storyId);
  await getUserStories();
}
$userStories.on("click", ".eraser", removeStory);

/** Handle submitting new story form. */
/*added code*/
async function submitNewStory(evt) {
  console.debug("submitNewForm");
  evt.preventDefault();
  const title = $("#new-title").val();
  const url = $("#new-url").val();
  const author = $("#new-author").val();
  const username = currentUser.username;
  const data = { title, url, author, username };
  const newStory = await storyList.addStory(currentUser, data);
  const $newStory = generateStoryMarkup(newStory);
  $allStoriesList.prepend($newStory);
  $submitNewStory.trigger("reset");
  $submitNewStory.hide();
  //$submitNewStory.slideUp("slow");
}

$submitNewStory.on("submit", submitNewStory);

/******************************************************************************
 * Functionality for list of user's own stories
 */
/*added code*/
function getUserStories() {
  console.debug("getUserStories");
  $userStories.empty();
  if (currentUser.ownStories.length === 0) {
    $userStories.append("<h3>You have no stories.</h3>");
  } else {
    currentUser.ownStories.forEach((story) => {
      const $story = generateStoryMarkup(story, true);
      $userStories.append($story);
    });
  }
  $userStories.show();
}

/******************************************************************************
 * Functionality for favorites list and heart/un-heart a story
 */

/** Put favorites list on page. */
/*added code*/
function getFavoriteStories() {
  console.debug("getFavoritesStories");
  $favoriteStories.empty();
  if (currentUser.favorites.length === 0) {
    $favoriteStories.append("<h3>You have no favorite stories.</h3>");
  } else {
    currentUser.favorites.forEach((story) => {
      const $story = generateStoryMarkup(story);
      $favoriteStories.append($story);
    });
  }
  $favoriteStories.show();
}

/** Handle favorite/un-favorite a story */
/*added code*/
async function toggleFavoriteStory(evt) {
  console.debug("toggleFavoriteStory", evt);
  const $target = $(evt.target); //<i> element
  //const $storyLi = $target.closest("li");
  const $storyLi = $target.parent().parent().parent();
  const storyId = $storyLi.attr("id");
  const story = storyList.stories.find((s) => s.storyId === storyId);
  if ($target.hasClass("fas")) {
    await currentUser.removeFavorite(story);
    $target.toggleClass("fas far");
  } else {
    await currentUser.addFavorite(story);
    $target.toggleClass("fas far");
  }
}

$storiesLists.on("click", ".heart", toggleFavoriteStory);
