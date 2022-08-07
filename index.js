const btn = document.querySelector(".pickColorButton");
const exactColor = document.querySelector(".exactColor");
const hexColor = document.querySelector(".hexColor");
const copied = document.querySelector(".copied");

btn.addEventListener("click", async () => {
  chrome.storage.sync.get("color", ({ color }) => {
    console.log("Color: ", color);
  });

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      function: pickColor,
    },
    async (injectionResults) => {
      const [data] = injectionResults;

      if (data.result) {
        const color = data.result.sRGBHex;
        exactColor.style.backgroundColor = color;
        hexColor.innerText = color;
        copied.style.display = "block";
        try {
          await navigator.clipboard.writeText(color);
        } catch (error) {
          console.log(error);
        }
      }
    }
  );
});

async function pickColor() {
  try {
    // Picker
    const eyeDropper = new EyeDropper();
    return await eyeDropper.open();
  } catch (err) {
    console.error(err);
  }
}
