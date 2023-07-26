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
    inverted: "x",
  },
  {
    axe: "x",
  },
  {
    with_3d: true,
  },
  {
    detectionRadius: "full",
  },
  {
    with_3d: {
      axe: "y",
      maxAngle: 30,
      perspective: 400,
      inverted: true,
    },
  },
];

function createExample(option) {
  const finalOption = { ...defaultOptions, ...option };

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

  const details = document.createElement("details");
  const summary = document.createElement("summary");
  const codeIcon = document.createElement("i");
  codeIcon.className = "fa-solid fa-code";
  const code = `new Cattract(element, ${JSON.stringify(
    finalOption,
    undefined,
    4
  )})`;
  const overlay = document.createElement("div");
  overlay.className = "overlay-code";
  const pre = document.createElement("pre");
  const codeElement = document.createElement("code");
  codeElement.textContent = code;
  codeElement.className = "language-javascript";
  pre.appendChild(codeElement);
  summary.appendChild(codeIcon);
  details.appendChild(summary);
  overlay.appendChild(pre);
  details.appendChild(overlay);

  example.appendChild(details);
  example.appendChild(btn);
  examples.appendChild(example);

  const animation = new Cattract(btn, finalOption);
  animation.debug();
}

for (const option of options) {
  createExample(option);
}

hljs.initHighlightingOnLoad();
