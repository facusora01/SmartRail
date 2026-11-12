# Smart Rail – Red WAN regional (TA048 Redes)

Índice del trabajo práctico y estado al 30/10/2026.

## Entregables

| Pieza | Dónde está | Notas |
| :---- | :---- | :---- |
| Enunciado | TP FINAL REDES.pdf (esta carpeta) | Pide una presentación de al menos 10 slides. |
| Borrador inicial | SmartRail\_Red\_WAN \- borrador inicial (16-10).pdf (esta carpeta) | Versión de mediados de octubre, sin talleres ni proveedores. |
| Presentación (16 slides) | [https\://claude.ai/artifact/KrenBAkAyYatUSXvUfcgnE](https://claude.ai/artifact/KrenBAkAyYatUSXvUfcgnE) | Se descarga como PowerPoint o PDF desde Compartir › Exportar. |
| Web interactiva: recorrido por paradas | [https\://claude.ai/artifact/Tqfz3P1DcKxAJ39bvfxhKA](https://claude.ai/artifact/Tqfz3P1DcKxAJ39bvfxhKA) | Página "Recorrido interactivo de la red". |
| Web interactiva: la red por dentro | misma dirección, página "La red por dentro" | Fig. 1 troncal animada, Fig. 2 estación, Fig. 3 Talleres Rosario. |
| Material de cátedra | carpeta REDES-VOLPI (clases 1 a 12\) | Fuente de los criterios técnicos. |

Importante: la presentación y la web son privadas hasta que se compartan desde su menú Compartir. Sin eso, los links no abren para el resto del grupo.

## Diseño en una línea

Estrella con el CCO de Retiro como núcleo y seis sedes: Retiro (CCO y data center), Campana, San Pedro, San Nicolás, Rosario (terminal) y Talleres Rosario. Enlace principal VPN MPLS (candidato Telecom) y respaldo por Internet con VPN IPSec y SD-WAN de otro operador (candidato Claro). Una VLAN por servicio (10 datos, 20 voz, 30 video, 40 OT, 99 gestión), OSPF por áreas y eBGP con los operadores. El CCO necesita unos 301 Mbps con margen (enlace comercial de 500 Mbps).

## Hecho

- Presentación de 16 slides que cubre todos los puntos del enunciado: descripción, justificación, objetivos, alcance, servicios, ancho de banda, tecnologías (nivel informativo), proveedores, topología física y lógica, direccionamiento y enrutamiento, equipamiento, seguridad perimetral, monitoreo (SNMP y NetFlow) y cierre.  
- Web interactiva con el recorrido por paradas y tres figuras animadas de la red.

## Para revisar

- Supuestos de tráfico: cantidades de cámaras, llamadas y datos por sede, y en especial los de Talleres Rosario (24 cámaras, 10 llamadas, unos 200 sensores).  
- Portada: completar integrantes, cátedra y fecha.  
- Numeración de las etiquetas de sección dentro de las slides.  
- Cómo se integra OSPF con el servicio MPLS del operador.  
- Agregados respecto del planteo original: VLAN 40 de OT y subestaciones.  
- Cobertura real de Telecom y Claro en Campana, San Pedro y San Nicolás.

## Falta hacer

- Actualizar el documento de análisis (el borrador de octubre) con los talleres, los proveedores y los 301 Mbps.