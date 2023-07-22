// Github link of the presentation
const githubLink = new Cattract(document.querySelector(".github-btn-link"), {
  detectionRadius: "full",
});

const examples = document.querySelector(".examples");

const options = [
  {
    elementRadius: 50,
    detectionRadius: 120,
  },
  {
    animation: {
      ease: "ease-in",
      duration: 150,
    },
  },
  {
    scale: {
      from: 0.8,
      to: 1,
      animated: true,
    },
  },
  {
    inverted: true,
  },
  {
    axe: "x",
  },
  {
    with_3d: {
      maxAngle: 30,
    },
  },
];

function createExample(option) {
  const example = document.createElement("article");
  example.className = "example-block";

  const btn = document.createElement("button");
  btn.textContent = "Hello World !";

  example.appendChild(btn);
  examples.appendChild(example);

  const animation = new Cattract(btn, option);
  animation.debug();
}

for (const option of options) {
  createExample(option);
}
