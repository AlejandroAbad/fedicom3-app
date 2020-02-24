# Indices en MongoDB

```
db.tx.createIndex( {
    crc: 1
}, {
    name: "crc",
    partialFilterExpression: { type: 10, crc: {$exists: true} }
})
```


```
db.tx.createIndex( {
    createdAt: -1
}, {
    name: "_createdAt"
})



db.tx.createIndex( {
    type: 1
}, {
    name: "_type"
})


db.tx.createIndex( {
    status: 1
}, {
    name: "_status"
})


```


