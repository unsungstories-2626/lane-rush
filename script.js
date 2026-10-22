// Lane Rush privacy site: small helpers only. The page works fully without JavaScript.
(function () {
  "use strict";

  // 1. Current year in the footer
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // 2. Highlight the policy section you are reading in the contents list
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll(".toc a"));
  var clauses = tocLinks
    .map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);

  function setActive(id) {
    tocLinks.forEach(function (link) {
      var isActive = link.getAttribute("href") === "#" + id;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  if ("IntersectionObserver" in window && clauses.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );
    clauses.forEach(function (clause) {
      observer.observe(clause);
    });
  }

  // 3. Copy email button
  var copyBtn = document.querySelector(".copy-btn");
  var statusEl = document.querySelector(".copy-status");

  function showStatus(message) {
    if (!statusEl) return;
    statusEl.textContent = message;
    window.clearTimeout(showStatus.timer);
    showStatus.timer = window.setTimeout(function () {
      statusEl.textContent = "";
    }, 2500);
  }

  function fallbackCopy(text) {
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "absolute";
    area.style.left = "-9999px";
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (e) {
      ok = false;
    }
    document.body.removeChild(area);
    return ok;
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var text = copyBtn.getAttribute("data-copy");
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(
          function () {
            showStatus("Email copied.");
          },
          function () {
            showStatus(fallbackCopy(text) ? "Email copied." : "Copy failed. Select the email above instead.");
          }
        );
      } else {
        showStatus(fallbackCopy(text) ? "Email copied." : "Copy failed. Select the email above instead.");
      }
    });
  }
})();
