const getClass = (element) => document.querySelector(`.${element}`)
const getAllClass = (element) => document.querySelectorAll(`.${element}`)


// HTML template

const commentTemplate = (currentUserAvatar, id, content, createdAt, like, avatar, username) => {
  // console.log(avatar)
  return `
    <div class="comment--reply" data-container=${id}>
    <div class="comment">
      <div class="comment-container">
        <div class="likes-wrapper">
          <div class="likes-btn">
            <div class="plus center" data-like=${id}><img src="images/icon-plus.svg" alt="plus"></div>
            <div class="likes-count" data-like=${id} onselectstart="return false">${like}</div>
            <div class="minus center" data-like=${id}><img src="images/icon-minus.svg" alt="minus"></div>
          </div>

          <div class="reply-mobile">
            <div class="reply reply${id} center" data-comment=${id}>
              <img src="images/icon-reply.svg" alt="reply">
              <span>reply</span>
            </div>

            <div class="edit-delete edit${id} center hide">
              <div class="delete-btn center gap" data-delete=${id}>
                <img src="images/icon-delete.svg" alt="delete">
                <span>delete</span>
              </div>
              <div class="edit-btn center gap" data-edit=${id}>
                <img src="images/icon-edit.svg" alt="edit">
                <span>edit</span>
              </div>
            </div>
          </div>
        </div>

        <div class="comment-content">
          <div class="profile-info">
           <div class="profile-header">
            <div class="profile">
                <img class="avatar" src=${avatar} alt="avatar">
                <span class="name">${username}</span>
                <span class="current-user hide" data-user=${id}>you</span>
                <span class="time">${createdAt}</span>
            </div>

            <div class="reply-desktop">
            <div class="reply reply${id} center" data-comment=${id}>
              <img src="images/icon-reply.svg" alt="reply">
              <span>reply</span>
            </div>

            <div class="edit-delete edit${id} center hide">
              <div class="delete-btn center gap" data-delete=${id}>
                <img src="images/icon-delete.svg" alt="delete">
                <span>delete</span>
              </div>
              <div class="edit-btn center gap"  data-edit=${id}>
                <img src="images/icon-edit.svg" alt="edit">
                <span>edit</span>
              </div>
            </div>
          </div>
           </div>
           <div class="content-wrapper"  data-content=${id}>
             <p class="comment-text">${content}</p>
             <textarea class="text-area hide">${content}</textarea>
             <div class="submit update hide">
                <button class="btn update-btn">update</button>
             </div>
           </div>
          </div>
        </div>
      </div>
      <div class="comment-input hide" data-comment=${id}>
        <div class="avatar-icon">
          <img class="avatar" src=${currentUserAvatar} alt="avatar">
        </div>
        <div class="input-box">
          <textarea class="reply-input" name="input"></textarea>
        </div>
        <div class="submit-btn reply-btn${id}">
          <button class="btn">reply</button>
        </div>
      </div>
    </div>

    <div class="comment-replies comment-replies${id}">
      
  </div>
    `
}

