# Pendiente: Consulta de albaranes

Fedicom3 contempla que el propio programa de farmacia pueda consultar/descargar los albaranes de manera standard para todas las distribuidoras y todos los programas de farmacias.
En concreto, define 2 llamadas: una para búsqueda de albaranes y otra para obtener información de un albarán concreto.

Deben implementarse estos servicios en SAP para que puedan accederse vía Fedicom v3.

---
## Búsqueda de albaranes

La búsqueda de albaranes recibirá los siguientes parámetros a la entrada que especifican filtros de búsqueda:
* `codigoCliente` - **_(Filtro obligatorio)_** Filtra albaranes por el código de cliente SAP indicado.
* `numeroAlbaran` - Filtrar albaranes por un número concreto de albarán _(Así viene en el protocolo, aunque no tiene sentido hacer un filtro que solo va a resultar en 1 albarán habiendo un servicio de consulta de 1 albarán por su número)_
* `fechaAlbaran` - Filtrar albaranes por una fecha concreta.
* `numeroPedido` - Filtrar los albaranes que estén relacionados con un CRC concreto.
* `fechaDesde` / `fechaHasta` - Filtrar albaranes entre fechas.



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

Esta llamada espera que se devuelva una lista de albaranes de la siguiente forma:

```
[
    {
        "codigoCliente":"4612547",
        "numeroAlbaran":"AV2600054",
        "fechaAlbaran":"22/08/2016"
    },
    {
        "codigoCliente":"4612547",
        "numeroAlbaran":" AV2600055",
        "fechaAlbaran":"14/10/2016"
    }
]
```



Y también se espera que aparezca una cabecera HTTP en la respuesta, llamada `X-Total-Count`, indicando el número total de albaranes que cumplen el filtro, de modo que el cliente
sepa cuantos albaranes hay, al margen de que por la paginación no se le muestren todas.

Por ejemplo, si el cliente realiza la consulta de sus albaranes del año 2018, e imaginemos que el cliente tiene 245 albaranes para dicho año.
La respuesta no devolverá directamente los 245 albaranes ya que el parámetro `limit` actúa como tope; imaginemos que `limit = 50`, luego solo se le muestran
50 albaranes al cliente. Para que el cliente sea consciente de que hay mas albaranes de los que se le están mostrando, se indica la cabecera `X-Total-Count`, tal que:

> `X-Total-Count`: `245`

---
## Consulta de un albarán
El otro servicio relacionado con los albaranes es la consulta de un albarán concreto.

En este caso, SAP recibe el número del albarán solicitado y el formato que se espera, que puede ser JSON o PDF.
- En el caso de PDF lo que se pretende es que la llamada devuelva el fichero PDF con el albarán.
- En el caso de JSON, se espera una estructura que viene detallada en el protocolo - *sección 7.11* -, y que a grandes rasgos tiene la siguiente forma:

```
{
    "códigoCliente": "4612547",
    "numeroAlbaran": "AV2600054",
    "fechaAlbaran": "02/10/2016",
    "codigoAlmacen": "RG08",
    "descripcionAlmacen": "Albacete",
    "numeroFactura": "AV2600054",
    "fechaFactura": "11/05/2017",
    "reparto": "AV2600054",
    "operador": "AV2600054",
    "ruta": "AV2600054",
    "pedidos": [
        {
            "numeroPedido": "PV16120004",
            "tipoPedido": "001"
        }
    ],
    "lineas": [
        {
            "orden": 0,
            "codigoArticulo": "84021545454574",
            "pedido": {
                "numeroPedido": "PV16120004",
                "tipoPedido": "001",
                "aplazamiento": 30
            },
            "lotes": [
                {
                    "lote": "16L4534",
                    "fechaCaducidad": "01/05/2017 00:00:00"
                }
            ],
            "cantidadPedida": 1,
            "cantidadServida": 1,
            "precioPvp": 8.80,
            "precioPvf": 8.80,
            "precioPvl": 8.80,
            "precioNeto": 10.65,
            "precioAlbaran": 10.65,
            "impuesto": {
                "tipo": "IVA-GENERAL",
                "base": 8.80,
                "porcentaje": 21.00,
                "importe": 1.85,
                "porcentajeRecargo": 5.20,
                "importeRecargo": 0.46
            }
        }
    ],
    "totales": {
        "lineas": 1,
        "lineasServidas": 1,
        "cantidadPedida": 1,
        "cantidadServida": 1,
        "precioPvp": 8.80,
        "precioPvf": 8.80,
        "precioPvl": 8.80,
        "precioNeto": 10.65,
        "precioAlbaran": 10.65
    },
    "impuestos": [
        {
            "tipo": "IVA-GENERAL",
            "base": 8.80,
            "porcentaje": 21.00,
            "importe": 1.85,
            "porcentajeRecargo": 5.20,
            "importeRecargo": 0.46
        }
    ]
}
```