document.addEventListener("DOMContentLoaded", function () {
  const signinButton = document.querySelector(".signinButton");
  const signupButton = document.querySelector(".signupButton");
  const modal = document.querySelector(".modal");

  signinButton.addEventListener("click", function () {
    modal.style.display = "block"; // 모달 표시
  });

  signupButton.addEventListener("click", function () {
    modal.style.display = "block"; // 모달 표시
  });

  // 모달 바깥을 클릭하면 모달 창 닫기
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});

// 게시물 클릭시 z-index

const boards = document.querySelectorAll(
  ".post-list, .membershipboard, .fetimageboard, .hospitalboard, .groupbuying, .preuser, .missing"
);
const links = document.querySelectorAll("[data-target]");

// 링크에 클릭 이벤트 리스너 추가
links.forEach((link) => {
  link.addEventListener("click", function (e) {
    event.preventDefault();

    // 클릭한 링크의 data-target
    const targetBoard = this.getAttribute("data-target");

    // 모든 게시판의 z-index 값을 0으로 초기화
    boards.forEach((board) => {
      board.style.zIndex = 0;
    });

    // 클릭한 링크에 게시판을 z-index 값을 2로설정
    const targetElement = document.querySelector("." + targetBoard);
    if (targetElement) {
      targetElement.style.zIndex = 2;
    }
  });
});
