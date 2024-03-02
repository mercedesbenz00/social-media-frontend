export const scroll = (el: Element, scrollTop?: number): void => {
  const top = scrollTop || el.scrollHeight - el.clientHeight

  if (typeof el.scroll === 'function') el.scroll({ top: top })
  else el.scrollTop = top // eslint-disable-line no-param-reassign
}

export default scroll

export const scrollToBottom = (el) => {
  if (typeof el.scroll === 'function') {
    el.scroll({
      top: el.scrollHeight,
      behavior: 'smooth',
    })
  } else {
    el.scrollTop = el.scrollHeight
  }
}
