const API_KEY = "";


const isTarget = async (image_src) => {

  const response = await fetch('https://eastus.api.cognitive.microsoft.com/vision/v3.2/analyze?visualFeatures=Tags,Adult', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": `${API_KEY}`,
    },
    body: JSON.stringify({
      "url": image_src
    }),
  });

  if (!response.ok)
    return null

  data_json = await response.json()

  return data_json.adult.isAdultContent || data_json.adult.isRacyContent || data_json.adult.isGoryContent

};


const processImage = async (img) => {
  if (img.naturalHeight <= 50 || img.naturalWidth <= 50) {
    return;
  }
  console.log('Processing image:', img.src);
  const targetDetected = await isTarget(img.src);
  console.log('Target detected:', targetDetected);

  if (targetDetected) {

    image_url = "https://pbs.twimg.com/media/FqjP42SWABIV59K.jpg"

    img.src = image_url

  }
};

const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(async (entry) => {
    if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      await processImage(entry.target);
    }
  });
}, {
  rootMargin: '0px',
  threshold: 0.1
});


const setupObservers = () => {
  Array.from(document.getElementsByTagName("img")).forEach(async img => {
    imageObserver.observe(img);
  });

  // Observe new images added to the DOM
  const mutationObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.tagName === 'IMG') {
          imageObserver.observe(node);
        }
      });
    });
  });

  mutationObserver.observe(document.body, { childList: true, subtree: true });
};

const intervalId = setInterval(() => {

  setupObservers();
  clearInterval(intervalId);

}, 100); // Check every 100ms
