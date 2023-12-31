let isLastPage = false;
const PAGE_SIZE = 6;
let currentQuery = "";
let currentPage = 0;

function cardTemplate(no, title, content, creatorName, image, boardValue) {
  const tr = document.createElement("div");
  tr.dataset.value = boardValue;
  tr.innerHTML = `
    <div style="width:300px; margin-bottom:3rem;" data-no="${no}" dt>
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

// 게시물 클릭시 visible
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

  const boards = document.querySelectorAll(
    ".main-list, .post-list, .membershipboard, .fetimageboard, .hospitalboard, .groupbuying, .preuser, .missing"
  );

  // main-list 제외한 모든 게시판을 hidden 상태로 설정
  boards.forEach((board) => {
    if (!board.classList.contains("main-list")) {
      board.style.visibility = "hidden";
    }
  });

  const links = document.querySelectorAll("[data-target]");

  // 게시판에 클릭 이벤트 리스너 추가
  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      event.preventDefault();

      const targetBoard = this.getAttribute("data-target");

      // 모든 게시판을 hidden 상태로 설정
      boards.forEach((board) => {
        board.style.visibility = "hidden";
      });

      // 클릭한 게시판을 visible 상태로 설정
      const targetElement = document.querySelector("." + targetBoard);
      if (targetElement) {
        targetElement.style.visibility = "visible";
      }
    });
  });

  // 게시물작성
  const modal1 = document.querySelector(".modal1");
  const postmodalButtons = document.querySelectorAll(".postmodal");
  postmodalButtons.forEach((button) => {
    button.addEventListener("click", function () {
      modal1.style.display = "block";
    });
  });
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
//모달창 작성 클릭하면 보내지기------------------------------------------------------
post_btn.addEventListener("click", async (e) => {
  e.preventDefault();
  const myfat = document.querySelector("#myfat");

  // console.log(myfat.id + "check------------");
  const reader = new FileReader();
  reader.addEventListener("load", async (e) => {
    const img = e.target.result;

    const response = await fetch("http://localhost:8080/posts", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        title: title.value,
        content: text_content.value,
        image: img,
        boardValue: myfat.id,
      }),
    });
    const result = await response.json();
    const { data } = result;
    fetimageboard.prepend(
      cardTemplate(
        data.no,
        data.title,
        data.content,
        data.creatorName,
        data.image,
        data.boardValue
      )
    );
  });

  reader.readAsDataURL(file.files[0]);

  //우리아이 게시판 클릭하면 get------------------------------------------------------
});

const my_fat_post = document.getElementById("my_fat_post");
my_fat_post.addEventListener("click", (e) => {
  e.preventDefault();
  getPagedList(currentPage);
});
async function getPagedList(page) {
  const myfat = "myfat";
  const resultvalue = "매니저";
  console.log("Requested Page Number:", page);

  const response = await fetch(
    `http://localhost:8080/posts/paging?post=${myfat}&creatorName=${resultvalue}&page=${page}&size=${PAGE_SIZE}`
  );

  console.log(response);

  const result = await response.json();
  console.log(result);

  if (
    document.contains(document.getElementById("zzzPrev")) &&
    document.contains(document.getElementById("zzzNext"))
  ) {
    console.log("버튼 요소가 DOM에 존재합니다.");
  } else {
    console.log("버튼 요소가 DOM에 없습니다.");
  }
  const postContainer = document.querySelector("#postContainer ");
  postContainer.innerHTML = "";

  for (let item of result.content) {
    const existingPost = postContainer.querySelector(`[data-no="${item.no}"]`);
    if (!existingPost) {
      postContainer.prepend(
        cardTemplate(
          item.no,
          item.title,
          item.content,
          item.creatorName,
          item.image,
          item.boardValue
        )
      );
    }
  }
  currentPage = page;
  console.log("Updated currentPage:", currentPage);

  isLastPage = result.last;
  setBtnActive();
}

// 웹페이지 로딩이 완료되면, 페이징으로 데이터 조회 및 목록 생성
(() => {
  window.addEventListener("DOMContentLoaded", () => {
    // 첫번째 페이지 조회
    getPagedList(0);
  });
})();
document.addEventListener("DOMContentLoaded", function () {
  var element = document.getElementById("someElement");
  if (element) {
    element.addEventListener("click", function () {
      console.log("Element clicked!");
    });
  }
});
(() => {
  // 이전/다음 버튼 선택

  const btnPrev = document.getElementById("zzzPrev");
  const btnNext = document.getElementById("zzzNext");

  // 이전 버튼
  btnPrev.addEventListener("click", (e) => {
    e.preventDefault();
    getPagedList(currentPage - 1, currentQuery);
  });
  // 다음 버튼
  btnNext.addEventListener("click", (e) => {
    e.preventDefault();
    getPagedList(currentPage + 1, currentQuery);
  });
})();

