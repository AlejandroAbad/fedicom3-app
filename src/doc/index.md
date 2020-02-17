
# Manual de explotación del concentrador Fedicom v3

## A. Tareas pendientes SAP
- A.1 - [Servicio de consulta de albaranes]($DOC$/pendiente-albaranes)
- A.2 - [Servicio de consulta de facturas]($DOC$/pendiente-facturas)
- A.3 - [Servicio de confirmación de recepción de albarán]($DOC$/pendiente-recepcion-albaran)


## B. Pruebas y pilotos





---
## **MANUALES DE SISTEMAS**
---
## 1. Infraestructura
- 1.1. [Despliegue de máquinas]($DOC$/infra-despliegue-maquinas)


## 2. MongoDB
- 2.1. [Esquema de MongoDB]($DOC$/mdb-esquema)
- 2.2. [Instalación y configuración de MongoDB 4.2]($DOC$/mdb-instalacion)
    - 2.2.1 [Actualización de MongoDB 4.0 a 4.2]($DOC$/mdb-actualizacion)
- 2.3. [Inicialización del ReplicaSet]($DOC$/mdb-replicaset-init)
- 2.4. [Creación de usuarios y roles en la BBDD]($DOC$/mdb-users)
- 2.4. [Índices de la BBDD]($DOC$/mdb-indices)



## 3. Ecosistema Fedicom v3
- 3.1 - [Preparativos para despleguar la aplicación]($DOC$/ecosistema)
- 3.2 - [Scripts y crontab]($DOC$/ecosistema-scripts)
- 3.3 - [Apache2]($DOC$/ecosistema-apache2)
    - 3.3.1 - [Balanceador para entrada de clientes]($DOC$/ecosistema-apache2-fw)
    - 3.4.2 - [Balanceador para salida hacia SAP]($DOC$/ecosistema-apache2-sap)



## 4. Despliegue Fedicom v3
- 4.1 - [Esquema de la aplicación]($DOC$/f3-esquema)
- 4.2 - [Despliegue de la aplicación]($DOC$/f3-despliegue)
    - 4.2.1 - [Configuración de la aplicación CORE]($DOC$/f3-config-core)
- 4.3 - [Arranque y parada]($DOC$/f3-arranque-parada)

---

## **MANUALES DE DESARROLLO**

---


## 5. Conceptos
- 5.1 - [El concepto de **Transmisión**]($DOC$/conceptos-transmision)
- 5.2 - [JWT: JSON Web Token]($DOC$/conceptos-jwt)
    - 5.2.1 - [Tokens permanentes]($DOC$/conceptos-jwt-permanentes)


## 6. Flujos de datos
- 6.1 - [Flujo de autenticacion]($DOC$/flujo-auth)
- 6.2 - [Flujo de entrada de pedidos]($DOC$/flujo-pedido)
    - 6.2.1 - [Transformaciones heredadas de Fedicom2 y Proyman]($DOC$/flujo-pedido-transformaciones-fedicom2)
    - 6.2.2 - [Transformaciones heredadas de Fedicom2 y Proyman para TRANSFERS]($DOC$/flujo-pedido-transformaciones-fedicom2-transfer)
    - 6.2.3 - [Conversión del centro de suministro]($DOC$/flujo-pedido-transformaciones-centro)
    - 6.2.4 - [Tratamiento de descuentos y bonificaciones en las posiciones del pedido]($DOC$/flujo-pedido-transformaciones-lineas)


## 7. Retransmisión de un pedido
- 7.1 - [Retransmisión de pedidos]($DOC$/retransmit)