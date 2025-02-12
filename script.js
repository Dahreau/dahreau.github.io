const daroSamaky = document.querySelector("#daroSamaky");

daroSamaky.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

daroSamaky.addEventListener("click", function (e) {
  const cursorPosition = { x: 0, y: 0 };

  cursorPosition.x = e.clientX;
  cursorPosition.y = e.clientY;

  console.log(
    `Cursor position: X: ${cursorPosition.x}, Y: ${cursorPosition.y}`
  );

  const firstBackground = document.createElement("div");
  firstBackground.style.position = "absolute";
  firstBackground.style.left = `${cursorPosition.x}px`;
  firstBackground.style.top = `${cursorPosition.y}px`;
  firstBackground.style.borderRadius = "50%";
  firstBackground.style.zIndex = "-1";
  firstBackground.style.backgroundColor = "#292929";
  firstBackground.style.width = "0px";
  firstBackground.style.height = "0px";
  firstBackground.style.transition =
    "width 2s, height 2s, left 2s ease 0s, top 2s ease 0s";
  setTimeout(() => {
    firstBackground.style.width = "3000px";
    firstBackground.style.height = "3000px";
    firstBackground.style.left = `${cursorPosition.x - 1500}px`;
    firstBackground.style.top = `${cursorPosition.y - 1500}px`;
  }, 0);
  firstBackground.style;
  document.body.appendChild(firstBackground);
  document.body.style.transition = "background-color 2s";
  document.body.style.backgroundColor = "#292929";
  setTimeout(() => {
    firstBackground.remove();
  }, 2000);
  firstBackground.id = "firstBackground";
  daroSamaky.style.transition = "opacity 1s";
  daroSamaky.style.opacity = "0";
  setTimeout(() => {
    daroSamaky.remove();
  }, 1000);

  console.log("daroSamaky was clicked!");
});

addEventListener("click", function (e) {
  const cursorPosition = { x: 0, y: 0 };

  cursorPosition.x = e.clientX;
  cursorPosition.y = e.clientY;

  const clickCircle = document.createElement("div");
  clickCircle.style.position = "absolute";
  clickCircle.style.left = `${cursorPosition.x}px`;
  clickCircle.style.top = `${cursorPosition.y}px`;
  clickCircle.style.borderRadius = "50%";
  clickCircle.style.zIndex = "-1";
  clickCircle.style.backgroundColor = "white";
  clickCircle.style.width = "0px";
  clickCircle.style.height = "0px";
  clickCircle.style.opacity = "0.2";
  document.body.appendChild(clickCircle);
  clickCircle.style.transition =
    "width 1s, height 1s, top 1s ease 0s, left 1s ease 0s, opacity 0.5s";
  setTimeout(() => {
    clickCircle.style.width = "100px";
    clickCircle.style.height = "100px";
    clickCircle.style.top = `${cursorPosition.y - 50}px`;
    clickCircle.style.left = `${cursorPosition.x - 50}px`;
  }, 0);
  setTimeout(() => {
    clickCircle.style.opacity = "0";
  }, 500);
});
