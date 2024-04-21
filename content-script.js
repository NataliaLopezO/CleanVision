var imagenes = document.getElementsByTagName("img");

const API_KEY = "###"

async function getDef(image) {
  const response = await fetch('https://eastus.api.cognitive.microsoft.com/vision/v3.2/analyze?visualFeatures=Tags,Adult', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": `${API_KEY}`,
    },
    body: JSON.stringify({
      "url":image
    }),
  });

  return response;
}

// Iterar sobre cada imagen y mostrar su src en la consola
for (let i = 0; i < imagenes.length; i++) {

  //console.log("Imagen " + (i + 1) + ": " + imagenes[i].src);

  var src = imagenes[i].src;

  if (src.startsWith("http")) {
    // Llamar a la función aquí
    getDef(src)
      .then(response => {
        // Verificar si la respuesta fue exitosa (código de estado 200)
        if (response.ok) {
          // Convertir la respuesta a JSON
          return response.json();
        } else {
          // Si la respuesta no es exitosa, lanzar un error con el mensaje de la API
          throw new Error('Error en la solicitud: ' + response.statusText);
        }
      })
      .then(data => {
        // Manejar los datos obtenidos de la API para esta imagen
        console.log("Datos para la imagen " + (i + 1) + ": ", data);
        if(data.adult.isAdultContent || data.adult.isRacyContent || data.adult.isGoryContent){
          imagenes[i].src = "https://www.shutterstock.com/image-photo/cute-teddy-bear-isolated-on-260nw-2321681935.jpg"
          console.log(src)
        }

        
      })
      .catch(error => {
        // Manejar errores de la solicitud
        console.error("Error al obtener datos de la API de la imagen:" + (i + 1) + ": ", error);
      });
    
  }

}
