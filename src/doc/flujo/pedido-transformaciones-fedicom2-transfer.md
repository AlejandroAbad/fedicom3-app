# Transformaciones heredadas de Fedicom2 y Proyman para TRANSFERS


A continuación se detallan las transformaciones que SAP realizan sobre los pedidos TRASNFER antes de llamar a las BAPIs de pedidos.
Estas transformaciones vienen heredadas de Fedicom2 y Proyman, y se mantienen para permitir que las transmisiones puedan
traducirse directamente de Fedicom2 a Fedicom3.

> **IMPORTANTE**: Estas transformaciones solo se aplican en los casos de que los pedidos sean transmitidos por programa de farmacia. Es decir, el dominio de autenticación del usuario es `transfer_laboratorio`.



#### **ENTRADA**
La entrada es la trama FEDICOM3 que entra a SAP. En concreto, de esta trama los campo a tener en cuenta son:
 
- <span style="background: #ccccff">&nbsp;codigoCliente&nbsp;</span> - A.K.A. el código de cliente Fedicom.
- <span style="background: #ccccff">&nbsp;tipoPedido&nbsp;</span> - El tipo de pedido que transmite el laboratorio.
- <span style="background: #ccccff">&nbsp;aplazamiento&nbsp;</span> - El aplazamiento de cargo en días que indica el laboratorio.
- <span style="background: #ccccff">&nbsp;codigoLaboratorio&nbsp;</span> - El código de laboratorio que transmite. Este código viene de las formas `TRXXXXXXXX`, `TGXXXXXXXX` o `TPXXXXXXXX`, aunque en la actualidad solo hay laboratorios que empiezan por `TR`.
    

#### **SALIDA**
Cuando hablamos de la salida, nos estamos refiriendo a los valores con los que hay que llamar a las BAPIs.
En concreto, las transformaciones realizadas pueden producir cambios sobre los siguientes campos:

- `BAPI` &raquo; <span style="background: #ffffcc">&nbsp;TIPO_PEDIDO&nbsp;</span>
- `BAPI` &raquo; <span style="background: #ffffcc">&nbsp;ORG_VENTAS&nbsp;</span>
- `BAPI` &raquo; <span style="background: #ffffcc">&nbsp;MOTIVO_PEDIDO&nbsp;</span>
- `BAPI` &raquo; `INTERLOCUTORES` &raquo; \[ROL=__AG__, CODE=<span style="background: #ffffcc">&nbsp;CLIENTE_SAP&nbsp;</span>\]
- `BAPI` &raquo; `INTERLOCUTORES` &raquo; \[ROL=__ZP__, CODE=<span style="background: #ffffcc">&nbsp;COD_LABORATORIO&nbsp;</span>\]



<br>
<br>

## **TRANSFORMACIONES**

---

### **PASO 1**. TRANSFORMACION INICIAL DEL TIPO DE PEDIDO

Vamos a transformar el <span style="background: #ccccff">&nbsp;tipoPedido&nbsp;</span> que viene a la entrada.
> **NOTA**: Para que el manual quede más visual, cuando aparezca el carácter `_` nos referimos a un carácter de espacio. Por ejemplo, `123___` se refiere a la cadena `123` seguida de 3 espacios.

Primero, sanearemos el <span style="background: #ccccff">&nbsp;tipoPedido&nbsp;</span> para que sea de 6 caracteres, ya que por Fedicom3 pueden venir mas o menos de 6.
- Si <span style="background: #ccccff">&nbsp;tipoPedido&nbsp;</span> tiene más de 6 caracteres, lo cortamos para quedarnos con los 6 primeros.
- Si <span style="background: #ccccff">&nbsp;tipoPedido&nbsp;</span> tiene menos de 6 caracteres, rellenamos con espacios por la derecha hasta que sea de 6 caracteres.

<br><br>
A continuación, sustituiremos el valor de <span style="background: #ccccff">&nbsp;tipoPedido&nbsp;</span> en función de:

