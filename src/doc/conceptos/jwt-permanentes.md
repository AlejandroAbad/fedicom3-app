# Tokens permanentes

Existen casos especiales de pedidos para los que no es posible la autenticación normal de los usuarios.
En estos casos, los pedidos se realizan desde una aplicación específica, como por ejemplo, la APP del empleado o F+Online.

Estos tokens identifican el dominio de la aplicación y se expiden sin fecha de caducidad, por lo que todos los pedidos
de dichas aplicaciones vienen siempre con el mismo token.

A continuación listamos los tokens expedidos.

---
## Tokens de producción

**empleado** - Pedidos realizados desde la APP movil del empleado
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlbXBsZWFkbyIsImF1ZCI6ImVtcGxlYWRvIiwiZXhwIjo5OTk5OTk5OTk5OTk5LCJpYXQiOjF9.WxBkwOuoZVPZptTlX2XuXvx0i91su_Gn9vspfeBM9FY

{
  "sub": "empleado",
  "aud": "empleado",
  "exp": 9999999999999,
  "iat": 1
}
```

**f+online** - Pedidos realizados desde la web de F+Online
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJGK09ubGluZSIsImF1ZCI6IkZNQVMiLCJleHAiOjk5OTk5OTk5OTk5OTksImlhdCI6MX0.dveCc3yGrMw5IXT4QZ0Jti3UCgoImvXBY5miSJOCvYw

{
  "sub": "F+Online",
  "aud": "FMAS",
  "exp": 9999999999999,
  "iat": 1
}
```

**Portal Hefame** - Pedidos y devoluciones desde la web de Hefame
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJQT1JUQUxfSEVGQU1FIiwiYXVkIjoiUE9SVEFMX0hFRkFNRSIsImV4cCI6OTk5OTk5OTk5OTk5OSwiaWF0IjoxfQ.rnifYj8tkBdeUqhTFudTASuJwA_J3DLWkvFjXwLwJQw

{
  "sub": "PORTAL_HEFAME",
  "aud": "PORTAL_HEFAME",
  "exp": 9999999999999,
  "iat": 1
}
```

---
## Tokens de desarrollo

**empleado** - Pedidos realizados desde la APP movil del empleado.
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJBUElLRVlARkVESUNPTSIsInN1YiI6ImVtcGxlYWRvIiwiYXVkIjoiZW1wbGVhZG8iLCJleHAiOjk5OTk5OTk5OTk5OTksImlhdCI6MX0.OZrEbbGhN0YSwmiswRmRxBJ25LH2XLkv20_gu9TJ7W4

{
  "iss": "APIKEY@FEDICOM",
  "sub": "empleado",
  "aud": "empleado",
  "exp": 9999999999999,
  "iat": 1
}
```

**f+online** - Pedidos realizados desde la web de F+Online
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJGK09ubGluZSIsImF1ZCI6IkZNQVMiLCJleHAiOjk5OTk5OTk5OTk5OTksImlhdCI6MX0.b2uPztPp4eU4G1xIYQweFwsxColTSDq8v3fyI1c9XnA

{
  "sub": "F+Online",
  "aud": "FMAS",
  "exp": 9999999999999,
  "iat": 1
}
```

**Portal Hefame** - Pedidos y devoluciones desde la web de Hefame
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJQT1JUQUxfSEVGQU1FIiwiYXVkIjoiUE9SVEFMX0hFRkFNRSIsImV4cCI6OTk5OTk5OTk5OTk5OSwiaWF0IjoxfQ.9z0Nvduu9UU8cwtXYQNtlJzbyUiEaHxVEDvMdfH8GmM

{
  "sub": "PORTAL_HEFAME",
  "aud": "PORTAL_HEFAME",
  "exp": 9999999999999,
  "iat": 1
}
```

---
## Tokens para confirmación de pedidos por SAP

**P01**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJQMDEiLCJhdWQiOiJTQVBfQkciLCJleHAiOjk5OTk5OTk5OTk5OTksImlhdCI6MX0.BU3Wgd_lBQkrW6xBbfaTS1vvfa3gM-w4ukaM6voc-BU
```

**T01**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJBUElLRVlARkVESUNPTSIsInN1YiI6IlQwMSIsImF1ZCI6IlNBUF9CRyIsImV4cCI6OTk5OTk5OTk5OTk5OSwiaWF0IjoxLCJqdGkiOiI1ZDMxYWZjOTRhMTkwNzQyOGNiNTRlNDMifQ.rjIlFRHU13dM-qQay8mHCfd0xcnsu062jYJYPSHjvcM


```

**D01**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJBUElLRVlARkVESUNPTSIsInN1YiI6IkQwMSIsImF1ZCI6IlNBUF9CRyIsImV4cCI6OTk5OTk5OTk5OTk5OSwiaWF0IjoxLCJqdGkiOiI1ZDMxYWZjOTRhMTkwNzQyOGNiNTRlNDMifQ.UJHIhda7Zrg8KwEXvIU6sV4BteDK1vFeTB77-DpKx3Q
```