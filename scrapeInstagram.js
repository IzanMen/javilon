import puppeteer from 'puppeteer';
import { promises as fs } from 'fs';

async function scrapeInstagram(username) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Abre la página del perfil público
  await page.goto(`https://www.instagram.com/${username}/`);

  // Espera que las publicaciones se carguen
  await page.waitForSelector('article');

  // Extrae las publicaciones y las imágenes
  const posts = await page.evaluate(() => {
    let postDetails = [];
    let postElements = document.querySelectorAll('article a');
    
    postElements.forEach(post => {
      const postLink = post.href;
      
      // Obtener la imagen de cada publicación
      const imageElement = post.querySelector('img');
      const imageUrl = imageElement ? imageElement.src : null;

      // Guardar el enlace de la publicación y la imagen
      postDetails.push({
        link: postLink,
        image: imageUrl
      });
    });
    
    return postDetails;
  });

  await browser.close();
  
  // Guarda los enlaces de publicaciones y las imágenes en un archivo JSON
  await fs.writeFile('public/posts.json', JSON.stringify(posts, null, 2));

  console.log('Publicaciones e imágenes guardadas en "public/posts.json"');
}

// Llama a la función para obtener las publicaciones de un perfil público
scrapeInstagram('javilondj')
  .then(() => console.log('Scraping completado'))
  .catch(error => console.error('Error en el scraping: ', error));
