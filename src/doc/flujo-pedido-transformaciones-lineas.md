# Tratamiento de descuentos y bonificaciones en posiciones

## En los pedidos del dominio FEDICOM

```
Sea 'D' el descuento indicado para la línea.
Sea 'N' el siguiente número de posición que corresponda a esta línea.

CASO 3+0:

	LINEA 1:	POSICION: N
				POSICION_SUPERIOR: 000000
				CANTIDAD: 3
				DESCUENTO: 0
				
CASO 3+1:

	LINEA 1:	POSICION: N
				POSICION_SUPERIOR: 000000
				CANTIDAD: 3
				DESCUENTO: 0

	* No se incluye la unidad bonificada *

				
CASO 0+1:

	* No se incluye la unidad bonificada *

```

**Puntos a tener en cuenta:**
- En el caso de que el pedido NO sea transfer, el descuento de línea que pudiera indicar se ignora y se establece siempre a 0.
- Las unidades bonificadas NO se pasan a la BAPI


---
## En los pedidos del dominio TRANSFER

```
Sea 'D' el descuento indicado para la línea.
Sea 'N' el siguiente número de posición que corresponda a esta línea.

CASO 3+0:

	LINEA 1:	POSICION: N
				POSICION_SUPERIOR: 000000
				CANTIDAD: 3
				DESCUENTO: D
				
CASO 3+1:

	LINEA 1:	POSICION: N
				POSICION_SUPERIOR: 000000
				CANTIDAD: 3
				DESCUENTO: D
				
	LINEA 2:	POSICION: N+10
				POSICION_SUPERIOR: N
				CANTIDAD: 1
				DESCUENTO: 0
				
CASO 0+1:

	LINEA 1:	POSICION: N
				POSICION_SUPERIOR: 000000
				CANTIDAD: 1
				DESCUENTO: 0
				TIPO_POSICION: ZFB2
```

**Puntos a tener en cuenta:**
- Cuando solo vienen unidades bonificadas en la línea, se incluyen como una posición normal, pero se indica `TIPO_POSICION`: `ZFB2`.