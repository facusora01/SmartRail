# Smart Rail – Secciones 8.2, 8.3 y 8.5.3 (Facu)

Topología lógica, direccionamiento y enrutamiento, y LAN de las sedes menores (Campana, San Pedro y San Nicolás). Texto listo para pasar al documento del grupo. La simulación 4 de la web muestra lo mismo de forma interactiva.

---

## 8.2 Topología lógica

### VLAN por sede

Cada sede usa las mismas seis VLAN. Las sedes que reciben pasos a nivel por fibra suman la VLAN 41, de tránsito entre el switch de agregación OT y el firewall.

| VLAN | Uso | Prioridad | DSCP | Cola en la salida WAN |
| :-- | :-- | :-- | :-- | :-- |
| 10 | Datos IT (venta de pasajes, ERP, correo) | Media | AF21 (18) | Ponderada, 20 % |
| 20 | Voz (VoIP de despacho y administrativa) | Alta | EF (46); señalización CS3 (24) | Estricta nivel 2, tope 10 % |
| 30 | Video CCTV | Media | AF41 (34) clips de evento; AF42 (36) video en vivo | Ponderada, 35 % |
| 40 | Datos OT de la estación (señalización, sensores, SCADA) | Crítica | CS5 (40) | Estricta nivel 1, tope 20 % |
| 41 | Tránsito OT-PaN al firewall (solo sedes con pasos a nivel) | Crítica | CS5 (40) | Misma cola que la VLAN 40 |
| 50 | Wi-Fi e Internet | Best effort | DF (0) | No usa la WAN: sale por el Internet local |
| 99 | Gestión de equipos (SNMP, NetFlow, syslog) | Media | CS2 (16) | Ponderada, mínimo garantizado 5 % |
| — | Control de red (OSPF, BGP, IKE) | — | CS6 (48) | Ponderada, 5 % |

### QoS

El orden de prioridad es OT, después voz, después video y datos IT, y al final Internet.

- El FortiGate de cada sede marca el DSCP según la VLAN de entrada. Los teléfonos IP ya marcan su tráfico como EF y el switch de acceso confía en esa marca solo en los puertos de teléfono.
- En la salida WAN, OT y voz van en prioridad estricta, con OT por delante. Entre las dos reservan el 30 % del enlace, por debajo del tope habitual del 33 %, para que el resto de las colas no se quede sin servicio. En Campana, por ejemplo, el OT con sus 6 pasos a nivel ronda los 5,6 Mbps y la voz 0,7 Mbps, muy por debajo de los 10 y 5 Mbps reservados sobre 50 Mbps.
- Video y datos IT comparten el siguiente nivel con colas ponderadas. Si el enlace se llena, se recortan ellos y no OT ni voz.
- Gestión queda en prioridad **Media**, no Alta: la prioridad estricta se reserva para OT y voz. Como es poco tráfico pero no se puede perder en una congestión, tiene un mínimo garantizado del 5 %. Esto corrige la Tabla 7.2 anterior, que la ponía en Alta y no coincidía con la Tabla 4.2.
- En el respaldo IPSec viaja solo lo crítico: OT, voz, datos IT, gestión y los clips de evento (AF41). El video en vivo (AF42) se corta y sigue grabando en el NVR local.

---

## 8.3 Direccionamiento y enrutamiento

### Regla de direccionamiento

Cada sede tiene un número S y cada VLAN un número V. La subred es `10.S.V.0/24` y el gateway es la dirección `.1` en el FortiGate. Así toda la sede entra en un solo resumen `10.S.0.0/16`.

