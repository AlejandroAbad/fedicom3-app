# Pendiente Facturas

Fedicom3 contempla que el propio programa de farmacia pueda consultar/descargar las facturas de manera standard para todas las distribuidoras y todos los programas de farmacias.
En concreto, define 2 llamadas: una para búsqueda de fecturas y otra para obtener información de una factura concreta.

Deben implementarse estos servicios en SAP para que puedan accederse vía Fedicom v3.

---
## Búsqueda de facturas

La búsqueda de facturas recibirá los siguientes parámetros a la entrada que especifican filtros de búsqueda:
* `codigoCliente` - **_(Filtro obligatorio)_** Filtra facturas por el código de cliente SAP indicado.
* `numeroFactura` - Filtrar facturas por número concreto de factura. _(Lo sé, no tiene sentido, pero ahí está el campo y hay que respetar)_
* `fechaFactura` - Filtrar facturas por una fecha concreta.
* `numeroPedido` - Filtrar facturas en base a un número concreto de pedido. (no es el número de pedido SAP, sino el que se le manda a la farmacia cuando realiza una transmisión de pedido que es el CRC)
* `numeroAlbaran` - Filtrar facturas en base a un número concreto de albarán.
* `fechaDesde` / `fechaHasta` - Filtrar facturas entre fechas.



Además, existen 2 parámetros que fuerzan la __paginación__ del servicio: `offset` y `limit`.

Estos permiten obtener los resultados de la búsqueda en porciones mas pequeñas para mostrar los resultados en páginas con un número `limit` de resultados por página,
sin que se tenga que retornar todos los resultados obtenidos.
_(Como p.e. la busqueda de Google, que muestra los resultados en bloques de aproximadamente 10 resultados a la vez)_

El parámetro `offset` indica cuantos resultados queremos saltarnos, o lo que es lo mismo, a partir de que resultado queremos que se nos devuelvan los datos.
> ¡¡ **OJO**: El `offset` empieza a contar desde **CERO** !! Si por ejemplo tenemos `offset = 0`, indica que saltamos 0 resultados y devolvemos a 
partir del primero inclusive, y `offset = 3` indica que nos saltamos 3 resultados y devolvemos a partir del cuarto inclusive.

La siguiente imagen muestra de forma gráfica cómo se espera que funcione la paginación para una búsqueda que por ejemplo ha devuelto un total de 24 resultados
según los valores de `limit` y `offset`:

![Ejemplos de paginación]($IMG$/paginacion.png)

Esta llamada espera que se devuelva una lista de facturas de la siguiente forma:

```
[
    {
        "codigoCliente":"4612547",
        "numeroFactura":"FA2019/0112",
        "fechaFactura":"22-08-2019"
    },
    {
        "codigoCliente":"4612547",
        "numeroFactura":"FA2019/0451",
        "fechaFactura":"14-10-2019"
    }
]
```

Y también se espera que aparezca una cabecera HTTP en la respuesta, llamada `X-Total-Count`, indicando el número total de facturas que cumplen el filtro, de modo que el cliente
sepa cual es el total de facturas a mostrar, al margen de que por la paginación no se le muestren todas.

Por ejemplo, si el cliente realiza la consulta de sus albaranes del año 2018, e imaginemos que el cliente tiene 245 facturas para dicho año.
La respuesta no devolverá directamente las 245 facturas ya que el parámetro `limit` actúa como tope; imaginemos que `limit = 50`, luego solo se le muestran
50 facturas al cliente. Para que el cliente sea consciente de que hay mas facturas de las que se le están mostrando, se indica la cabecera `X-Total-Count`, tal que:

> `X-Total-Count`: `245`

---
## Consulta de una factura

El otro servicio es la consulta de una factura en concreto.
En este caso, SAP recibe el número de la factura solicitada y el formato que se espera, que puede ser JSON, XML o PDF.
-> En el caso de PDF lo que se pretende es que la llamada devuelva el fichero PDF con la factura.
-> En el caso de XML lo que se pretende es que la llamada devuelva la factura en formato FacturaE versión 3.2.x con firma electrónica XAdES (Formato AEAT).
-> En el caso de JSON, se espera una estructura que viene detallada en el excel adjunto, y que a grandes rasgos tiene la siguiente forma:


```
{
    "códigoCliente": "4612547",
    "numeroFactura": "FA2019/0112",
    "fechaFactura": "22-08-2019",
    "fechaVencimiento": "30-08-2019",
    "codigoAlmacen": "RG08",
    "descripcionAlmacen": "Albacete",
    "albaranes": [
        {
            "numeroAlbaran": "A-17211",
            "fechaAlbaran": "16-09-2019",
            "importeBruto": 116.30
        }
    ],
    "totales": {
        "importeBruto": 539.13,
        "importeIva": 48.14,
        "importeRecargo": 7.50,
        "importeTotal": 594.77
    },
    "impuestos": [
        {
            "tipo": "IVA-SUPERREDUCIDO",
            "base": 232.69,
            "porcentaje": 4.00,
            "importe": 9.31,
            "porcentajeRecargo": 0.50,
            "importeRecargo": 1.16
        },
        {
            "tipo": "IVA-REDUCIDO",
            "base": 232.06,
            "porcentaje": 10.00,
            "importe": 23.21,
            "porcentajeRecargo": 1.40,
            "importeRecargo": 3.25
        },
        {
            "tipo": "IVA-GENERAL",
            "base": 74.38,
            "porcentaje": 21.00,
            "importe": 15.62,
            "porcentajeRecargo": 5.20,
            "importeRecargo": 3.09
        }
    ]
}
```
