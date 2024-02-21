const puppeteer = require('puppeteer');

async function buscarEnlaceYTituloYoutube(query) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}`);

    // Esperar a que se carguen los resultados de búsqueda
    await page.waitForSelector('div.g');

    // Obtener el enlace de YouTube y el título del primer resultado de búsqueda
    const datosYoutube = await page.evaluate(() => {
        const resultados = Array.from(document.querySelectorAll('div.g'));
        for (let i = 0; i < resultados.length; i++) {
            const enlace = resultados[i].querySelector('a[href^="https://www.youtube.com/watch"]');
            const titulo = resultados[i].querySelector('h3');
            if (enlace && titulo) {
                return {
                    enlace: enlace.href,
                    titulo: titulo.innerText
                };
            }
        }
        return null; // Si no se encuentra un enlace de YouTube, devuelve null
    });

    await browser.close();

    return datosYoutube;
}

// Términos de búsqueda
const terminosDeBusqueda = [
    'bmw video',
    'audi video',
    'mercedes benz video',
    'ford video',
    'seat video'
];

// Buscar y mostrar el enlace a YouTube para cada término de búsqueda
terminosDeBusqueda.forEach(async (termino) => {
    try {
        const datosYoutube = await buscarEnlaceYTituloYoutube(termino);
        if (datosYoutube) {
            console.log(`Enlace a YouTube para "${termino}":`);
            console.log(`Título: ${datosYoutube.titulo}`);
            console.log(`Enlace: ${datosYoutube.enlace}`);
        } else {
            console.log(`No se encontró ningún enlace a YouTube para "${termino}".`);
        }
    } catch (error) {
        console.error(`Error al buscar el enlace a YouTube para "${termino}":`, error);
    }
});
