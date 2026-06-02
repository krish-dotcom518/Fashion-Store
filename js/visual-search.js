let model;

const products = [
  { name: 'Volkso Dress', src: 'images/products/dress2.jpg' },
  { name: 'Magisho Fur Dress', src: 'images/products/dress 3.jpg' },
];

async function loadModel() {
  model = await mobilenet.load();
  console.log("✅ MobileNet loaded");
}

async function getImageFeatures(imgElement) {
  return model.infer(imgElement, true);
}

async function findSimilarProducts(userImg) {
  const userFeature = await getImageFeatures(userImg);

  const matches = await Promise.all(products.map(async (p) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = p.src;
    await new Promise(res => img.onload = res);
    const productFeature = await getImageFeatures(img);
    const distance = tf.norm(tf.sub(userFeature, productFeature)).dataSync()[0];
    return { ...p, distance };
  }));

  return matches.sort((a, b) => a.distance - b.distance).slice(0, 4);
}

function showResults(matches) {
  const results = document.getElementById("results");
  results.innerHTML = "";
  matches.forEach(match => {
    const col = document.createElement("div");
    col.className = "column";
    col.innerHTML = `
      <img src="${match.src}" alt="${match.name}" style="width: 100%; border-radius: 12px;" />
      <h4>${match.name}</h4>
      <p>Similarity Score: ${match.distance.toFixed(2)}</p>
    `;
    results.appendChild(col);
  });
}

const uploadInput = document.getElementById("imageUpload");
const userImg = document.getElementById("user-image");

uploadInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const imgURL = URL.createObjectURL(file);
  userImg.src = imgURL;
  userImg.style.display = "block";
  await new Promise(res => userImg.onload = res);
  const matches = await findSimilarProducts(userImg);
  showResults(matches);
});

loadModel();
