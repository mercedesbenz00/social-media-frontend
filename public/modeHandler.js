const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const body = document.querySelector('body')
const mode = urlParams.get('mode')
body.classList.add(`${mode ?? 'light'}-mode`)
