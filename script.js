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

  console.log("daroSamaky was clicked!");
});
