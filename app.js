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
            <button class="nav-btn plus center" data-like=${id}><img src="images/icon-plus.svg" alt="plus"></button>
            <div class="likes-count" data-like=${id}>${like}</div>
            <button class="nav-btn minus center" data-like=${id}><img src="images/icon-minus.svg" alt="minus"></button>
          </div>

          <div class="reply-mobile">
            <div class="reply reply${id} center" data-comment=${id}>
              <img src="images/icon-reply.svg" alt="reply">
              <p><span>reply</span></p>
            </div>

            <div class="edit-delete edit${id} center hide">
              <div class="delete-btn center gap" data-delete=${id}>
                <img src="images/icon-delete.svg" alt="delete">
                <span>delete</span>
              </div>
              <div class="edit-btn center gap" data-edit=${id}>
                <img src="images/icon-edit.svg" alt="edit">
                <p><span>edit</span></p>
              </div>
            </div>
          </div>
        </div>

        <div class="comment-content">
          <div class="profile-info">
           <div class="profile-header">
            <div class="profile">
                <img class="avatar" src=${avatar} alt="avatar">
                <p><span class="name">${username}</span></p>
                <p><span class="current-user hide" data-user=${id}>you</span></p>
                <p><span class="time">${createdAt}</span></p>
            </div>

            <div class="reply-desktop">
            <div class="reply reply${id} center" data-comment=${id}>
              <img src="images/icon-reply.svg" alt="reply">
              <p><span>reply</span></p>
            </div>

            <div class="edit-delete edit${id} center hide">
              <div class="delete-btn center gap" data-delete=${id}>
                <img src="images/icon-delete.svg" alt="delete">
                <span>delete</span>
              </div>
              <div class="edit-btn center gap"  data-edit=${id}>
                <img src="images/icon-edit.svg" alt="edit">
                <p><span>edit</span></p>
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

const displayContent = (content) => {
    const comments = getClass("comment-wrapper")
    const commentWrapper = getClass("wrapper")

    // get last index of id which will enable us to increase id for the next comment created

    let incrId = ""
    content.comments.forEach((com) => {
        for (last in com) {
            let temp = com.replies
            temp.forEach((tem) => {
                incrId = parseInt(tem.id)
            })
        }
    })

    // comment input field avatar

    const commentInputAvatar = getClass("input-avatar");
    commentInputAvatar.src = content.currentUser.image.png

    // displaying comments and there corresponding replies 
    const commentsFromObj = content.comments;
    commentsFromObj.forEach((comment) => {
        comments.innerHTML += commentTemplate(content.currentUser.image.png, comment.id, comment.content, comment.createdAt, comment.score, comment.user.image.png, comment.user.username);

        removeReplyBtnForUser(content.currentUser.username, comment.user.username, comment.id)

        // adding replies to comment if there is a reply

        if (comment.replies.length > 0) {
            let commentReplies = getClass(`comment-replies${comment.id}`);
            let replies = comment.replies
            replies.forEach((reply) => {
                commentReplies.innerHTML += commentTemplate(content.currentUser.image.png, reply.id, reply.content, reply.createdAt, reply.score, reply.user.image.png, reply.user.username);

                // remove the reply button if its on replied comment
                removeReplyBtnForUser(content.currentUser.username, reply.user.username, reply.id)
            })
        }
    })

    likes(getAllClass("likes-btn"), getAllClass("likes-count"))
    showReplyInput(content, getAllClass("reply"), getAllClass("comment-input"), getAllClass("comment--reply"), incrId)
    editComment(getAllClass("edit-btn"), getAllClass("content-wrapper"))
    deleteComment(commentWrapper, getAllClass("comment--reply"), getAllClass("delete-btn"))
    addComment(content, comments, getClass("comment-btn"), getClass("comment-inputs"), incrId)
}

// like button

