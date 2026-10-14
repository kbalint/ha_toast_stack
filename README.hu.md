# Kompakt Home Assistant toastok

[English documentation](README.md)

## Miért készült?

Az ismétlődő kapcsolati hibák nagy értesítésekkel töltötték meg a Home Assistant teljes képernyőjét, eltakarva a dashboardot. Ezért készült a HA Toast Stack: kompakt, görgethető listába rendezi őket, egyenkénti bezárógombbal és **Close all** badge-dzsel.

| Előtte | Utána |
| --- | --- |
| <img src="docs/images/before.png" alt="Előtte: ismétlődő hibaértesítések takarják el a Home Assistant képernyőjét" width="300"> | <img src="docs/images/after.png" alt="Utána: kompakt, keretezett értesítések középre igazított X-szel és Close all badge-dzsel" width="420"> |

## Telepítés HACS-ből

1. Nyisd meg: **HACS → ⋮ → Custom repositories / Egyéni tárolók**.
2. Add hozzá a `https://github.com/kbalint/ha_toast_stack` repót **Dashboard** típussal (régebbi HACS-ban **Lovelace / Plugin**).
3. Keresd meg a **HA Toast Stack** bővítményt, és töltsd le. A JS és CSS a `/config/www/community/ha_toast_stack/` könyvtárba kerül.
4. A meglévő `frontend:` blokkban kösd be:

```yaml
frontend:
  extra_module_url:
    - /local/community/ha_toast_stack/ha_toast_stack.js?v=5
```

5. Indítsd újra a HA-t, majd töltsd újra teljesen a böngészőt / Companion appot.

A repó egyéni HACS tárolóként telepíthető; nincs benne az alapértelmezett HACS katalógusban. A HACS kezeli a letöltést és frissítést; a globális YAML bekötést egyszer kézzel kell hozzáadni. HACS-frissítés után növeld a modul URL-jének verzióját, majd töltsd újra az appot; YAML módosítás után indítsd újra a HA-t. A HACS az esetleges helyi CSS módosításaidat felülírja.

A HACS automatikusan dashboard resource-ot is felvehet. A `frontend.extra_module_url` biztosítja, hogy az override minden frontend oldalon betöltődjön. A kód védett az ismételt betöltés ellen. Ha kézi telepítésről váltasz, a régi `/local/ha-toast-stack/...` bejegyzést cseréld az új HACS útvonalra.

## Automatikus frissítésjelzés

Minden `main` ágra történő push után a GitHub Actions ellenőrzi a buildet, és verziózott GitHub release-t készít a JS és CSS fájllal. A HACS az időszakos ellenőrzése során észleli az új kiadást, és elérhető frissítésként jelzi. Ez HACS-frissítésjelzés; telefonos push értesítéshez a HACS update entity-re épülő Home Assistant automatizáció kell. Kézi információfrissítéssel hamarabb is ellenőrizhető az új kiadás.

## Kézi telepítés

A két fájlt másold ide a HA gépén:

```text
/config/www/ha-toast-stack/ha-toast-stack.js
/config/www/ha-toast-stack/ha-toast-stack.css
```

A `configuration.yaml` meglévő `frontend:` blokkjába add hozzá (ne legyen két `frontend:` kulcs):

```yaml
frontend:
  extra_module_url:
    - /local/ha-toast-stack/ha-toast-stack.js?v=5
```

Ha már van `extra_module_url` lista, csak az új listatételt add hozzá. Ha a frontend külön YAML fájlba van include-olva, abban a fájlban az `extra_module_url` kulcsot add hozzá.

Indítsd újra a Home Assistantot, majd töltsd újra teljesen a böngészőt / Companion appot.

Eredmény: jobb alsó sarokban legfeljebb 420 px széles toastok, mobilon oldalsó margóval; legfeljebb a képernyő 45%-át foglaló, görgethető stack; toastonként kör alakú X a jobb felső sarokban. A görgetés érintéssel vagy egérrel működik, a görgetősáv rejtett. Bezárás után a popover teljesen rejtett. A HA eredeti időzítései, akciógombjai és dismiss callbackjei működnek tovább. A CSS közvetlenül szerkeszthető. Módosítás után teljes újratöltés szükséges; növeld a `?v=5` verziót is, amelyet a betöltő a CSS URL-jére is átad.

Kézi telepítéshez nem kell HACS, card-mod vagy dashboard resource. A JS a CSS-t ugyanabból a könyvtárból tölti be, és beilleszti a komponensek shadow DOM-jába, mert egy globális CSS fájl nem éri el ezeket. A HA saját bezárógombját kapcsolja be; nem csak egy dekoratív X-et rajzol.

Az override a jelenlegi, `.stack` / `ha-toast` alapú HA frontend belső felépítésére készült. Régebbi frontenddel vagy belső markupot módosító HA frissítés után ellenőrizni kell. Éles HA példányon nem lett tesztelve. Már megnyitott toastok bezárógombja csak az új értesítéseknél jelenik meg.

Két vagy több toastnál a stack tetején megjelenik a `Close all (darabszám)` badge. Ez az összes kattintáskor látható toastot a HA eredeti dismiss műveletével zárja be. Egyetlen toastnál nincs badge. Bezárás közben érkező új toastok megmaradnak. Frissítéshez cseréld le mindkét fájlt, és állítsd a modul URL-jét `?v=5`-ra.

Eltávolítás: töröld az `extra_module_url` listatételt, indítsd újra a HA-t, és töltsd újra az appot.

Források:
- https://www.home-assistant.io/integrations/frontend/#loading-extra-javascript
- https://github.com/home-assistant/frontend/blob/dev/src/managers/notification-manager.ts
- https://github.com/home-assistant/frontend/blob/dev/src/components/ha-toast.ts
