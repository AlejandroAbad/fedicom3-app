# Pendiente: Confirmacion de recepción de albarán

Fedicom3 expone un servicio por el cual la farmacia puede informar de la recepción de un albarán. 
Para esto llamará enviando la información similar a la siguiente:

```
{
  "numeroAlbaran": "AB54545455",
  "fechaAlbaran": "02-12-2017",
  "lineas": [
    {
      "codigoArticulo": "84021545454574",
      "lote": "16L4534",
      "fechaCaducidad": "01-05-2017 00:00:00"
    },
    {
      "codigoArticulo": "84021888854577",
      "lote": "16R4534",
      "fechaCaducidad": "01-06-2017 00:00:00
    }
  ]
}
```

A esta llamada, se debe devolver el mismo contenido a modo de confirmación, pudiendo añadir incidencias en las líneas. 
Un ejemplo de respuesta con una incidencia sería:

```
{
  "numeroAlbaran": "AB54545455",
  "fechaAlbaran": "02-12-2017",
  "lineas": [
    {
      "codigoArticulo": "84021545454574",
      "lote": "16L4534",
      "fechaCaducidad": "01-05-2017 00:00:00"
    },
    {
      "codigoArticulo": "84021888854577",
      "lote": "16R4534",
      "fechaCaducidad": "01-06-2017 00:00:00",
      "incidencias": [
        {
          "codigo": "LIN-CONF-ERR-002",
          "descripcion": "El parámetro 'lote' es inválido"
        }
      ]
    }
  ]
}
```
