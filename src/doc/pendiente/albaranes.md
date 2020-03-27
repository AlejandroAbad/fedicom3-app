Fedicom3 contempla que el propio programa de farmacia pueda consultar/descargar los albaranes de manera standard para todas las distribuidoras y todos los programas de farmacias.
En concreto, define 2 llamadas que deben implementarse en SAP:
- Una para búsqueda de albaranes (búsqueda de albaranes farma)
- Obtener información de un albarán concreto en formato JSON y formato PDF.

---
# Búsqueda de albaranes

La búsqueda de albaranes recibirá los siguientes parámetros a la entrada que especifican filtros de búsqueda:
* `codigoCliente` - **_(Filtro obligatorio)_** Filtra albaranes por el código de cliente SAP indicado.
* `numeroAlbaran` - Filtrar albaranes por un número concreto de albarán _(Así viene en el protocolo, aunque no tiene sentido hacer un filtro que solo va a resultar en 1 albarán habiendo un servicio de consulta de 1 albarán por su número)_
* `fechaAlbaran` - Filtrar albaranes por una fecha concreta.
* `numeroPedido` - Filtrar los albaranes que estén relacionados **con un CRC concreto**.
* `fechaDesde` / `fechaHasta` - Filtrar albaranes entre fechas.


Además, existen 2 parámetros que fuerzan la __paginación__ del servicio: `offset` y `limit`.

Estos permiten obtener los resultados de la búsqueda en porciones mas pequeñas para mostrar los resultados en páginas con un número `limit` de resultados por página, sin que se tenga que retornar todos los resultados obtenidos *(Como p.e. la busqueda de Google, que muestra los resultados en bloques de aproximadamente 10 resultados a la vez)*

El parámetro `offset` indica cuantos resultados queremos saltarnos, o lo que es lo mismo, a partir de que resultado queremos que se nos devuelvan los datos.
> ¡¡ **OJO**: El `offset` empieza a contar desde **CERO** !! Si por ejemplo tenemos `offset = 0`, indica que saltamos 0 resultados y devolvemos a 
partir del primero inclusive, y `offset = 3` indica que nos saltamos 3 resultados y devolvemos a partir del cuarto inclusive.

La siguiente imagen muestra de forma gráfica cómo se espera que funcione la paginación para una búsqueda que por ejemplo ha devuelto un total de 24 resultados
según los valores de `limit` y `offset`:

![Ejemplos de paginación](img/paginacion.png)

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



Y también se espera que se indique el número total de albaranes que cumplen el filtro, de modo que el cliente sepa cuantos albaranes hay, al margen de que por la paginación no se le muestren todas.

Por ejemplo, si el cliente realiza la consulta de sus albaranes de enero/2019, e imaginemos que el cliente tiene 245 albaranes para dicho mes.
La respuesta no devolverá directamente los 245 albaranes ya que el parámetro `limit` actúa como tope; imaginemos que `limit = 50`, luego solo se le muestran los
50 primeros albaranes al cliente. Para que el cliente sea consciente de que hay mas albaranes de los que se le están mostrando, se indica en la respuesta una cabecera con dicho total.


---
# Consulta de un albarán
El otro servicio relacionado con los albaranes es la consulta de un albarán concreto.

En este caso, SAP recibe el número del albarán solicitado y el formato que se espera, que puede ser JSON o PDF.
- En el caso de PDF lo que se pretende es que la llamada devuelva el fichero PDF con el albarán.
- En el caso de JSON, se espera una estructura que viene detallada en el protocolo - *sección 7.11* -, y que a grandes rasgos tiene la siguiente forma:

```
{
    "codigoCliente":        "0010104999"
    "numeroAlbaran":        "0145791679"
    "fechaAlbaran":         "23/03/2020"
    "numeroFactura":        "<opcional>"
    "fechaFactura":         "<opcional>"
    "codigoAlmacen":        "RG06"
    "descripcionAlmacen":   "ALICANTE"
    "reparto":              "3045944556"   // Orden de entrega
    "operador":             "FED3"         // CONC, OPER ...
    "ruta":                 "STA.POLA"
    "pedidos": [                           // Datos del pedido SAP
        {
            "numeroPedido": "2045162741"
            "tipoPedido": "KF FAMILIA"
            "aplazamiento": "<Días en los que se aplaza el cargo del pedido>"
            "canal": "<Canal de entrada del pedido>"
        }
    ]
    "lineas":[
        {
            "orden":                1
            "codigoArticulo":       "661145"
            "descripcionArticulo":  "HUMALOG KWIKPEN 100 U / ML 5 PLUMAS 3 ML"
            "cantidadPedida":       1
            "cantidadServida":      1
            "cantidadBonificada":   0
            "precioPvp":            46.97
            "precioNeto":           30.44
            "precioAlbaran":        32.56   // PVA/PVL/PVF
            "impuesto":{
                "tipo":                 "IVA - SUPERREDUCIDO"
                "base":                 30.44
                "porcentaje":           4
                "importe":              1.22
                "porcentajeRecargo":    0.5
                "importeRecargo":       0.16
            }
            "descuento": {                              // Si aplica
                "tipo": "Descuento laboratorio",        // PLANG/Espec. Financiada/Espec. RD 5/00/Genericos ...
                "descripción": "Descuento laboratorio",
                "porcentaje": 6.51
                "importe": 2.13
            }
            "cargo": {                                  // Si aplica
                "tipo": "Cargo transporte",
                "descripción": "",
                "porcentaje": 6.51
                "importe": 2.13
            }
        },
        {
            // Mas lineas ...
        }
    ],
    "totales": {            // Totales de todo el albarán
        "lineas": 23
        "cantidadPedida": 33
        "cantidadServida": 1
        "cantidadBonificada": 0
        "precioPvp": 0
        "precioNeto": 17.13
        "precioAlbaran": 19.03
        "impuestos": [          
            {
                "tipo": "IVA - SUPERREDUCIDO"
                "porcentaje": 4
                "base": 17.13
                "importe": 0.69
                "porcentajeRecargo": 0.5
                "importeRecargo": 0.09
            },
            {
                "tipo": "IVA - NORMAL"
                "base": 21
                ... // etc ...
            }
        ]
    }
}
```