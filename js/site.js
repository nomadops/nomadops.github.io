// Behavior for nomadops.io pages. Each page loads this file with defer.

// Home page: the demo approval card in the hero.
{
  const demo = document.querySelector("[data-approval-demo]");

  if (demo) {
    const waiting = demo.querySelector('[data-state="waiting"]');
    const approved = demo.querySelector('[data-state="approved"]');
    const approveButton = demo.querySelector('[data-action="approve"]');
    const replayButton = demo.querySelector('[data-action="replay"]');

    // The clicked button gets hidden, so move focus to the button that replaces it.
    approveButton.addEventListener("click", () => {
      waiting.hidden = true;
      approved.hidden = false;
      replayButton.focus();
    });

    replayButton.addEventListener("click", () => {
      approved.hidden = true;
      waiting.hidden = false;
      approveButton.focus();
    });
  }
}

// Contact form: keep aria-invalid in step with the :user-invalid styles,
// so screen readers announce the same errors that people see.
{
  const form = document.querySelector("[data-contact-form]");

  if (form) {
    const touched = new WeakSet();

    const syncInvalid = (field) => {
      if (field.checkValidity()) {
        field.removeAttribute("aria-invalid");
      } else {
        field.setAttribute("aria-invalid", "true");
      }
    };

    form.addEventListener("input", (event) => {
      touched.add(event.target);
      if (event.target.hasAttribute("aria-invalid")) {
        syncInvalid(event.target);
      }
    });

    // blur does not bubble, so listen in the capture phase.
    form.addEventListener(
      "blur",
      (event) => {
        if (touched.has(event.target)) {
          syncInvalid(event.target);
        }
      },
      true,
    );

    // A blocked submit fires "invalid" on each field that fails, and no "submit" event.
    form.addEventListener(
      "invalid",
      (event) => {
        event.target.setAttribute("aria-invalid", "true");
      },
      true,
    );
  }
}
