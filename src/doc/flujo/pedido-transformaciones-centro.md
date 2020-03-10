# Transformaciones heredadas de Fedicom2 y Proyman

# Conver de centro

En fedi
```

if (this.codigoAlmacenServicio && this.codigoAlmacenServicio.trim) {
    this.codigoAlmacenServicio = this.codigoAlmacenServicio.trim();
			if (!this.codigoAlmacenServicio.startsWith('RG')) {
				var codigoFedicom2 = parseInt(this.codigoAlmacenServicio);
				switch (codigoFedicom2) {
					case 2: this.codigoAlmacenServicio = 'RG01'; break; // Santomera
					case 5: this.codigoAlmacenServicio = 'RG15'; break; // Barcelona viejo
					case 9: this.codigoAlmacenServicio = 'RG19'; break; // Málaga viejo
					case 13: this.codigoAlmacenServicio = 'RG04'; break; // Madrid viejo
					case 3: /* Cartagena */
					case 4: /* Madrid nuevo */
					case 6: /* Alicante */
					case 7: /* Almería */
					case 8: /* Albacete */
					case 10: /* Valencia */
					case 15: /* Barcelona */
					case 16: /* Tortosa */
					case 17: /* Melilla */
					case 18: /* Granada */
					case 19: /* Malaga nuevo */
						this.codigoAlmacenServicio = 'RG' + (codigoFedicom2 > 9 ? codigoFedicom2 : '0' + codigoFedicom2);
						break;
					default: 
						delete this.codigoAlmacenServicio; 
						this.addIncidencia('PED-WARN-999', 'No se reconoce el código de almacén indicado.');
						break; 
				}
			}
		}

```