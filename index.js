// 로그인,회원가입 모달창
document.addEventListener("DOMContentLoaded", () => {
  const signinButton = document.querySelector(".signinButton");
  const signupButton = document.querySelector(".signupButton");
  const modal = document.querySelector(".modal"); // 모달 창을 나타내는 요소

  signinButton.addEventListener("click", () => {
    modal.style.display = "block";
  });

  signupButton.addEventListener("click", () => {
    modal.style.display = "block";
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});
