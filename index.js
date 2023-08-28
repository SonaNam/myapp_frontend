function cardTemplate(no, title, content, creatorName, image) {
  const tr = document.createElement("div");
  tr.innerHTML = `
  <div style="width:300px; margin-bottom:3rem;" data-no="${no}">
    <em>${no}</em>
    <em>${title}</em>
    <hr>
    <h3>${content}</h3>
    <p>${content}</p>
    <p>${creatorName}</p>
    <img src="${image}" alt="">

    <hr>
    <div style="display:flex; justify-content:space-between;">
      <button class="btn-remove">삭제</button>
      <button class="btn-modify" id="btn-modify">수정</button>
    </div>
  </div>
`;
  return tr; // 변수 이름 수정
}
document.addEventListener("DOMContentLoaded", function () {
  const signinButton = document.querySelector(".signinButton");
  const signupButton = document.querySelector(".signupButton");
  const signInModal = document.querySelector(".modal");
  const signUpModal = document.querySelector(".signup-modal");

  signinButton.addEventListener("click", function () {
    signInModal.style.display = "block"; // 로그인 모달 표시
    signUpModal.style.display = "none"; // 회원가입 모달 숨김
  });

  signupButton.addEventListener("click", function () {
    signInModal.style.display = "none"; // 로그인 모달 숨김
    signUpModal.style.display = "block"; // 회원가입 모달 표시
  });

  // 모달 바깥을 클릭하면 모달 창 닫기
  window.addEventListener("click", function (event) {
    if (event.target === signInModal) {
      signInModal.style.display = "none";
    }
    if (event.target === signUpModal) {
      signUpModal.style.display = "none";
    }
  });
});
// 게시물 클릭시 visible

const boards = document.querySelectorAll(
  ".main-list, .post-list, .membershipboard, .fetimageboard, .hospitalboard, .groupbuying, .preuser, .missing"
);
const links = document.querySelectorAll("[data-target]");

// 게시판에 클릭 이벤트 리스너 추가
links.forEach((link) => {
  link.addEventListener("click", function (e) {
    event.preventDefault();

    // 클릭한 게시판 data-target
    const targetBoard = this.getAttribute("data-target");

    // 모든 게시판의 visibility 속성을 hidden으로 설정  다 hidden줌
    boards.forEach((board) => {
      board.style.visibility = "hidden";
    });

    // 클릭한 게시판에 visible로 설정   클릭한게시판만 visible줌
    const targetElement = document.querySelector("." + targetBoard);
    if (targetElement) {
      targetElement.style.visibility = "visible";
    }
  });
  // 게시물 글쓰기 모달창
});
document.addEventListener("DOMContentLoaded", () => {
  // "게시물작성하기" 버튼 요소 가져오기
  const postmodal = document.getElementById("postmodal");
  // 모달 창 요소 가져오기
  const modal1 = document.querySelector(".modal1");

  // 버튼 클릭 이벤트 처리
  postmodal.addEventListener("click", function () {
    // 모달 창 보이도록 스타일 변경
    modal1.style.display = "block";
  });

  // 모달 창 외부를 클릭하면 모달 창 닫기
  window.addEventListener("click", function (event) {
    if (event.target == modal1) {
      modal1.style.display = "none";
    }
  });
});

const post_btn = document.querySelector("#add_post_btn");
const title = document.querySelector("#title");
const text_content = document.querySelector("#text_content");
const file = document.querySelector("#img");
const fetimageboard = document.querySelector(".fetimageboard");
console.log(img);
console.log(title);
console.log(text_content);

post_btn.addEventListener("click", async (e) => {
  e.preventDefault();

  const reader = new FileReader();
  reader.addEventListener("load", async (e) => {
    const img = e.target.result;

    const response = await fetch("http://localhost:8080/posts/addPost", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        title: title.value,
        content: text_content.value,
        image: img,
      }),
    });
    const result = await response.json();
    const { data } = result;
    fetimageboard.append(
      cardTemplate(
        data.no,
        data.title,
        data.content,
        data.creatorName,
        data.image
      )
    );
  });

  reader.readAsDataURL(file.files[0]);

  // 버튼 이벤트
});

(async () => {
  const response = await fetch("http://localhost:8080/posts/getPost");

  const result = await response.json();

  result.forEach((item) => {
    fetimageboard.append(
      cardTemplate(
        item.no,
        item.title,
        item.content,
        item.creatorName,
        item.image
      )
    );
  });
})();

// 삭제 기능 추가
document.addEventListener("click", async function (event) {
  if (event.target.classList.contains("btn-remove")) {
    const no = event.target.parentElement.parentElement.dataset.no;
    console.log(no);
    const response = await fetch(
      `http://localhost:8080/posts/removePost?no=${no}`,
      {
        method: "DELETE",
      }
    );

    if (response.status === 200) {
      // 삭제 성공한 경우 해당 게시물을 화면에서 제거
      const deletedElement = document.querySelector(`[data-no="${no}"]`);
      if (deletedElement) {
        deletedElement.remove();
      }
    } else {
    }
  }
});
// 수정
document.addEventListener("DOMContentLoaded", function () {
  const modifyButtons = document.querySelectorAll(".btn-modify");

  modifyButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      const card = event.target.closest("div[data-no]");
      const no = card.getAttribute("data-no");
      const title = card.querySelector("em").innerText;
      const content = card.querySelector("h3").innerText;

      // 모달에 데이터 바인딩
      document.getElementById("modalNo").value = no;
      document.getElementById("modalTitleInput").value = title;
      document.getElementById("modalContentInput").value = content;

      // 모달 표시
      document.querySelector(".modal-modify").style.display = "block";
    });
  });

  // 모달 닫기 로직, 모달 저장 로직 등을 추가
});
