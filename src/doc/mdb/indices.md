# Indices en MongoDB

```
db.tx.createIndex( {
    crc: 1
}, {
    name: "crc",
    partialFilterExpression: { crc: {$exists: true} }
})
```

```
db.tx.createIndex( {
    createdAt: -1
}, {
    name: "createdAt"
})
```

```
db.tx.createIndex( {
    type: 1
}, {
    name: "type"
})
```

```
db.tx.createIndex( {
    status: 1
}, {
    name: "status"
})
```

```
db.tx.createIndex( {
    "clientRequest.body.lineas.codigoArticulo": 1
}, {
    name: "codigoArticulo",
    partialFilterExpression: { type: 10 }
})
```


```
db.tx.createIndex( {
    "flags.$**": 1
}, {
    name: "flags"
})
```