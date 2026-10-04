const input = document.querySelector(".inpt");
const form = document.querySelector(".form");
const output = document.querySelector(".output");
const clipboard = document.querySelector(".clipboard");
const toast = document.getElementById("toast");

const origin = window.location.origin;

let toastTimer = null;

function showToast(msg) {
  clearTimeout(toastTimer);

  toast.textContent = msg;
  toast.classList.add("show");

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const original = input.value.trim();

  if (!original) {
    showToast("Please enter a URL!");
    return;
  }

  try {
    const response = await fetch(`${origin}/short`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        original,
      }),
    });

    if (!response.ok) {
      const text = await response.text();

      console.error("Server error:", text);

      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.url) {
      throw new Error("Invalid response from server");
    }

    input.value = "";

    output.textContent = `${origin}/${data.url}`;

    showToast(data.msg || "Short URL created!");
  } catch (error) {
    console.error("Something went wrong:", error);

    showToast("Something went wrong. Check console.");
  }
});

clipboard.addEventListener("click", async () => {
  const text = output.textContent.trim();

  if (!text) {
    showToast("Nothing to copy!");

    clipboard.classList.add("shake");

    setTimeout(() => {
      clipboard.classList.remove("shake");
    }, 400);

    return;
  }

  try {
    await navigator.clipboard.writeText(text);

    clipboard.classList.add("copied");

    setTimeout(() => {
      clipboard.classList.remove("copied");
    }, 1000);

    showToast("Copied to clipboard!");
  } catch (error) {
    console.error("Clipboard error:", error);

    showToast("Failed to copy!");

    clipboard.classList.add("shake");

    setTimeout(() => {
      clipboard.classList.remove("shake");
    }, 400);
  }
});