| Sede | S | Área OSPF | Resumen | VLAN 10 | VLAN 20 | VLAN 30 | VLAN 40 | VLAN 50 | VLAN 99 |
| :-- | :-: | :-: | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| Retiro (CCO) | 10 | 0 | 10.10.0.0/16 | 10.10.10.0/24 | 10.10.20.0/24 | 10.10.30.0/24 | 10.10.40.0/24 | 10.10.50.0/24 | 10.10.99.0/24 |
| Campana | 20 | 1 | 10.20.0.0/16 | 10.20.10.0/24 | 10.20.20.0/24 | 10.20.30.0/24 | 10.20.40.0/24 | 10.20.50.0/24 | 10.20.99.0/24 |
| San Pedro | 30 | 2 | 10.30.0.0/16 | 10.30.10.0/24 | 10.30.20.0/24 | 10.30.30.0/24 | 10.30.40.0/24 | 10.30.50.0/24 | 10.30.99.0/24 |
| San Nicolás | 40 | 3 | 10.40.0.0/16 | 10.40.10.0/24 | 10.40.20.0/24 | 10.40.30.0/24 | 10.40.40.0/24 | 10.40.50.0/24 | 10.40.99.0/24 |
| Rosario | 50 | 4 (5 Talleres) | 10.50.0.0/16 | 10.50.10.0/24 | 10.50.20.0/24 | 10.50.30.0/24 | 10.50.40–49.0/24 | 10.50.50.0/24 | 10.50.99.0/24 |

Cada /24 deja 253 direcciones útiles. La sede más grande, Retiro, tiene 160 teléfonos, así que la regla alcanza en todas.

### Pasos a nivel

Los pasos a nivel usan `10.60.0.0/16`, separado de todas las LAN, con un `/28` por paso a nivel (14 direcciones útiles, suficientes para el controlador, la cámara, los sensores y el router o switch del gabinete).

| Grupo | Bloque | Detalle |
| :-- | :-- | :-- |
| Cercanos a Campana (6) | 10.60.20.0/24 | 10.60.20.0/28 a 10.60.20.80/28 |
| Cercanos a San Pedro (8) | 10.60.30.0/24 | 10.60.30.0/28 a 10.60.30.112/28 |
| Cercanos a San Nicolás (11) | 10.60.40.0/24 | 10.60.40.0/28 a 10.60.40.160/28 |
| Cercanos a Rosario (12) | 10.60.50.0/24 | Propuesta siguiendo la misma regla; la confirma Trini |
| 156 con router propio y VPN al CCO | 10.60.128.0/20 | 256 subredes /28, sobran 100 para crecer |

En cada bloque de estación, `10.60.S.240/28` queda para el tránsito entre el switch OT y el firewall (VLAN 41). Un /24 tiene lugar para 15 pasos a nivel más ese tránsito; San Nicolás, con 11, es la que más usa.

### Transporte: loopbacks, enlaces punto a punto y túneles

| Sede | Loopback (router-ID) | Enlace CE–PE MPLS (/30) | Túnel sobre MPLS | Túnel IPSec sobre Internet | AS BGP |
| :-- | :-- | :-- | :-- | :-- | :-- |
| Retiro R1 | 10.255.0.10/32 | 172.16.0.0/30 | 172.17.1.1 | 172.17.2.1 | 65010 |
| Retiro R2 | 10.255.0.11/32 | 172.16.0.24/30 | 172.17.1.2 | 172.17.2.2 | 65010 |
| Campana | 10.255.0.20/32 | 172.16.0.4/30 | 172.17.1.20 | 172.17.2.20 | 65020 |
| San Pedro | 10.255.0.30/32 | 172.16.0.8/30 | 172.17.1.30 | 172.17.2.30 | 65030 |
| San Nicolás | 10.255.0.40/32 | 172.16.0.12/30 | 172.17.1.40 | 172.17.2.40 | 65040 |
| Rosario | 10.255.0.50/32 | 172.16.0.16/30 | 172.17.1.50 | 172.17.2.50 | 65050 |
| Talleres Rosario | 10.255.0.51/32 | 172.16.0.20/30 | 172.17.1.51 | 172.17.2.51 | 65050 |

- En cada /30, el PE del operador usa `.1` y nuestro router `.2`. Si el operador asigna sus propias direcciones, se reemplazan sin cambiar el resto del plan.
- Los túneles son una red multipunto /24 por camino (hub en Retiro), con el último octeto igual al número de la sede para que sea fácil de leer.
- Cada sede usa un AS privado distinto, así el operador no tiene que reescribir el AS (as-override) para que las sedes acepten las rutas de las otras.

### Enrutamiento

