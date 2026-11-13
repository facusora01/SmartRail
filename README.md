# Smart Rail · Simulación de Red WAN Regional (TA048 Redes)

Portal web y simulación interactiva de la red WAN regional **Smart Rail**, publicado automáticamente mediante **GitHub Actions** en **GitHub Pages**.

## Contenido del sitio (`site/`)

- `site/index.html`: Portal principal con acceso a las 4 simulaciones, visor integrado, índice y estado del TP, cambios de la simulación a escala y guía de uso.
- `site/SmartRail-1-Recorrido.html`: **1 · Recorrido por paradas** (Retiro hasta Rosario).
- `site/SmartRail-2-La-red-por-dentro.html`: **2 · La red por dentro** (figuras animadas: troncal, estación y Talleres Rosario).
- `site/SmartRail-3-Simulacion.html`: **3 · Simulación a escala del mapa** (tráfico en vivo y cortes de fibra con conmutación SD-WAN / VPN IPSec).
- `site/SmartRail-4-Sedes-Menores.html`: **4 · Sedes menores** (LAN tipo de Campana, San Pedro y San Nicolás y llegada de los pasos a nivel cercanos).
- `site/assets/fonts.css`: tipografías IBM Plex Sans y Oswald embebidas, compartidas por el portal y la simulación 4.
- `site/ABRIR-AQUI.html` y `site/LEEME.txt`: Portada e instrucciones originales de la versión offline.
- `content/`: Documentación exportada del Drive (`indice-y-estado-tp.md`, `simulacion-link-y-cambios.md`).

## GitHub Action y GitHub Pages

El workflow [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml):

1. Valida que todos los archivos HTML de la simulación y el portal estén presentes y no vacíos.
2. Empaqueta la carpeta `site/` como artefacto de Pages.
3. Despliega automáticamente en GitHub Pages en cada `push` a `main` o mediante ejecución manual (`workflow_dispatch`).

### Activación en GitHub

En el repositorio de GitHub (`Settings` → `Pages` → `Build and deployment`), seleccionar **Source: GitHub Actions**.
La web quedará disponible en: `https://facusora01.github.io/SmartRail/`
