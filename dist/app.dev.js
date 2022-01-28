"use strict";

var getClass = function getClass(element) {
  return document.querySelector(".".concat(element));
};

var getAllClass = function getAllClass(element) {
  return document.querySelectorAll(".".concat(element));
}; // HTML template


var comments = getClass("comment-wrapper");

var commentTemplate = function commentTemplate(currentUserAvatar, id, content, createdAt, like, avatar, username) {
  // console.log(avatar)
  return "\n    <div class=\"comment--reply\" data-container=".concat(id, ">\n    <div class=\"comment\">\n      <div class=\"comment-container\">\n        <div class=\"likes-wrapper\">\n          <div class=\"likes-btn\">\n            <div class=\"plus center\" data-like=").concat(id, "><img src=\"images/icon-plus.svg\" alt=\"plus\"></div>\n            <div class=\"likes-count\" data-like=").concat(id, " onselectstart=\"return false\">").concat(like, "</div>\n            <div class=\"minus center\" data-like=").concat(id, "><img src=\"images/icon-minus.svg\" alt=\"minus\"></div>\n          </div>\n\n          <div class=\"reply-mobile\">\n            <div class=\"reply reply").concat(id, " center\" data-comment=").concat(id, ">\n              <img src=\"images/icon-reply.svg\" alt=\"reply\">\n              <span>reply</span>\n            </div>\n\n            <div class=\"edit-delete edit").concat(id, " center hide\">\n              <div class=\"delete-btn center gap\" data-delete=").concat(id, ">\n                <img src=\"images/icon-delete.svg\" alt=\"delete\">\n                <span>delete</span>\n              </div>\n              <div class=\"edit-btn center gap\" data-edit=").concat(id, ">\n                <img src=\"images/icon-edit.svg\" alt=\"edit\">\n                <span>edit</span>\n              </div>\n            </div>\n          </div>\n        </div>\n\n        <div class=\"comment-content\">\n          <div class=\"profile-info\">\n           <div class=\"profile-header\">\n            <div class=\"profile\">\n                <img class=\"avatar\" src=").concat(avatar, " alt=\"avatar\">\n                <span class=\"name\">").concat(username, "</span>\n                <span class=\"current-user hide\" data-user=").concat(id, ">you</span>\n                <span class=\"time\">").concat(createdAt, "</span>\n            </div>\n\n            <div class=\"reply-desktop\">\n            <div class=\"reply reply").concat(id, " center\" data-comment=").concat(id, ">\n              <img src=\"images/icon-reply.svg\" alt=\"reply\">\n              <span>reply</span>\n            </div>\n\n            <div class=\"edit-delete edit").concat(id, " center hide\">\n              <div class=\"delete-btn center gap\" data-delete=").concat(id, ">\n                <img src=\"images/icon-delete.svg\" alt=\"delete\">\n                <span>delete</span>\n              </div>\n              <div class=\"edit-btn center gap\"  data-edit=").concat(id, ">\n                <img src=\"images/icon-edit.svg\" alt=\"edit\">\n                <span>edit</span>\n              </div>\n            </div>\n          </div>\n           </div>\n           <div class=\"content-wrapper\"  data-content=").concat(id, ">\n             <p class=\"comment-text\">").concat(content, "</p>\n             <textarea class=\"text-area hide\">").concat(content, "</textarea>\n             <div class=\"submit update hide\">\n                <button class=\"btn update-btn\">update</button>\n             </div>\n           </div>\n          </div>\n        </div>\n      </div>\n      <div class=\"comment-input hide\" data-comment=").concat(id, ">\n        <div class=\"avatar-icon\">\n          <img class=\"avatar\" src=").concat(currentUserAvatar, " alt=\"avatar\">\n        </div>\n        <div class=\"input-box\">\n          <textarea class=\"reply-input\" name=\"input\"></textarea>\n        </div>\n        <div class=\"submit-btn reply-btn").concat(id, "\">\n          <button class=\"btn\">reply</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"comment-replies comment-replies").concat(id, "\">\n      \n  </div>\n    ");
}; // getting the JSON file


fetch("data.json").then(function (response) {
  return response.json();
}).then(function (obj) {
  return takeObj(obj);
})["catch"](function (error) {
  return console.log(error);
});