function setBtnActive() {
  const btnPrev = document.getElementById("zzzPrev");
  const btnNext = document.getElementById("zzzNext");

  if (!btnPrev || !btnNext) {
    console.log("하나 또는 둘 다의 버튼 요소가 DOM에 없습니다.");
    return; // 버튼이 없으면 함수를 더 이상 진행하지 않고 종료
  }

  // 첫번째 페이지이면 이전 버튼 비활성화
  if (currentPage === 0) {
    btnPrev.disabled = true;
  } else {
    btnPrev.disabled = false;
  }

  // 마지막 페이지이면 다음 버튼 비활성화
  if (isLastPage) {
    btnNext.disabled = true;
  } else {
    btnNext.disabled = false;
  }
}

// 병원모달
document.addEventListener("DOMContentLoaded", function () {
  const modalhos = document.querySelector(".modal_hos");
  const hosmodalbtn = document.querySelector(".hosmodal");
  const closeBtn = document.getElementById("add-hos-btn");

  // 버튼을 클릭하면 모달 열기
  hosmodalbtn.onclick = function () {
    modalhos.style.display = "block";
  };

  // 작성하기 버튼을 클릭하면 모달 닫기
  closeBtn.onclick = function (event) {
    event.preventDefault(); // 폼 제출 방지
    modalhos.style.display = "none";
  };

  // 모달 외부를 클릭하면 모달 닫기
  window.onclick = function (event) {
    if (event.target == modalhos) {
      modalhos.style.display = "none";
    }
  };
});

// 병원
const hosbtn = document.querySelector("#add-hos-btn");
const hostitle = document.querySelector("#hostitle");
const textcontent = document.querySelector("#hos-text-content");
const hosfile = document.querySelector("#hos-img");
const hospitalboard = document.querySelector(".hospitalboard");
console.log(hosfile);
console.log(hostitle);
console.log(textcontent);
//모달창 작성 클릭하면 보내지기------------------------------------------------------

hosbtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const hospital = document.querySelector("#hospital");

  // console.log(myfat.id + "check------------");
  const reader = new FileReader();
  reader.addEventListener("load", async (e) => {
    const hosfile = e.target.result;

    const response = await fetch("http://localhost:8080/posts", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        title: hostitle.value,
        content: textcontent.value,
        image: hosfile,
        boardValue: hospital.id,
      }),
    });
    const result = await response.json();
    const { data } = result;
    hospitalboard.prepend(
      cardTemplate(
        data.no,
        data.title,
        data.content,
        data.creatorName,
        data.image,
        data.boardValue
      )
    );
  });
  reader.readAsDataURL(hosfile.files[0]);
});
//병원 게시판 클릭하면 get------------------------------------------------------

const hospost = document.getElementById("hospost");
hospost.addEventListener("click", async () => {
  const hospital = "hospital";
  const response = await fetch(`http://localhost:8080/posts?post=${hospital}`);

  const result = await response.json();

  result.forEach((item) => {
    // 이미 해당 게시물이 있는지 확인
    const existingPost = hospitalboard.querySelector(`[data-no="${item.no}"]`);
    if (!existingPost) {
      // 존재하지 않으면 새 게시물 추가
      hospitalboard.prepend(
        cardTemplate(
          item.no,
          item.title,
          item.content,
          item.creatorName,
          item.image,
          item.boardValue
        )
      );
    }
  });
});

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
//   수정
document.addEventListener("DOMContentLoaded", function () {
  // 모달 변수
  const modalModify = document.querySelector(".modal-modify");
  const modalNo = document.getElementById("modalNo");
  const modalTitleInput = document.getElementById("modalTitleInput");
  const modalContentInput = document.getElementById("modalContentInput");
  const modalSaveBtn = document.getElementById("modalSaveBtn");
  const modalCloseBtn = document.getElementById("modalCloseBtn");

  // 수정 버튼 클릭 이벤트
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("btn-modify")) {
      const cardDiv = event.target.closest("[data-no]");
      modalNo.value = cardDiv.getAttribute("data-no");
      modalTitleInput.value =
        cardDiv.querySelector("em:nth-child(2)").textContent;
      modalContentInput.value =
        cardDiv.querySelector("p:nth-child(5)").textContent;
      modalModify.style.display = "block";
    }
  });

  // 저장 버튼 클릭 이벤트
  modalSaveBtn.addEventListener("click", function () {
    const cardDiv = document.querySelector(`[data-no="${modalNo.value}"]`);
    if (cardDiv) {
      cardDiv.querySelector("em:nth-child(2)").textContent =
        modalTitleInput.value;
      cardDiv.querySelector("h3:nth-child(4)").textContent =
        modalContentInput.value;
      cardDiv.querySelector("p:nth-child(5)").textContent =
        modalContentInput.value;
      modalModify.style.display = "none"; // 모달 닫기
    }
    // 서버에 PUT 요청 전송
    fetch(`http://localhost:8080/posts/modifyPost?no=${modalNo.value}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: modalTitleInput.value,
        content: modalContentInput.value,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  });

  // 닫기 버튼 클릭 이벤트
  modalCloseBtn.addEventListener("click", function () {
    modalModify.style.display = "none";
  });

  // 모달 바깥 클릭 이벤트
  window.addEventListener("click", function (event) {
    if (event.target === modalModify) {
      modalModify.style.display = "none";
    }
  });
});
