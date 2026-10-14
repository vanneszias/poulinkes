# Poulinkes — kippenabo met vossengarantie

## Concept
Maandabonnement op legkippen. Eet de vos uw kiekens op, dan leveren we binnen 48u vervangkippen,
via drop shipment rechtstreeks van een kweker in de regio van de klant. Poulinkes heeft zelf geen kippen of stock.

## Verdienmodel
| Abo | Kippen | Claims/jaar | Prijs |
|---|---|---|---|
| Stadskot | 2 | 1 | €9/m |
| Familiekot | 4 | 2 | €15/m |
| Boerderijbende | 8 | fair use | €25/m |

Een legkip kost bij de kweker ongeveer €10–15. De marge zit in de abo-pool: veruit de meeste klanten
claimen nooit (zoals bij een verzekering).

## Drop shipment
- Partnerkwekers per provincie/postcodezone; de claim gaat naar de dichtstbijzijnde kweker.
- Kweker levert zelf of via een erkende diertransporteur. Poulinkes regelt de betaling en de klantcommunicatie.
- Te checken: FAVV-registratie (ook particuliere pluimveehouders moeten zich registreren),
  regels voor het vervoer van levende dieren, vaccinatieplicht (pseudovogelpest), ophokplicht bij vogelgriep
  (dan tijdelijk geen leveringen?).

## Misbruik beperken
- Foto van de plaats delict + datum verplicht.
- Kippen moeten 's nachts in een gesloten hok zitten (voorwaarde). Na herhaalde claims: advies of bezoek over de omheining.
- Upsell: vossenwerende omheining of automatisch hokdeurtje als affiliate.

## Marketingtools
- **Kippennaamgenerator** (gemaakt): deelbaar, met link terug naar de shop. Volgende stap: een deelbare afbeelding
  ("Kippenpaspoort") met naam, karaktertrek en het Poulinkes-logo.
- Kippennaam-certificaat bij elke levering (de naam uit de generator).
- "Vossenteller": publieke kaart met (geanonimiseerde) vossenclaims per gemeente. Goed voor de lokale pers.
- In memoriam-kaartje bij een vervanglevering. Mensen delen dat.

## Prototype
Statische site (`index.html`, `style.css`, `app.js`), zonder backend. De formulieren tonen alleen een bevestiging.
Volgende stap: echte checkout (Mollie voor Bancontact en terugkerende betalingen) en een claim-flow naar kwekers.
