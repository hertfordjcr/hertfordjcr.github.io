/* jshint browser: true */

function msearchReady() {

  // handle search term carried in URL
  var st = window.location.href.split("?")[1];
  if (st != null) {
    document.getElementById("searchfield").value = st.split("%20").join(" ");
    // force refresh on placeholder, so it's hidden until text cleared
    document.getElementById("searchfield").removeAttribute("placeholder");
    document.getElementById("searchfield").setAttribute("placeholder", "search");
    doSearch();
  }

  // event listener to focus search when hovered
  document.getElementById("searchfield").addEventListener("mouseover", function () {
    document.getElementById("searchfield").focus();
  });

  // event listener to handle item when clicked
  [].forEach.call(getAllItems(), function (item) {
    item.addEventListener("click", function (e) {
      e = window.event || e;
      if (e.target === this || e.target === getItemNameElement(item))
        handleItem(item);
    });
  });
}

function getItemLink(item) {
  return item.getAttribute("data-link");
}

function getItemGrow(item) {
  return item.getElementsByClassName("itemgrow")[0];
}

function handleItem(item) {
  var link = getItemLink(item);
  if (link !== null) window.location.href = link;
  else if (!handleGrowItem(item)) {
    handleHideItem(item);
  }
}

function handleHideItem(item) {
  var grow = getItemGrow(item);
  if (grow != null && item.className !== "item") {
    item.className = "item";
    Velocity(grow, "slideUp", {
      duration: 300
    });
  }
}

function handleGrowItem(item) {
  var grow = getItemGrow(item);
  if (grow != null && item.className === "item") {
    item.className = "item itemfocus";
    Velocity(grow, "slideDown", {
      duration: 300
    });
    return true;
  } else return false;
}

function getSections() {
  return document.getElementsByTagName("section");
}

function getSectionName(section) {
  return section.getElementsByTagName("h3")[0].innerHTML;
}

function getAllItems() {
  return document.getElementsByClassName("item");
}

function getItems(section) {
  return section.getElementsByClassName("item");
}

function getItemName(item) {
  return getItemNameElement(item).innerHTML;
}

function getItemNameElement(item) {
  return item.getElementsByTagName("h4")[0];
}

var singletonitemcatch;
var oldsingletonitemcatch;

function doSearch() {
  // format search term
  var full = document.getElementById("searchfield").value.trim().toUpperCase();
  if (full.length === 0) {
    showAll();
    if (oldsingletonitemcatch != null) {
      handleHideItem(oldsingletonitemcatch);
      oldsingletonitemcatch = null;
    }
    document.getElementsByTagName("main")[0].className = "";
    return; // search cancelled; show everything
  }
  full = " " + full;

  var numresults = 0;
  [].forEach.call(getSections(), function (section) {
    if (searchSection(section, full)) {
      showFullSection(section);
      var itemcount = getItems(section).length;
      numresults += itemcount;
      if (itemcount === 1) {
        singletonitemcatch = getItems(section)[0];
      }
    } else {
      var noneVisible = true;
        [].forEach.call(getItems(section), function (item) {
        if (searchItem(item, full)) {
          showItem(item);
          numresults += 1;
          singletonitemcatch = item;
          noneVisible = false;
        } else hideDiv(item);
      });
      if (noneVisible) hideDiv(section);
      else showSection(section);
    }
  });

  document.getElementById("noresults").style.display = numresults === 0 ? "block" : "none";
  // If only one item matches, grow it if possible
  // If one item matched before, hide it 
  if (numresults === 1) {
    handleGrowItem(singletonitemcatch);
    oldsingletonitemcatch = singletonitemcatch;
    document.getElementsByTagName("main")[0].className = "singleitem";
  } else if (oldsingletonitemcatch != null) {
    handleHideItem(oldsingletonitemcatch);
    oldsingletonitemcatch = null;
    document.getElementsByTagName("main")[0].className = "";
  }
}

function searchSection(section, sfor) {
  return (" " + getSectionName(section)).toUpperCase().includes(sfor);
}

function searchItem(item, sfor) {
  if ((" " + getItemName(item)).toUpperCase().includes(sfor)) return true;
  var terms = item.getAttribute("data-terms");
  if (terms === null) return false;
  var matchesterm = false;
    [].forEach.call(terms.split(", "), function (sin) {
    if ((" " + sin).toUpperCase().includes(sfor)) matchesterm = true;
  });
  return matchesterm;
}

function showAll() {
  [].forEach.call(getSections(), showSection);
  [].forEach.call(getAllItems(), showItem);
  hideDiv(document.getElementById("noresults"));
}

function showFullSection(section) {
  showSection(section);
  [].forEach.call(getItems(section), showItem);
}

function hideDiv(divv) {
  divv.style.display = "none";
}

function showSection(divv) {
  divv.style.display = "inline-block";
}

function showItem(divv) {
  divv.style.display = "block";
}