- **Área 0 (backbone):** la LAN del CCO en Retiro y los túneles SD-WAN entre las sedes. La WAN forma parte del área 0.
- **Áreas 1 a 4:** Campana (1), San Pedro (2), San Nicolás (3) y Rosario (4; Talleres en el área 5).
- **ABR:** el FortiGate de cada sede tiene sus VLAN en el área de la sede y los túneles en el área 0. Hacia el área 0 publica solo dos resúmenes: `10.S.0.0/16` y `10.60.S.0/24`. Retiro publica además `10.60.128.0/20` de los pasos a nivel por VPN. Así un problema dentro de una estación (una VLAN que se cae, un paso a nivel que se desconecta) no dispara recálculos en el resto del ramal.
- **eBGP con el operador MPLS:** es solo el transporte. Cada sede publica su loopback, que es el origen de los túneles, y nunca sus redes internas. El operador no ve el plan de direcciones de la empresa.
- **OSPF sobre los túneles SD-WAN:** cada sede tiene dos túneles al hub de Retiro, uno sobre el MPLS (costo OSPF 10) y otro IPSec sobre Internet (costo 100). OSPF corre sobre los dos en modo punto a multipunto. En condiciones normales gana el del MPLS; si se cae, OSPF converge al de Internet. Además, SD-WAN mide latencia, jitter y pérdida y puede mover una aplicación (por ejemplo, la voz) al otro túnel antes de que el MPLS se caiga del todo.
- **Internet local:** la VLAN 50 sale directo por el acceso a Internet de la sede con NAT y nunca entra a los túneles.

### Coordinación con Joa (8.5.4)

Mensaje para Joa:

> Joa, te confirmo cómo entran los pasos a nivel cercanos a cada estación, ya está así en la simulación 4. Cada paso a nivel llega por fibra monomodo (1000BASE-LX) a un puerto ruteado del switch de agregación OT de la estación, con su propio /28 dentro de 10.60.S.0/24 (S = 20 Campana, 30 San Pedro, 40 San Nicolás, 50 Rosario). El switch OT sube al FortiGate por la VLAN 41 usando 10.60.S.240/28, y el firewall lo pone en la zona OT-PaN, que solo habla con el SCADA (10.10.40.0/24), el VMS (10.10.30.0/24) y la gestión (10.10.99.0/24) del CCO. Los 156 con router propio y VPN usan 10.60.128.0/20. Una sola corrección en tu tarea: donde dice /29 tiene que decir /28, porque es la máscara que usamos en todo el plan.

---

## 8.5.3 LAN de las sedes menores

### LAN tipo

Las tres sedes usan el mismo diseño y cambian solo las cantidades:

- **FortiGate 80F:** router, firewall y SD-WAN. Termina el MPLS y el respaldo, es ABR de OSPF, habla eBGP con el operador, cierra los túneles IPSec y separa las zonas IT, voz, video, OT de la estación y OT-PaN. Tiene dos puertos WAN y dos SFP, uno de los cuales se usa para el switch OT.
- **Switch de acceso PoE+ de 48 puertos (FortiSwitch 148F-FPOE):** teléfonos, cámaras del edificio, access points y equipos OT de la estación. Las PC se conectan al puerto de PC de cada teléfono (VLAN 10 sin etiqueta y VLAN 20 etiquetada), lo que evita un segundo switch en Campana y San Pedro.
- **Switch de agregación OT capa 3 de 24 SFP (referencia: Catalyst 9300-24S):** recibe los pasos a nivel. Cada puerto es un puerto ruteado con el /28 de su paso a nivel, así no hace falta una VLAN por paso a nivel. Al lado va una bandeja de fibra (ODF) donde terminan los pares que llegan de la vía.
- **NVR de 4 bahías:** graba localmente las cámaras de la sede durante 30 días. Al CCO suben en vivo solo 4 a 6 cámaras y los clips de evento.
- **Access points (FortiAP 231F):** Wi-Fi de pasajeros y personal en la VLAN 50.
- **Gabinete de andén IP65:** switch industrial con 8 puertos PoE+ y 2 SFP para las cámaras del extremo del andén, unido al rack por fibra multimodo OM3.
- **UPS online de 1,5 kVA y rack de 24U.**