const likes = (likes, showLikes) => {
    likes.forEach((like) => {
        like.addEventListener("click", (e) => {
            if (e.target.classList.contains("plus") || e.target.parentNode.classList.contains("plus")) {
                likeBtnNav(e.target, e.target.parentNode, "plus")
                console.log(showLikes)
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
}

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

// show reply input field onclick

const showReplyInput = (content, replyLinks, replyInputs, commentContainer, incrId) => {
    replyLinks.forEach((replyLink) => {
        replyLink.addEventListener("click", () => {
            replyInputs.forEach((replyInput) => {
                if (replyLink.dataset.comment == replyInput.dataset.comment) {
                    replyInput.classList.toggle("show")

                    // replying to individual comments, i might need to convert this into a function letter
                    const replyInputField = replyInput.childNodes[3].childNodes[1]
                    const replyBtn = replyInput.childNodes[5].childNodes[1]

                    replyBtn.addEventListener("click", () => {
                        let text = replyInputField.value
                        // i dont know whats happening here but the replies are been posted twice making sure the input is empty and checking that its empty help me get rid of it, but i know its not solved

                        replyInputField.focus()
                        if (text) {
                            commentContainer.forEach((commentCon) => {
                                if (replyInput.dataset.comment == commentCon.dataset.container) {
                                    const commentReplies = getClass(commentCon.childNodes[3].classList[1])
                                    incrId = incrId + 1
                                    commentReplies.innerHTML += commentTemplate(content.currentUser.image.png, incrId, text, "just now", 0, content.currentUser.image.png, content.currentUser.username);
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
}

// editing current user comments

const editComment = (editBtns, commentContent) => {
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
}

// delete current user comments

const deleteComment = (wrapper, commentContainer, deleteBtns) => {
    deleteBtns.forEach((deleteBtn) => {
        deleteBtn.addEventListener("click", (e) => {
            commentContainer.forEach((comment) => {
                if (deleteBtn.dataset.delete == comment.dataset.container) {
                    // this is just a tricky method to delete comments the delete wrapper is just there for showcase its not actually deleting the comments

                    const deleteWrapper = getClass("delete-wrapper")
                    deleteWrapper.classList.remove("hide")
                    deleteWrapper.addEventListener("click", (e) => {
                        if (e.target.classList.contains("cancel")) {
                            deleteWrapper.classList.add("hide")
                        }

                        if (e.target.classList.contains("delete")) {
                            deleteWrapper.classList.add("hide")
                            comment.innerHTML = ""
                        }
                    })
                    // i dont know why this is happening but if a change things in the DOM every other thing seize to work, all functionalities stop working and this is affecting all the codes, i know its my knowledge for know i will get a better understanding of this in the future
                    //     wrapper.innerHTML += `
                    //     <div class="delete-wrapper">
                    //     <h3>Delete comment</h3>
                    //     <p class="delete-message">
                    //       Are you sure you want to delete this comment? This will remove the comment and can't be undone
                    //     </p>
                    //     <div class="delete-btn-wrapper">
                    //       <button class="btn cancel">no cancel</button>
                    //       <button class="delete btn">yes delete</button>
                    //     </div>
                    //   </div>
                    //     `

                    // const deleteWrapper = getClass("delete-wrapper")
                    // deleteWrapper.addEventListener("click", (e) => {
                    //     // console.log(e.target)
                    //     comment.innerHTML = ""
                    //     if (e.target.classList.contains("cancel")) {
                    //         // deleteWrapper.classList.add("hide")
                    //         wrapper.removeChild(deleteWrapper)
                    //     }

                    //     if (e.target.classList.contains("delete")) {
                    //         wrapper.removeChild(deleteWrapper)
                    //         // let par = comment.parentNode
                    //         // par.removeChild(comment)
                    //         // console.log(comment.parentNode.childNodes,comment)
                    //         comment.innerHTML = ""
                    //     }
                    // })
                }
            })
        })
    })
}

// add comment by the user

const addComment = (content, comments, commentBtn, commentInput, incrId) => {
    commentBtn.addEventListener("click", () => {
        incrId = incrId + 1
        let text = commentInput.value
        comments.innerHTML += commentTemplate(content.currentUser.image.png, incrId, text, "just now", 0, content.currentUser.image.png, content.currentUser.username);
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
        let commentArr = content.comments
        commentArr.push(mainObj)
        // console.log(mainObj)
    })
}

fetch("data.json")
    .then(response => response.json())
    .then(obj => displayContent(obj))
    .catch(error => console.log(error))