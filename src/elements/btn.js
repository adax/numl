import NuActiveElement from './activeelement';

export default class NuBtn extends NuActiveElement {
  static get nuTag() {
    return 'nu-btn';
  }

  static get nuDefaults() {
    return {
      display: 'inline-grid',
      padding: '1x 2x',
      border: '1b',
      radius: '1r',
      flow: 'column',
      gap: '1x',
      content: 'center',
      hoverable: 'n :focusable[y]',
      fill: 'bg :special[special-bg] :themed[bg] :special:themed[special-bg]',
      text: 'nowrap :special[w5 nowrap]',
      toggle: '0 :active:focusable[.75em] :pressed:focusable[.75em] :pressed[.75em] :pressed:active[.75em]',
      color: '',
    };
  }

  static nuCSS({ tag, css }) {
    return `
      ${css}
      ${tag}[special] > :not([theme]) {
        --nu-text-soft-color: var(--nu-special-text-color);
        --nu-text-contrast-color: var(--nu-special-text-color);
        --nu-special: var(--nu-special-text-color);
        --nu-special: var(--nu-special-color);
        --nu-special-color: var(--nu-special-text-color);
        --nu-hover-color: var(--nu-special-hover-color);
      }
    `;
  }
}