### Gabinete de andén: hace falta en las tres

La versión anterior lo ponía solo en Campana. El enlace permanente de UTP llega a 90 m (TIA-568), y las distancias del relevamiento son en línea recta desde el edificio. El cable real sigue bandejas, cruces y subidas, lo que suma alrededor de un 15–20 %:

| Sede | Extremo del andén (línea recta) | Cable estimado | Resultado |
| :-- | :-- | :-- | :-- |
| Campana | ~130–145 m | ~170 m | Gabinete + OM3 |
| San Nicolás | ~100 m | ~120 m | Gabinete + OM3 |
| San Pedro | ~95 m | ~115 m | Gabinete + OM3 |

Las tres superan los 90 m, así que las tres llevan gabinete. En San Pedro y San Nicolás alcanza con un gabinete chico para las cámaras del extremo más lejano.

En la LAN conviven dos tipos de fibra:

- **Multimodo OM3 (1000BASE-SX, hasta 550 m):** del rack al gabinete de andén, que está a menos de 200 m.
- **Monomodo OS2 (1000BASE-LX, hasta 10 km):** de los pasos a nivel al switch OT, según la 8.5.4. Cubre los 5 km del paso a nivel más lejano.

### Cantidades por sede

Supuestos: teléfono IP 7 W, cámara 13 W, access point 18 W (802.3at), una PC por usuario simultáneo de la Tabla 4.1, dos equipos OT por estación, video grabado a 2 Mbps por cámara (H.265) durante 30 días.

| Concepto | Campana | San Pedro | San Nicolás |
| :-- | --: | --: | --: |
| Teléfonos IP | 30 | 24 | 40 |
| PCs (detrás del teléfono) | 15 | 12 | 20 |
| Cámaras (edificio + andén) | 6 + 6 | 6 + 4 | 10 + 6 |
| Access points | 2 | 2 | 3 |
| Equipos OT de la estación (VLAN 40) | 2 | 2 | 2 |
| Puertos RJ45 usados en el rack (incluye NVR y uplink) | 42 de 48 | 36 de 48 | 57 de 72 |
| PoE en el rack | 324 W | 282 W | 464 W |
| Puertos y PoE en el gabinete de andén | 6 · 78 W | 4 · 52 W | 6 · 78 W |
| Pasos a nivel / SFP LX | 6 | 8 | 11 |
| Fibras usadas en la ODF | 12 de 24 | 16 de 24 | 22 de 48 |
| SFP SX (gabinete y uplink del switch OT) | 4 | 4 | 4 |
| Grabación 30 días | 7,8 TB | 6,5 TB | 10,4 TB |

El PoE de cada sede queda por debajo del 65 % de los 740 W del switch de 48 puertos. San Nicolás necesita 57 puertos, así que suma un switch de 24 puertos PoE+ (370 W).

### Equipos por sede

| Equipo (modelo de referencia) | Campana | San Pedro | San Nicolás |
| :-- | :-: | :-: | :-: |
| FortiGate 80F | 1 | 1 | 1 |
| FortiSwitch 148F-FPOE (48 PoE+, 4 SFP, 740 W) | 1 | 1 | 1 |
| FortiSwitch 124F-FPOE (24 PoE+, 370 W) | — | — | 1 |
| Switch capa 3 de 24 SFP (ref. Catalyst 9300-24S) | 1 | 1 | 1 |
| Bandeja de fibra (ODF) | 24 fibras | 24 fibras | 48 fibras |
| Gabinete de andén IP65 con switch industrial 8 PoE+ | 1 | 1 | 1 |
| NVR de 4 bahías en RAID 5 | 16 canales, 4 × 4 TB | 16 canales, 4 × 4 TB | 32 canales, 4 × 6 TB |
| FortiAP 231F | 2 | 2 | 3 |
| UPS online 1,5 kVA y rack 24U | 1 | 1 | 1 |
| Respaldo WAN | Cablemódem 20 Mbps | Radioenlace a Baradero + 4G/5G | Cablemódem 30 Mbps |

La carga del rack ronda los 550 W en la sede más cargada. Con un banco de baterías externo, la UPS da unos 30 minutos.

