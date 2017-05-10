for (let mem of document.getElementsByClassName("memail")) {
  let x = mem.innerHTML;
  mem.innerHTML = `<a href='mailto:${x}'>${x}</a>`;
}