- Si <span style="background: #ccccff">&nbsp;tipoPedido&nbsp;</span> es de la forma:
    - `XXX030` *(Estos son los denominados pedidos APO)*
    - `XXX047` *(Estos son los denominados pedidos BOTIQUÍN. Aparecen a partir de Fedicom v2)*
    - `054211` *(Estos son los denominados pedidos URGENTES. Aparecen a partir de Fedicom v2)*
    - `XXX___` *(3 espacios al final)*

    > En cualquiera de estos casos, no se modifica <span style="background: #ccccff">&nbsp;tipoPedido&nbsp;</span>.


- Si el <span style="background: #ccccff">&nbsp;tipoPedido&nbsp;</span> es de la forma `XXX000`:
    > <span style="background: #ccccff">&nbsp;tipoPedido&nbsp;</span> se transforma a la forma `XXX___`

    *Es decir, se cambian los 3 ceros del final por espacios. Ejemplos:* <code>123000 &raquo; 123\_\_\_</code> , <code>000000 &raquo; 000\_\_\_</code> o <code>099000 &raquo; 099\_\_\_</code>
    

- Si el <span style="background: #ccccff">&nbsp;tipoPedido&nbsp;</span> no coincide con nada de lo anterior. Digamos que es de la forma `XXXZZZ`:
    > <span style="background: #ccccff">&nbsp;tipoPedido&nbsp;</span> se transforma a `ZZZ___`

    *Es decir, se pasan los 3 últimos dígitos seguidos de 3 espacios. Este cambio parece que viene porque UNYCOPWIN trasmite los tipos alineados a la derecha con ceros a la izquierda.
    Ejemplos de este caso:* <code>000091 &raquo; 091\_\_\_</code> , <code>123456 &raquo; 456\_\_\_</code> o <code>\_\_\_\_99   &raquo; \_99\_\_\_</code>


<br><br>
> En adelante, haremos referencia a 2 nuevas variables:
- <span style="background: #ccffcc">&nbsp;TIPO_PEDIDO_TMP&nbsp;</span> = (los 3 primeros dígitos de <span style="background: #ccccff">&nbsp;tipoPedido&nbsp;</span>)
- <span style="background: #ccffcc">&nbsp;APO_TMP&nbsp;</span> = (los 3 últimos dígitos de <span style="background: #ccccff">&nbsp;tipoPedido&nbsp;</span>)

<br><br>


### **PASO 2**. DETERMINAR LABORATORIO, CLIENTE SAP Y VKORG


- Si <span style="background: #ccccff">&nbsp;codigoCliente&nbsp;</span> es de la forma `XXXXXZZZZZ`, donde `XXXXX != 00000`, entonces:
    - <span style="background: #ffffcc">&nbsp;CLIENTE_SAP&nbsp;</span> = <span style="background: #ccccff">&nbsp;codigoCliente&nbsp;</span>
    - <span style="background: #ffffcc">&nbsp;ORG_VENTAS&nbsp;</span> = Determinar en función de `XXXXX`

<br>

- De lo contrario, buscar en la __YVCONC01__ por <span style="background: #ccccff">&nbsp;codigoCliente&nbsp;</span> y <span style="background: #ccffcc">&nbsp;TIPO_PEDIDO_TMP&nbsp;</span>:
    - Si se encuentra resultado en la tabla, entonces:
        > - <span style="background: #ffffcc">&nbsp;CLIENTE_SAP&nbsp;</span> = El que indique la tabla en el campo `KUNNR`
        > - <span style="background: #ffffcc">&nbsp;ORG_VENTAS&nbsp;</span> = El que indique la tabla en el campo `VKORG`
    -   Si no se encuentra ningún resultado, se vuelve a buscar en la __YVCONC01__ por <span style="background: #ccccff">&nbsp;codigoCliente&nbsp;</span> y `COD_PED = 000`. En caso de encontrar un resultado:
        > - <span style="background: #ffffcc">&nbsp;CLIENTE_SAP&nbsp;</span> = El que indique la tabla en el campo `KUNNR`
        > - <span style="background: #ffffcc">&nbsp;ORG_VENTAS&nbsp;</span> = El que indique la tabla en el campo `VKORG`    
    -   Si no se encuentra ningún resultado:
        > Se retorna error indicando que el cliente no existe. *Originalmente, se establecía el cliente de pruebas `0010108000` para que devolviera faltas pero no se grabara el pedido.
        Esto era para que Fedicom2 no se quejara al no obtener faltas.*


