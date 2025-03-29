import { css, html, LitElement } from 'https://esm.sh/lit'
import { createRef, ref } from 'https://esm.sh/lit/directives/ref'
import { map } from 'https://esm.sh/lit/directives/map'

export class SearchInput extends HTMLInputElement {
  constructor () {
    super()
    this.type = 'search'
  }
}

customElements.define('search-input', SearchInput, {
  extends: 'input',
})

/**
 * Debounce both sync and async functions.
 * @param {Function} func - Function to be executed.
 * @param {number} wait - Time to wait before executing function in milliseconds. Default is 250ms.
 * @returns {Function} - Debounced function.
 */
export function debounce (func, wait = 250) {
  let timeout
  if (func[Symbol.toStringTag] === 'AsyncFunction') {
    return function (...args) {
      clearTimeout(timeout)
      return new Promise((resolve, reject) => {
        timeout = setTimeout(() => {
          Promise.resolve(func.apply(this, [...args])).then(
            resolve,
          ).catch(reject)
        }, wait)
      })
    }
  } else {
    return function (...args) {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        timeout = null
        func.apply(this, [...args])
      }, wait)
    }
  }
}

export class Select3 extends LitElement {
  static formAssociated = true
  static properties = {
    name: { type: String, attribute: true, reflect: true },
    disabled: { type: Boolean, attribute: true, reflect: true },
    multiple: { type: Boolean, attribute: true, reflect: true },
    src: { type: String, attribute: true, reflect: true },
    _options: { type: Array, attribute: false, reflect: true },
  }

  constructor () {
    super()

    // Attach form controls internals
    this._internals = this.attachInternals()
    this._options = []
    this.hidden = false
    this.disabled = false
    this.multiple = false
  }

  static styles = css`
    :host {
      display: inline-block;
      background-color: Field;
      color: FieldText;
      width: 10em;
      height: 1.2em;
      font-size: 1rem;
      border-radius: 0.2rem;
      border: thin solid ButtonBorder;
    }

    input[type="search"] {
      width: 100%;
      height: 100%;
      border: none;
      background-color: transparent;
      color: FieldText;
      font-size: 1rem;
      padding: 0.2em;
      outline: none;
    }
  `

  searchInputRef = createRef()

  render = () => {
    console.debug('render', this._options)

    return html`
      <input type="search" ${ref(this.searchInputRef)}/>
      <slot @slotchange=${this.handleSlotChange}>
        ${
          map(this._options, (option) =>
            html`
              <option value=${option.value}>${option.label}</option>
            `)
        }
      </slot>
    `
  }

  firstUpdated () {
    this.searchInput = this.searchInputRef.value
    this.searchInput.addEventListener(
      'input',
      (event) => {
        this.debounceSearch(event.target.value)
      },
    )
  }

  // Form controls usually expose a "value" property
  get value () {
    for (const option of this._options) {
      if (option.selected) {
        return option.value
      }
    }
  }

  set value (v) {
    for (const option of this._options) {
      option.selected = option.value === v
    }
  }

  // The following properties and methods aren't strictly required,
  // but browser-level form controls provide them. Providing them helps
  // ensure consistency with browser-provided controls.
  get form () {
    return this._internals.form
  }

  get type () {
    return this.localName
  }

  get validity () {
    return this._internals.validity
  }

  get validationMessage () {
    return this._internals.validationMessage
  }

  get willValidate () {
    return this._internals.willValidate
  }

  checkValidity () {
    return this._internals.checkValidity()
  }

  reportValidity () {
    return this._internals.reportValidity()
  }

  get options () {
    return [...this._options]
  }

  // Implement the search functionality

  debounceSearch = debounce(
    this.search.bind(this),
    parseInt(this.getAttribute('debounce') || 250),
  )

  /**
   * Add an option to the select element.
   * @param {HTMLOptionElement} option - Option element to add.
   */
  add (option) {
    this._options.push(option)
    this.requestUpdate()
  }

  /**
   * Remove an option from the select element.
   * @param {HTMLOptionElement} option - Option element to remove.
   */
  remove (option) {
    this._options = this._options.filter(
      (item) => item !== option,
    )
    this.requestUpdate()
  }

  handleSlotChange = (event) => {
    console.debug('slotchange')
    this._options.push(...event.target.assignedElements({
      flatten: true,
      selector: 'option',
    }))
  }

  async search (term) {
    console.debug('searching for:', term)
    const response = await fetch(`${this.src}${term}`)
    const data = await response.json()
    this._options.length = 0
    for (const item of data) {
      this.add(
        new Option(item.login, item.id),
      )
    }
  }
}

customElements.define('select-3', Select3)
