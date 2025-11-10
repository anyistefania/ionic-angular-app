import fs from "fs";
import path from "path";
import fetch from "node-fetch";

const baseDir = path.join(process.cwd(), "assets");

const structure = {
  ingredients: [
    "masa-tradicional","masa-delgada","masa-integral","masa-gruesa",
    "mozzarella","parmesano","queso-azul","cheddar",
    "salsa-tomate","salsa-bbq","salsa-blanca","pesto",
    "pepperoni","jamon","salchicha","carne-molida","pollo","tocino",
    "champinones","pimientos","cebolla","tomate","aceitunas",
    "jalapenos","pina","espinaca","oregano","ajo","albahaca"
  ],
  pizzas: [
    "margarita","pepperoni","hawaiana","cuatro-quesos",
    "carnivora","vegetariana","bbq-chicken","mexicana"
  ],
  drinks: [
    "coca-cola","coca-cola-1l","sprite","fanta",
    "agua","jugo-naranja","te-helado","cerveza"
  ]
};

async function downloadImage(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status} al descargar ${url}`);
  const buffer = await res.arrayBuffer();
  fs.writeFileSync(dest, Buffer.from(buffer));
}

async function generateAssets() {
  console.log("📦 Generando estructura de assets...");

  for (const [folder, files] of Object.entries(structure)) {
    const folderPath = path.join(baseDir, folder);
    fs.mkdirSync(folderPath, { recursive: true });

    for (const name of files) {
      const filePath = path.join(folderPath, `${name}.jpg`);
      // Picsum.photos garantiza 800x600 y conexión directa
      const url = `https://picsum.photos/seed/${encodeURIComponent(name)}/800/600`;
      console.log(`🖼️ Descargando ${name}.jpg desde ${url}`);
      await downloadImage(url, filePath);
    }
  }

  console.log("\n✅ ¡Assets generados exitosamente en carpeta 'assets/'!");
}

generateAssets().catch(err => console.error("❌ Error:", err));
