import Behavior from "./behavior";
import { log } from '../helpers';

export const BOOL_TYPE = (val) => val != null;

export default class WidgetBehavior extends Behavior {
  constructor($host, options) {
    super($host, options);

    this.props = $host.constructor.nuPropsList.reduce((props, name) => {
      props[name] = null;

      return props;
    }, {});

    Object.assign(this.props, {
      type: 'text',
      disabled: BOOL_TYPE,
    });
  }

  init() {
    const { $host } = this;

    this.propsList = Object.keys(this.props);

    for (let prop of this.propsList) {
      const value = $host.getAttribute(prop);

      this.fromAttr(prop, value);

      if (value != null) {
        this.changed(prop, value);
      }
    }
  }

  connected() {}

  changed(name, value) {
    for (let prop of this.propsList) {
      if (prop === name) {
        this.fromAttr(name, value);
      }
    }
  }

  fromAttr(name, value) {
    const defaults = this.props[name];

    if (typeof defaults === 'function') {
      const val = defaults(value);

      if (val !== undefined) {
        this[name] = defaults(value);
      }
    } else {
      this[name] = value != null ? value : defaults;
    }
  }

  /**
   * Emit custom event.
   * @param {String} name
   * @param {*} detail
   */
  emit(name, detail = null, options = {}) {
    if (name === 'input') {
      detail = this.getInputValue(detail);
    }

    log('emit', { element: this, name, detail, options });

    const event = new CustomEvent(name, {
      detail,
      bubbles: false,
      ...options,
    });

    event.nuTarget = this.$host;

    this.$host.dispatchEvent(event);
  }

  getInputValue(value) {
    const notNull = value != null;

    switch (this.type || this.$host.constructor.nuType) {
      case 'int':
        value = notNull ? parseInt(value, 10) : null;

        break;
      case 'float':
        value = notNull ? parseFloat(value) : null;

        const precision = parseInt(this.precision);

        if (value != null && precision === precision) {
          value = parseFloat(value.toFixed(precision));
        }

        break;
      case 'bool':
        value = notNull;

        break;
      case 'date':
        value = notNull ? new Date(value) : null;

        break;
      case 'daterange':
        if (!Array.isArray(value)) {
          value = null;
        }

        value = [new Date(value[0]), new Date(value[1])];

        break
      case 'array':
        try {
          value = JSON.parse(value);
        } catch (e) {
        }

        if (!Array.isArray(value)) {
          value = null;
        }

        break;
      case 'object':
        try {
          value = JSON.parse(value);
        } catch (e) {
        }

        if (typeof value !== 'object' && !Array.isArray(value)) {
          value = null;
        }

        break;
    }

    return value;
  }

  setRole(role) {
    this.$host.setAttribute('role', role);
  }

  control(bool, value) {
    this.nu('control')
      .then(Control => Control.apply(!!bool, value));
  }
}