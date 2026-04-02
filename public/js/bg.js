function getHomeAnimationConfig() {
  return window.__homeAnimation?.getConfig?.() ?? {
    background: {
      fieldSize: 2560,
      density: { small: 1000, medium: 500, large: 250 },
      size: { small: 1, medium: 1.5, large: 2 },
      speed: { small: 50, medium: 100, large: 150 },
      travel: 2000,
    },
  };
}

function getRandom(max) {
  return Math.floor(Math.random() * max);
}

function generateField(count, color, fieldSize) {
  const total = Math.max(0, Math.floor(count));

  if (total === 0) {
    return "none";
  }

  let value = `${getRandom(fieldSize)}px ${getRandom(fieldSize)}px ${color}`;

  for (let index = 2; index <= total; index += 1) {
    value += `, ${getRandom(fieldSize)}px ${getRandom(fieldSize)}px ${color}`;
  }

  return value;
}

function applyField(element, size, shadowValue, animationDuration) {
  if (!element) {
    return;
  }

  if (shadowValue === "none") {
    element.style.cssText = "display: none;";
    return;
  }

  element.style.cssText = `
    display: block;
    width: ${size}px;
    height: ${size}px;
    border-radius: 50%;
    box-shadow: ${shadowValue};
    ${animationDuration ? `animation: animateParticle ${animationDuration}s linear infinite;` : ""}
  `;
}

function initBG() {
  const { background } = getHomeAnimationConfig();
  const fieldSize = background.fieldSize;

  const particles1 = document.getElementById("particles1");
  const particles2 = document.getElementById("particles2");
  const particles3 = document.getElementById("particles3");

  applyField(
    particles1,
    background.size.small,
    generateField(background.density.small, "#000", fieldSize),
    background.speed.small,
  );
  applyField(
    particles2,
    background.size.medium,
    generateField(background.density.medium, "#000", fieldSize),
    background.speed.medium,
  );
  applyField(
    particles3,
    background.size.large,
    generateField(background.density.large, "#000", fieldSize),
    background.speed.large,
  );

  const stars1 = document.getElementById("stars1");
  const stars2 = document.getElementById("stars2");
  const stars3 = document.getElementById("stars3");

  applyField(
    stars1,
    background.size.small,
    generateField(background.density.small, "#fff", fieldSize),
  );
  applyField(
    stars2,
    background.size.medium,
    generateField(background.density.medium, "#fff", fieldSize),
  );
  applyField(
    stars3,
    background.size.large,
    generateField(background.density.large, "#fff", fieldSize),
  );
}

function mountBG() {
  window.__homeAnimationBGUnsubscribe?.();

  if (window.__homeAnimation?.subscribe) {
    window.__homeAnimationBGUnsubscribe = window.__homeAnimation.subscribe(() => {
      initBG();
    });
    return;
  }

  initBG();
}

document.addEventListener("astro:after-swap", mountBG);
mountBG();
