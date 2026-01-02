// Create template and style constants
const template = document.createElement("template");

const thumbStyles = `
  background-color: var(--thumb-background-color);
  background-image: var(--thumb-background-image);
  background-size: 90%;
  background-position: center center;
  background-repeat: no-repeat;
  border-radius: var(--thumb-radius);
  border: var(--thumb-border-size) var(--thumb-border-color) solid;
  color: var(--thumb-border-color);
  width: var(--thumb-size);
  height: var(--thumb-size);
`;

const thumbFocusStyles = `
  box-shadow: 0px 0px 0px var(--focus-width) var(--focus-color);
`;

const thumbSvgWidth = 4;

// Set template HTML with styles
template.innerHTML = `
  <style>
    :host {
      --exposure: 50%;

      --thumb-background-color: hsl(0, 0%, 95%, 0.9);
      --thumb-background-image: none;
      --thumb-size: 24px;
      --thumb-radius: 50%;
      --thumb-border-color: hsl(0, 0%, 50%, 0.5);
      --thumb-border-size: 2px;

      --focus-width: var(--thumb-border-size);
      --focus-color: hsl(220, 100%, 60%);

      --divider-width: 2px;
      --divider-color: hsl(0, 0%, 50%, 0.5);

      display: flex;
      flex-direction: column;
      margin: 0;
      overflow: hidden;
      position: relative;
    }

    ::slotted(img) {
      height: auto;
      width: 100%;
    }

    ::slotted([slot='image-2']) {
      clip-path: polygon(
        calc(var(--exposure) + var(--divider-width)/2) 0, 
        100% 0, 
        100% 100%, 
        calc(var(--exposure) + var(--divider-width)/2) 100%
      );
    }

    slot {
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    slot[name='image-2'] {
      position: absolute;
      top: 0;
      filter: drop-shadow(calc(var(--divider-width) * -1) 0 0 var(--divider-color));
    }

    .visually-hidden {
      border: 0; 
      clip: rect(0 0 0 0); 
      clip-path: polygon(0px 0px, 0px 0px, 0px);
      -webkit-clip-path: polygon(0px 0px, 0px 0px, 0px);
      height: 1px; 
      margin: -1px;
      overflow: hidden;
      padding: 0;
      position: absolute;
      width: 1px;
      white-space: nowrap;
    }

    label {
      align-items: stretch;
      display: flex;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
    }

    input {
      cursor: col-resize;
      margin: 0 calc(var(--thumb-size) / -2);
      width: calc(100% + var(--thumb-size));
      appearance: none;
      -webkit-appearance: none;
      background: none;
      border: none;
    }

    ::-moz-range-thumb {
      ${thumbStyles}
    }

    ::-webkit-slider-thumb {
      -webkit-appearance: none;
      ${thumbStyles}
    }

    input:focus::-moz-range-thumb {
      ${thumbFocusStyles}
    }

    input:focus::-webkit-slider-thumb {
      ${thumbFocusStyles}
    }

    input:hover::-moz-range-thumb {
      ${thumbStyles}
      --thumb-background-color: hsl(0, 0%, 90%, 0.8);
      --thumb-border-color: hsl(0, 0%, 70%, 0.8);
    }

    input:hover::-webkit-slider-thumb {
      ${thumbStyles}
      --thumb-background-color: hsl(0, 0%, 90%, 0.8);
      --thumb-border-color: hsl(0, 0%, 70%, 0.8);
    }

    .arrow-left {
      position: absolute;
      left: -40px;
      top: 66%;
      transform: translateY(-166%);
      width: 0;
      height: 0;
      border-left: 10px solid transparent;
      border-top: 10px solid transparent;
      opacity: 0;
      transition: opacity 0.2s ease, transform 0.2s ease;
      pointer-events: none;
      border-radius: 50%;
    }

    .arrow-right {
      position: absolute;
      right: -40px;
      top: 66%;
      transform: translateY(-166%);
      width: 0;
      height: 0;
      border-right: 10px solid transparent;
      border-top: 10px solid transparent;
      opacity: 0;
      transition: opacity 0.2s ease, transform 0.2s ease;
      pointer-events: none;
      border-radius: 50%;
    }

    .arrow-left::after {
      content: '';
      position: absolute;
      left: -15px;
      top: 66%;
      transform: translateY(25%);
      opacity: 0;
      transition: opacity 0.2s ease, transform 0.2s ease;
      width: 0;
      height: 0;
      border-left: 8px solid currentColor;
      border-bottom: 8px solid currentColor;
      border-top: 8px solid currentColor;
      transform: rotate(45deg);
    }

    .arrow-right::after {
      content: '';
      position: absolute;
      right: -15px;
      top: 66%;
      transform: translateY(25%);
      opacity: 0;
      transition: opacity 0.2s ease, transform 0.2s ease;
      width: 0;
      height: 0;
      border-right: 8px solid currentColor;
      border-bottom: 8px solid currentColor;
      border-top: 8px solid currentColor;
      transform: rotate(-45deg);
    }

    input:hover ~ .arrow-left,
    input:hover ~ .arrow-right {
      opacity: 1;
    }

    input:not(:hover) ~ .arrow-left,
    input:not(:hover) ~ .arrow-right {
      opacity: 0;
      transition: opacity 0.2s ease;
    }
  </style>

  <slot name="image-1"></slot>
  <slot name="image-2"></slot>
  
  <div class="arrow-left"></div>
  <div class="arrow-right"></div>
  <label>
    <span class="visually-hidden js-label-text">
      Control how much of each overlapping image is shown. 
      0 means: first image is completely hidden and the second image is fully visible.
      100 means: first image is fully visible and the second image is completely hidden.
      50 means: both images are half-shown, half-hidden.
    </span>
    <input type="range" value="50" min="0" max="100"/>
  </label>
`;

// ImageCompare web component class
class ImageCompare extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    // Clone template content to shadow DOM
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Add event listeners for slider functionality
    ["input", "change"].forEach((eventType) => {
      this.shadowRoot.querySelector("input").addEventListener(eventType, ({ target }) => {
        // Cancel any pending animation frame
        if (this.animationFrame) {
          cancelAnimationFrame(this.animationFrame);
        }
        
        // Request new animation frame to update exposure
        this.animationFrame = requestAnimationFrame(() => {
          this.shadowRoot.host.style.setProperty("--exposure", `${target.value}%`);
        });
      });
    });

    // Update label text if provided
    const labelText = this.shadowRoot.host.getAttribute("label-text");
    if (labelText) {
      this.shadowRoot.querySelector(".js-label-text").textContent = labelText;
    }
  }
}

// Define the custom element
customElements.define("image-compare", ImageCompare);