const takeObj = (obj) => {

  const comments = getClass("comment-wrapper")

  // get last index of id which will enable us to increase id for the next comment created

  let incrId = ""

  obj.comments.forEach((com) => {
    for (last in com) {
      let temp = com.replies
      temp.forEach((tem) => {
        incrId = parseInt(tem.id)
      })
    }
  })

  // comment input field avatar

  const commentInputAvatar = getClass("input-avatar");
  commentInputAvatar.src = obj.currentUser.image.png

  // if its the current user remove the reply button and add edit and delete button

  const removeReplyBtnForUser = (currentUserName, commentUserName, id) => {

    if (currentUserName === commentUserName) {
      const editDelete = getAllClass(`edit-delete`)
      const replyLink = getAllClass(`reply`)
      const currentUserId = getAllClass("current-user")

      // indicate that its the current user

      currentUserId.forEach((user) => {
        if (user.dataset.user == id) {
          user.classList.remove("hide")
        }
      })

      editDelete.forEach((edit) => {
        if (edit.classList.contains(`edit${id}`)) {
          edit.classList.remove("hide")
        }
      })

      replyLink.forEach((reply) => {
        if (reply.classList.contains(`reply${id}`)) {
          reply.classList.add("hide")
        }
      })
    }
  }

  // displaying comments and there corresponding replies 

  const commentsFromObj = obj.comments;
  commentsFromObj.forEach((comment) => {
    comments.innerHTML += commentTemplate(obj.currentUser.image.png, comment.id, comment.content, comment.createdAt, comment.score, comment.user.image.png, comment.user.username);

    removeReplyBtnForUser(obj.currentUser.username, comment.user.username, comment.id)

    // adding replies to comment if there is a reply

    if (comment.replies.length > 0) {
      let commentReplies = getClass(`comment-replies${comment.id}`);
      let replies = comment.replies
      replies.forEach((reply) => {
        commentReplies.innerHTML += commentTemplate(obj.currentUser.image.png, reply.id, reply.content, reply.createdAt, reply.score, reply.user.image.png, reply.user.username);

        removeReplyBtnForUser(obj.currentUser.username, reply.user.username, reply.id)
      })
    }
  })

  // likes increement and decreement

  const likes = getAllClass("likes-btn")
  const showLikes = getAllClass("likes-count")
  likes.forEach((like) => {
    like.addEventListener("click", (e) => {
      if (e.target.classList.contains("plus") || e.target.parentNode.classList.contains("plus")) {
        likeBtnNav(e.target, e.target.parentNode, "plus")

      } else if (e.target.classList.contains("minus") || e.target.parentNode.classList.contains("minus")) {
        likeBtnNav(e.target, e.target.parentNode, "minus")
      }
    })
  })

  const likeBtnNav = (child, parent, value) => {
    showLikes.forEach((showLike) => {
      if (showLike.dataset.like == child.dataset.like || showLike.dataset.like == parent.dataset.like) {
        let likeNav = Number(showLike.textContent)
        if (value == "minus") {
          showLike.textContent = likeNav ? --likeNav : 0
        } else if (value == "plus") {
          showLike.textContent = ++likeNav
        }
      }
    })
  }

  // show reply input field onclick

  const replyLinks = getAllClass("reply")
  const replyInputs = getAllClass("comment-input")
  const commentContainer = getAllClass("comment--reply")

  replyLinks.forEach((replyLink) => {
    replyLink.addEventListener("click", () => {
      replyInputs.forEach((replyInput) => {
        if (replyLink.dataset.comment == replyInput.dataset.comment) {
          replyInput.classList.toggle("show")

          // replying to individual comments, i might need to convert this into a function letter
          const replyInputField = replyInput.childNodes[3].childNodes[1]
          const replyBtn = replyInput.childNodes[5]

          replyBtn.addEventListener("click", () => {
            let text = replyInputField.value
            // i dont know whats happening here but the replies are been posted twice making sure the input is empty and checking that its empty help me get rid of it, but i know its not solved

            replyInputField.focus()
            if (text) {
              commentContainer.forEach((commentCon) => {
                if (replyInput.dataset.comment == commentCon.dataset.container) {
                  const commentReplies = getClass(commentCon.childNodes[3].classList[1])
                  incrId = incrId + 1
                  commentReplies.innerHTML += commentTemplate(obj.currentUser.image.png, incrId, text, "just now", 0, obj.currentUser.image.png, obj.currentUser.username);
                  replyInputField.value = ""
                  replyInput.classList.remove("show")
                }
              })
            }
          })
        }
      })
    })
  })

  // edit comment

  const editBtns = getAllClass("edit-btn")
  const commentContent = getAllClass("content-wrapper")

  editBtns.forEach((editBtn) => {
    editBtn.addEventListener("click", (e) => {
      commentContent.forEach((commentText) => {
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

          const comment_text = commentText.childNodes[1]
          const textArea = commentText.childNodes[3]
          const updateBtn = commentText.childNodes[5]

          comment_text.classList.add("hide")
          textArea.classList.add("show")
          updateBtn.classList.add("show")

          updateBtn.addEventListener("click", () => {
            comment_text.textContent = textArea.value

            comment_text.classList.remove("hide")
            textArea.classList.remove("show")
            updateBtn.classList.remove("show")
          })
        }
      })
    })
  })

  // delete comment

  const deleteBtns = getAllClass("delete-btn")

  deleteBtns.forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", (e) => {
      commentContainer.forEach((comment) => {
        if (deleteBtn.dataset.delete == comment.dataset.container) {
          comment.innerHTML = ""
        }
      })
    })
  })

  // adding comments by the user

  const commentBtn = getClass("comment-btn")
  const commentInput = getClass("comment-inputs")
  
  commentBtn.addEventListener("click", () => {
    incrId = incrId + 1
    let text = commentInput.value
    comments.innerHTML += commentTemplate(obj.currentUser.image.png, incrId, text, "just now", 0, obj.currentUser.image.png, obj.currentUser.username);
    commentInput.value = ""

    const mainObj = {
      id: incrId,
      content: text,
      createdAt: "just now",
      score: 0,
      replyingTo: "maxblagun",
      user: {
        image: {
          png: "./images/avatars/image-ramsesmiron.png",
          webp: "./images/avatars/image-ramsesmiron.webp"
        },
        username: "ramsesmiron"
      },
      replies: []
    }
    let commentArr = obj.comments
    commentArr.push(mainObj)
    // console.log(mainObj)
  })
}

// getting the JSON file

fetch("data.json")
  .then(response => response.json())
  .then(obj => takeObj(obj))
  .catch(error => console.log(error))