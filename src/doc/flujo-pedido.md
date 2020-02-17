# El flujo de **Creación de Pedidos**

Las transmisiones para la creación de pedidos son aquellas que van dirigidas a la URL `/pedidos` con el método `POST`.
El objetivo principal a la hora de tratar estas transmisiones es:
1. **Almacenar la información del pedido en el sistema**, de modo que pueda ser procesada en cualquier instante.
2. **Resolver y retornar las faltas**.

A continuación detallaremos el tratamiento que hacemos con el pedido.

---
## **1.** Recepción de la transmisión
Como va a ser habitual para todas las transmisiones, cuando esta se recibe se le asignarán las propiedades básicas
como un ID de transmisión, y los datos de la petición HTTP, y se almacenará en la base de datos con el tipo establecido a
`CREAR_PEDIDO` y el estado de `RECEPCIONADA`.

A continuación, se verifica que el contenido de la transmisión sea válido. 