var takeObj = function takeObj(obj) {
  // comment input field avatar
  var commentInputAvatar = getClass("input-avatar");
  commentInputAvatar.src = obj.currentUser.image.png; // if its the current user remove the reply button and add edit and delete button

  var removeReplyBtnForUser = function removeReplyBtnForUser(currentUserName, commentUserName, id) {
    if (currentUserName === commentUserName) {
      var editDelete = getAllClass("edit-delete");
      var replyLink = getAllClass("reply");
      var currentUserId = getAllClass("current-user"); // indicate that its the current user

      currentUserId.forEach(function (user) {
        if (user.dataset.user == id) {
          user.classList.remove("hide");
        }
      });
      editDelete.forEach(function (edit) {
        if (edit.classList.contains("edit".concat(id))) {
          edit.classList.remove("hide");
        }
      });
      replyLink.forEach(function (reply) {
        if (reply.classList.contains("reply".concat(id))) {
          reply.classList.add("hide");
        }
      });
    }
  }; // displaying comments and there corresponding replies 


  var commentsFromObj = obj.comments;
  commentsFromObj.forEach(function (comment) {
    comments.innerHTML += commentTemplate(obj.currentUser.image.png, comment.id, comment.content, comment.createdAt, comment.score, comment.user.image.png, comment.user.username);
    removeReplyBtnForUser(obj.currentUser.username, comment.user.username, comment.id); // adding replies to comment if there is a reply

    if (comment.replies.length > 0) {
      var commentReplies = getClass("comment-replies".concat(comment.id));
      var replies = comment.replies;
      replies.forEach(function (reply) {
        commentReplies.innerHTML += commentTemplate(obj.currentUser.image.png, reply.id, reply.content, reply.createdAt, reply.score, reply.user.image.png, reply.user.username);
        removeReplyBtnForUser(obj.currentUser.username, reply.user.username, reply.id);
      });
    }
  }); // likes increement and decreement

  var likes = getAllClass("likes-btn");
  var showLikes = getAllClass("likes-count");
  likes.forEach(function (like) {
    like.addEventListener("click", function (e) {
      if (e.target.classList.contains("plus") || e.target.parentNode.classList.contains("plus")) {
        likeBtnNav(e.target, e.target.parentNode, "plus");
      } else if (e.target.classList.contains("minus") || e.target.parentNode.classList.contains("minus")) {
        likeBtnNav(e.target, e.target.parentNode, "minus");
      }
    });
  });

  var likeBtnNav = function likeBtnNav(child, parent, value) {
    showLikes.forEach(function (showLike) {
      if (showLike.dataset.like == child.dataset.like || showLike.dataset.like == parent.dataset.like) {
        var likeNav = Number(showLike.textContent);

        if (value == "minus") {
          showLike.textContent = likeNav ? --likeNav : 0;
        } else if (value == "plus") {
          showLike.textContent = ++likeNav;
        }
      }
    });
  }; // show reply input field onclick


  var replyLinks = getAllClass("reply");
  var replyInputs = getAllClass("comment-input");
  var commentContainer = getAllClass("comment--reply");
  replyLinks.forEach(function (replyLink) {
    replyLink.addEventListener("click", function () {
      replyInputs.forEach(function (replyInput) {
        if (replyLink.dataset.comment == replyInput.dataset.comment) {
          replyInput.classList.toggle("show"); // replying to individual comments, i might need to convert this into a function letter

          var replyInputField = replyInput.childNodes[3].childNodes[1];
          var replyBtn = replyInput.childNodes[5];
          replyBtn.addEventListener("click", function () {
            var text = replyInputField.value;
            commentContainer.forEach(function (comment) {
              console.log(comment.childNodes[1].childNodes[1].childNodes[3].childNodes[1].childNodes[1].childNodes[1].childNodes[3]);
              var username = comment.childNodes[1].childNodes[1].childNodes[3].childNodes[1].childNodes[1].childNodes[1].childNodes[3];
              console.log(username.textContent);
            });
          });
        }
      });
    });
  }); // edit comment

  var editBtns = getAllClass("edit-btn");
  var commentContent = getAllClass("content-wrapper");
  editBtns.forEach(function (editBtn) {
    editBtn.addEventListener("click", function (e) {
      commentContent.forEach(function (commentText) {
        if (editBtn.dataset.edit == commentText.dataset.content) {
          // trying to create the textarea each time the edit button is clicked the, but after i created the textarea and was able to edit the content i was unable to overwrite the parent element using innerHTML or removing childNode then adding that of paragraph, which make me result in adding the textarea to all element then display when need be edit its content then use toggle
          // let text = commentText.firstElementChild
          // commentText.innerHTML = `<textarea class="text-area"></textarea>`
          // // const textArea = document.createElement("textarea")
          // // textArea.setAttribute("class","text-area")
          // // commentText.appendChild(textArea)
          // commentText.parentNode.innerHTML += `
          //            <div class="submit update">
          //            <button class="btn update-btn">update</button>
          //        </div>`
          // const updateBtn = getClass("update-btn")
          // const text_area = getClass("text-area")
          // const comment_text = getClass("comment-text")
          // text_area.value = text.innerText;
          // // commentText.innerHTML = ""
          // // console.log(commentText.childNodes)
          // updateBtn.addEventListener("click", () => {
          //   // commentText.removeChild(textArea)
          //   // commentText.removeChild(text_area)
          //   text_area.parentElement.removeChild(text_area)
          //   // commentText.innerHTML = `<p class="comment-text">${textArea.value}</p>`
          //   const comment_Text = document.createElement("p")
          //   comment_Text.setAttribute("class", "comment-text")
          //   commentText.appendChild(comment_Text)
          //   console.log(commentText.innerHTML)
          //   comment_Text.innerHTML = text_area.value
          // })
          var comment_text = commentText.childNodes[1];
          var textArea = commentText.childNodes[3];
          var updateBtn = commentText.childNodes[5];
          comment_text.classList.add("hide");
          textArea.classList.add("show");
          updateBtn.classList.add("show");
          updateBtn.addEventListener("click", function () {
            comment_text.textContent = textArea.value;
            comment_text.classList.remove("hide");
            textArea.classList.remove("show");
            updateBtn.classList.remove("show");
          });
        }
      });
    });
  }); // delete comment

  var deleteBtns = getAllClass("delete-btn");
  deleteBtns.forEach(function (deleteBtn) {
    deleteBtn.addEventListener("click", function (e) {
      commentContainer.forEach(function (comment) {
        if (deleteBtn.dataset["delete"] == comment.dataset.container) {
          comment.innerHTML = "";
        }
      });
    });
  }); // replying to comments
  // adding comments by the user
};