### Respaldo de San Pedro

San Pedro es la única sede sin nodo REFEFO; los más cercanos están en Baradero (~21 km) y Ramallo (~38 km), distancias aproximadas en línea recta. El respaldo tiene que llevar los 17 Mbps de tráfico crítico de la Tabla 5.1 (20 Mbps contratados), y casi todo es de subida hacia el CCO: OT, voz, datos IT, gestión y clips de evento.

| Criterio | 4G/5G con doble chip | Radioenlace a Baradero |
| :-- | :-- | :-- |
| Capacidad | Variable, 5–15 Mbps de subida por chip; con dos operadores ronda los 20 Mbps sin garantía | 100 Mbps o más, fijos |
| Obra | Router con dos chips y antena exterior | Una torre de unos 30 m en cada punta (a 21 km la primera zona de Fresnel y la curvatura de la Tierra piden unos 16 m libres sobre los obstáculos) |
| Costo | CAPEX bajo; abono mensual por dos chips | CAPEX alto; casi sin costo mensual |
| Riesgo | Celda compartida con el público; se satura en eventos | Necesita línea de vista y un acceso a Internet o REFEFO en Baradero |
| Independencia | Camino físico distinto de la fibra | Camino físico distinto de la fibra |

Ramallo queda descartado para el radioenlace: a 38 km harían falta torres de unos 50 m.

**Recomendación:** radioenlace a la estación Baradero como respaldo, porque es la única opción que garantiza los 20 Mbps del tráfico crítico. El router 4G/5G con doble chip se instala al principio, mientras se hace la obra de las torres, y después queda como tercer camino y acceso de gestión fuera de banda. Antes de cerrar la decisión hay que medir la cobertura real de 4G/5G en la estación y confirmar la línea de vista a Baradero.

---

## Slides

**Slide 1 – Sede tipo.** Esquema de la LAN (ver la simulación 4, paso 1):

- Rack: FortiGate 80F, switch PoE+ de 48 puertos (740 W), NVR y UPS de 1,5 kVA, para 30 / 24 / 40 teléfonos y 12 / 10 / 16 cámaras.
- Andén: gabinete IP65 con switch PoE en las tres sedes, unido por fibra multimodo OM3.
- Pasos a nivel: 6 / 8 / 11 llegan por fibra monomodo a un switch OT de 24 SFP, un puerto ruteado por cruce.
- Respaldo: cablemódem en Campana y San Nicolás; en San Pedro, sin REFEFO, radioenlace a Baradero más 4G/5G.

**Slide 2 – Direcciones y OSPF.**

| Sede | S | Área | Resumen del ABR | Pasos a nivel |
| :-- | :-: | :-: | :-- | :-- |
| Retiro | 10 | 0 | 10.10.0.0/16 | 10.60.128.0/20 |
| Campana | 20 | 1 | 10.20.0.0/16 | 10.60.20.0/24 |
| San Pedro | 30 | 2 | 10.30.0.0/16 | 10.60.30.0/24 |
| San Nicolás | 40 | 3 | 10.40.0.0/16 | 10.60.40.0/24 |
| Rosario | 50 | 4 / 5 | 10.50.0.0/16 | 10.60.50.0/24 |

- VLAN V: 10 IT, 20 voz, 30 video, 40 OT, 50 Wi-Fi, 99 gestión; un /28 por paso a nivel.
- Ruteo: área 0 en el CCO y en los túneles SD-WAN; eBGP con el operador solo para el transporte.

---

## Pendientes y supuestos a validar

- Confirmar con Trini el bloque 10.60.50.0/24 para los 12 pasos a nivel de Rosario y las loopbacks y enlaces de Rosario y Talleres.
- Confirmar con Feli la segunda conexión de Retiro (R2) y las direcciones del hub de los túneles.
- Los modelos de equipos son de referencia; Lázaro puede reemplazarlos por equivalentes al cerrar el presupuesto.
- Validar en el lugar el recorrido real del cable al extremo de cada andén, la cobertura 4G/5G en San Pedro y la línea de vista a Baradero.
- Las direcciones de los enlaces CE–PE dependen del operador.
