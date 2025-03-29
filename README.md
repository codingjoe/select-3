# Select-3 (draft)

_This project is in early development and not yet ready for production use._

**Modern & lightweight select box replacement.**

* Baseline 2024 compliant with all modern browsers.
* Lightweight (less than 1KB minified and gzipped).
* Drop in replacement for `<select>` elements with full native form support.
* Customizable Web Components without interference with native elements.
* Fully accessible with keyboard navigation.

## Installation

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/select-3@latest/dist/select-3.min.js" crossorigin="anonymous"></script>
```

## Usage

```html
<form>
  <label>
    Language:
    <select-3 name="language" placeholder="Select a language">
      <option value="en">English</option>
      <option value="es" selected>Español</option>
      <option value="de">Deutsch</option>
    </select-3>
  </label>
</form>
```

### Autocomplete & Dynamic Options (AJAX)

```html
<form>
  <label>
    GitHub Users
    <select-3 name="gh-user" placeholder="Search a GitHub user" src="https://api.github.com/users?q="></select-3>
  </label>
</form>
```

### Customization

```javascript
import { Select3 } from 'https://cdn.jsdelivr.net/npm/select-3@latest/dist/select-3.min.js'


class MySelect extends Select3 {
  constructor() {
    super();
    this.placeholder = 'Select a custom option';
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('change', (e) => {
      console.log('Selected value:', e.detail.value);
    });
  }
}
customElements.define('my-select', MySelect, { extends: 'select-3' });
```

```html

<form>
  <label>
    Custom Select
    <my-select name="custom-select" placeholder="Select a custom option">
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
      <option value="3">Option 3</option>
    </my-select>
  </label>
</form>
```
