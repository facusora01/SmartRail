# Smart Rail – Recorrido de la red

Artefacto interactivo (3 pantallas: Recorrido por paradas, La red por dentro, Simulación a escala del mapa): [https\://claude.ai/artifact/Tqfz3P1DcKxAJ39bvfxhKA](https://claude.ai/artifact/Tqfz3P1DcKxAJ39bvfxhKA)

## Cambios en "Simulación a escala del mapa" (30/10/2026)

### Mapa

- Zoom de hasta unas 14 veces y posibilidad de alejar más allá de la vista completa.  
- Se puede arrastrar el mapa en cualquier nivel de zoom.  
- Zoom con dos dedos (pellizcar) en el celular.

### Leyenda "Carriles de la fibra"

- Ahora es un botón que se despliega y se oculta; arranca cerrado para no tapar el mapa.

### Simulación de cortes de fibra

- El respaldo ya no corre a lo largo de la vía: cada sede afectada sale por su propio acceso a Internet (otro operador, candidato Claro) hacia una nube esquemática de Internet y de ahí a Retiro, con VPN IPSec.  
- La fibra queda apagada desde el punto exacto del corte hasta el final de la línea, con el km indicado.  
- Botón "Cortar en el mapa": se puede cortar en cualquier punto de la vía, incluido el ramal a Talleres. Las sedes afectadas dependen de dónde cae el corte.  
- Fase de detección (ralentizada a unos 3 s): las sedes afectadas quedan en rojo y sin tráfico hasta que SD-WAN conmuta al respaldo.  
- Panel "Qué está pasando": línea de tiempo del corte (0 s, ≈50 ms, 1 a 3 s, después), sedes afectadas y no afectadas, km de fibra sin señal, tráfico desviado a Internet y RTT antes y después.

### Ejemplos de resultado según el punto de corte

- Km \~38 (Retiro–Campana): 5 de 5 sedes por Internet.  
- Km \~122 (Campana–San Pedro): 4 sedes por Internet; Campana sigue por fibra.  
- Km \~202 (San Pedro–San Nicolás): 3 sedes por Internet.  
- Km \~269 (San Nicolás–Rosario): 2 sedes por Internet (Rosario y Talleres).  
- Ramal a Talleres: solo Talleres Rosario por Internet.