var imagenes = document.getElementsByTagName("img");

// Iterar sobre cada imagen y mostrar su src en la consola
for (let i = 0; i < imagenes.length; i++) {
  console.log("Imagen " + (i + 1) + ": " + imagenes[i].src);
}
