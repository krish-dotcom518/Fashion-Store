let model;
const products = [
  { name: 'Avante Tshirt', src: 'images/products/tshirt1.jpg' },
  { name: 'Max bagpack', src: 'images/products/bag7.jpg' },
  { name: 'volkso dress', src: 'images/products/dress2.jpg' },
  { name: 'magisho fur dress', src: 'images/products/dress 3.jpg' },
  { name: 'Jordan Air-2', src: 'images/products/jordan.jpg' },
  { name: 'Chanel Perfume', src: 'images/products/chanel.jpg' },
  { name: 'Gabbana Perfume', src: 'images/products/gabbana.jpg' },
  { name: 'Puma Tshirt', src: 'images/products/tshirt6.jpg' },
];

async function loadModel() {
  model = await mobilenet.load();
  console.log("✅ MobileNet loaded");
}

async function getImageFeatures(img) {
  const tensor = tf.browser.fromPixels(img).toFloat().expandDims();
  return model.infer(tensor, true);
}

async function findSimilarProducts(userImg) {
  const userFeature = await getImageFeatures(userImg);

  const matches = await Promise.all(products.map(async (p) => {
    const img = new Image();
    img.src = p.src;
    await new Promise((res) => (img.onload = res));
    const feature = await getImageFeatures(img);
    const distance = tf.norm(tf.sub(userFeature, feature)).dataSync()[0];
    return { ...p, distance };
  }));

  return matches.sort((a, b) => a.distance - b.distance).slice(0, 4);
}

function showResults(matches) {
  const results = document.getElementById("results");
  results.innerHTML = "";
  matches.forEach((match) => {
    const col = document.createElement("div");
    col.className = "column";
    col.innerHTML = `
      <img src="${match.src}" alt="${match.name}" />
      <h4>${match.name}</h4>
      <p>Similar Score: ${match.distance.toFixed(2)}</p>
    `;
    results.appendChild(col);
  });
}

document.getElementById("upload").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const imgURL = URL.createObjectURL(file);
  const userImg = document.getElementById("user-image");
  userImg.src = imgURL;
  userImg.hidden = false;

  await new Promise((resolve) => (userImg.onload = resolve));
  const matches = await findSimilarProducts(userImg);
  showResults(matches);
});

loadModel();