![Muestra de la YVCONC01](/img/yvconc01.png)

<br>


> El <span style="background: #ffffcc">&nbsp;COD_LABORATORIO&nbsp;</span> que tenemos que incluir en la tabla de INTERLOCUTORES de la BAPI es el resultado de eliminar
los dos primeros caracteres del <span style="background: #ccccff">&nbsp;codigoLaboratorio&nbsp;</span>. *Es decir, eliminamos el prefijo `TR`, `TG` o `TP`. Ejemplos: 
<code>TR60200118 &raquo; 60200118</code>, <code>TG60201230 &raquo; 60201230</code>, etc...*


<br><br>

## **PASO 3**. CAMBIO DEL TIPO DE PEDIDO

Solamente, **si NO se especifica el <span style="background: #ccffcc">&nbsp;TIPO_PEDIDO_TMP&nbsp;</span>**, se hace lo siguiente:

- Si <span style="background: #ccccff">&nbsp;codigoLaboratorio&nbsp;</span> comienza por `TR`, entonces:
    - Si se indica <span style="background: #ccccff">&nbsp;aplazamiento&nbsp;</span> mayor que cero:
        > <span style="background: #ccffcc">&nbsp;TIPO_PEDIDO_TMP&nbsp;</span> = `043`
    - de lo contrario:
        > <span style="background: #ccffcc">&nbsp;TIPO_PEDIDO_TMP&nbsp;</span> = `041`
- Si <span style="background: #ccccff">&nbsp;codigoLaboratorio&nbsp;</span> comienza por `TG`, entonces:
    - Si se indica <span style="background: #ccccff">&nbsp;aplazamiento&nbsp;</span> mayor que cero:
        > -<span style="background: #ccffcc">&nbsp;TIPO_PEDIDO_TMP&nbsp;</span> = `049`
    - de lo contrario:
        > -<span style="background: #ccffcc">&nbsp;TIPO_PEDIDO_TMP&nbsp;</span> = `047`


Establecemos que el <span style="background: #ffffcc">&nbsp;TIPO_PEDIDO&nbsp;</span> a la entrada de la BAPI será el resultado de concatenar `000` y <span style="background: #ccffcc">&nbsp;TIPO_PEDIDO_TMP&nbsp;</span>.

<br><br>

## **PASO 4**. DETERMINAR MOTIVO DE PEDIDO

- Si <span style="background: #ccffcc">&nbsp;APO_TMP&nbsp;</span> es `030`, entonces:
    ><span style="background: #ffffcc">&nbsp;MOTIVO_PEDIDO&nbsp;</span> = `330`

<br>

- Si <span style="background: #ccffcc">&nbsp;APO_TMP&nbsp;</span> es `047`, entonces:
    > <span style="background: #ffffcc">&nbsp;MOTIVO_PEDIDO&nbsp;</span> = `313`

<br>

- Si <span style="background: #ccffcc">&nbsp;APO_TMP&nbsp;</span> es cualquier otra cosa, entonces:
    > <span style="background: #ffffcc">&nbsp;MOTIVO_PEDIDO&nbsp;</span> = <span style="background: #ccffcc">&nbsp;APO_TMP&nbsp;</span>

<br>

**Nota:** *Si <span style="background: #ccffcc">&nbsp;APO_TMP&nbsp;</span> no es ni `030` ni `047`, por la transformación del tipo que se hace en el PASO 1, este valor solo puede estar vacío `___` o ser `211`.*

<br>

Finalmente, buscamos en la __YVCONC04__ a ver si hay alguna entrada que coincida con el <span style="background: #ccccff">&nbsp;tipoPedido&nbsp;</span>. En caso afirmativo:

- <span style="background: #ffffcc">&nbsp;MOTIVO_PEDIDO&nbsp;</span> = El valor del campo `AUGRU` en la tabla.
- <span style="background: #ffffcc">&nbsp;TIPO_PEDIDO&nbsp;</span> se fuerza a `000000`


![Muestra de la YVCONC04](/img/yvconc04.png)