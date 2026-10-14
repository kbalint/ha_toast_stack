# Kompakt Home Assistant toastok

A két fájlt másold ide a HA gépén:

```text
/config/www/ha-toast-stack/ha-toast-stack.js
/config/www/ha-toast-stack/ha-toast-stack.css
```

A `configuration.yaml` meglévő `frontend:` blokkjába add hozzá (ne legyen két `frontend:` kulcs):

```yaml
frontend:
  extra_module_url:
    - /local/ha-toast-stack/ha-toast-stack.js?v=2
```

Ha már van `extra_module_url` lista, csak az új listatételt add hozzá. Ha a frontend külön YAML fájlba van include-olva, abban a fájlban az `extra_module_url` kulcsot add hozzá.

Indítsd újra a Home Assistantot, majd töltsd újra teljesen a böngészőt / Companion appot.

Eredmény: jobb alsó sarokban legfeljebb 420 px széles toastok, mobilon oldalsó margóval; legfeljebb a képernyő 45%-át foglaló, görgethető stack; toastonként kör alakú X a jobb felső sarokban. A görgetés érintéssel vagy egérrel működik, a görgetősáv rejtett. Bezárás után a popover teljesen rejtett. A HA eredeti időzítései, akciógombjai és dismiss callbackjei működnek tovább. A CSS közvetlenül szerkeszthető. Módosítás után teljes újratöltés szükséges; növeld a `?v=2` verziót is, amelyet a betöltő a CSS URL-jére is átad.

Nem kell HACS, card-mod vagy dashboard resource. A JS a CSS-t ugyanabból a könyvtárból tölti be, és beilleszti a komponensek shadow DOM-jába, mert egy globális CSS fájl nem éri el ezeket. A HA saját bezárógombját kapcsolja be; nem csak egy dekoratív X-et rajzol.

Az override a jelenlegi, `.stack` / `ha-toast` alapú HA frontend belső felépítésére készült. Régebbi frontenddel vagy belső markupot módosító HA frissítés után ellenőrizni kell. Éles HA példányon nem lett tesztelve. Már megnyitott toastok bezárógombja csak az új értesítéseknél jelenik meg.

Eltávolítás: töröld az `extra_module_url` listatételt, indítsd újra a HA-t, és töltsd újra az appot.

Források:
- https://www.home-assistant.io/integrations/frontend/#loading-extra-javascript
- https://github.com/home-assistant/frontend/blob/dev/src/managers/notification-manager.ts
- https://github.com/home-assistant/frontend/blob/dev/src/components/ha-toast.ts
