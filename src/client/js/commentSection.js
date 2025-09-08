const form = document.getElementById("commentForm");


const videoContainer = document.getElementById("videoContainer");

const commentContainer = document.querySelector(".video__comments ul");

const addComment = (text, id) => {
    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    newComment.className = "video__comment";
    newComment.dataset.id = id;
    const icon = document.createElement("i");
    icon.className = "fas fa-comment";

    const spanText = document.createElement("span");
    spanText.className = "comment__text";
    spanText.innerText = `${text}`;

    const spanDelete = document.createElement("span");
    spanDelete.className = "comment__delete";
    spanDelete.innerText = "❌";

    newComment.appendChild(icon);
    newComment.appendChild(spanText);
    newComment.appendChild(spanDelete);

    videoComments.prepend(newComment);
}

const handleSubmit = async (event) => {
    event.preventDefault();

    const textarea = form.querySelector("textarea");

    const text = textarea.value;
    const videoId = videoContainer.dataset.id;
    if(text === "") {
        return;
    }
    const res = await fetch(`/api/videos/${videoId}/comment`, {
        method:"POST",
        headers: {
            "Content-Type":"application/json",
        },
        body: JSON.stringify({text}),
    });
    
    textarea.value = "";
    
    if(res.status === 201) {
        const {newCommentId} = await res.json();
        addComment(text, newCommentId);
    }
}

const handleCommentDelete = async ( event ) => {
    const deleteButton = event.target.closest(".comment__delete");
    

    if(!deleteButton) {
        return;
    }

    const comment = event.target.closest(".video__comment");
    const id = comment.dataset.id;

    const confirmation = confirm("댓글을 삭제하시겠습니까?");

    if(!confirm) {
        return;
    }

    const res = await fetch(`/api/comments/${id}/delete`, {
        method:"DELETE"
    })

    if(res.status === 200) {
        comment.remove();
    }
} 

if (form) {
    form.addEventListener("submit", handleSubmit);
}

commentContainer.addEventListener("click", handleCommentDelete);