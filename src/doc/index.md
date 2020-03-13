
# Manual de explotación del concentrador Fedicom v3


# **Manuales de sistemas**

1. **Infraestructura**

    1. [Arquitectura de servidores]($DOC$/arquitectura/servidores)
    1. [Arquitectura de red]($DOC$/arquitectura/red)

---
2. **Despliegue de servidores**

    1. [Despliegue de un concentrador]($DOC$/despliegue/servidor-concentrador)
    1. [Despliegue de un balanceador]($DOC$/despliegue/servidor-balanceo)
---

3. **MongoDB**

    1. [Introducción a MongoDB]($DOC$/mdb/esquema)
    1. [Instalación y configuración de MongoDB 4.2]($DOC$/mdb/instalacion)
        1. [Actualización de MongoDB 4.0 a 4.2]($DOC$/mdb/actualizacion)
    1. [Inicialización del ReplicaSet]($DOC$/mdb/replicaset-init)
    1. [Creación de usuarios y roles en la BBDD]($DOC$/mdb/users)
    1. [Índices de la BBDD]($DOC$/mdb/indices)
---

4. **Balanceo de carga con Apache2**

    1. [Instalación y configuración de Apache2]($DOC$/apache2/instalacion)
        1. [Configuración como BALANCEADOR]($DOC$/apache2/balanceador)
        1. [Configuración como CONCENTRADOR]($DOC$/apache2/concentrador)
---

5. **Despliegue Aplicación Fedicom v3**
    1. [Esquema de la aplicación]($DOC$/f3/esquema)
    1. [Despliegue de la aplicación]($DOC$/f3/despliegue)
        1. [Configuración de la aplicación]($DOC$/f3/configuracion)
    1. [Arranque y parada]($DOC$/f3/arranque-parada)


# **Manual funcional**

6. **Conceptos básicos**
    1. [El concepto de **Transmisión**]($DOC$/conceptos/transmision)
    1. [JWT: JSON Web Token]($DOC$/conceptos/jwt)
        1. [Tokens permanentes]($DOC$/conceptos-jwt/permanentes)
---

7. **Flujos de datos**
    1. [Flujo de autenticacion]($DOC$/flujo/auth)
    1. [Flujo de entrada de pedidos]($DOC$/flujo/pedido)
        1. [Transformaciones heredadas de Fedicom2 y Proyman]($DOC$/flujo/pedido-transformaciones-fedicom2)
        1. [Transformaciones heredadas de Fedicom2 y Proyman para TRANSFERS]($DOC$/flujo/pedido-transformaciones-fedicom2-transfer)
        1. [Conversión del centro de suministro]($DOC$/flujo/pedido-transformaciones-centro)
        1. [Tratamiento de descuentos y bonificaciones en las posiciones del pedido]($DOC$/flujo/pedido-transformaciones-lineas)

---
8. **Retransmisión de un pedido**
    1. [Retransmisión de pedidos]($DOC$/retransmit)

---

## **APÉNDICES**

1. [Servicio de consulta de albaranes]($DOC$/pendiente/albaranes)
2. [Servicio de consulta de facturas]($DOC$/pendiente/facturas)
3. [Servicio de confirmación de recepción de albarán]($DOC$/pendiente/recepcion-albaran)
