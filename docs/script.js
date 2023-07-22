// Github link of the presentation
const githubLink = new Cattract(document.querySelector(".github-btn-link"), {
  detectionRadius: "full",
});

const examples = document.querySelector(".examples");

const defaultOptions = {
  elementRadius: 50,
  detectionRadius: 120,
};

const options = [
  {},
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
  if (option.with_3d) {
    btn.style.transformStyle = "preserve-3d";
    btn.style.perspective = "500px";
    const text = document.createElement("p");
    text.style.transform = "translateZ(10px)";
    text.textContent = "Hover me";
    btn.appendChild(text);
  } else btn.textContent = "Hover me";

  example.appendChild(btn);
  examples.appendChild(example);

  const animation = new Cattract(btn, { ...defaultOptions, ...option });
  animation.debug();
}

for (const option of options) {
  createExample(option);
}
