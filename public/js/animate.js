function getRevealConfig() {
  return window.__homeAnimation?.getConfig?.().reveal ?? {
    offset: 50,
    duration: 1000,
    stagger: 150,
  };
}

function applyRevealCssVars(config) {
  document.documentElement.style.setProperty("--reveal-offset", `${config.offset}px`);
  document.documentElement.style.setProperty("--reveal-duration", `${config.duration}ms`);
}

function animate(forceReplay = false) {
  const config = getRevealConfig();
  const animateElements = document.querySelectorAll(".animate");

  applyRevealCssVars(config);

  animateElements.forEach((element, index) => {
    window.clearTimeout(element.__revealTimer);

    if (forceReplay) {
      element.classList.remove("show");
      void element.offsetWidth;
    }

    element.__revealTimer = window.setTimeout(() => {
      element.classList.add("show");
    }, index * config.stagger);
  });
}

function mountRevealAnimation() {
  window.__homeAnimationAnimateUnsubscribe?.();

  if (window.__homeAnimation?.subscribe) {
    window.__homeAnimationAnimateUnsubscribe = window.__homeAnimation.subscribe((config) => {
      applyRevealCssVars(config.reveal);
    });
  } else {
    applyRevealCssVars(getRevealConfig());
  }

  window.__homeAnimationAnimate = {
    replay() {
      animate(true);
    },
  };

  animate();
}

document.addEventListener("DOMContentLoaded", mountRevealAnimation);
document.addEventListener("astro:after-swap", mountRevealAnimation);
