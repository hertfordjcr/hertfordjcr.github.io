for (const mem of document.getElementsByClassName("memail")) {
  const x = mem.innerHTML;
  mem.innerHTML = `<a href='mailto:${x}'>${x}</a>`;
}
