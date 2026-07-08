# Dos anys triant-nos

Experiència web estàtica per celebrar dos anys de relació oficial el 18/07. Està pensada per publicar-se a GitHub Pages i funcionar com una app mòbil: capítols, codis, progrés guardat, pistes, animacions suaus i un tancament d'aniversari.

La web ha de semblar un regal de reconeixement, història i felicitat pels dos anys compartits. El Share Festival 2026, el cap de setmana del 24/07, queda plantejat només com una celebració posterior al lloc on tot va començar; qualsevol altra acció presencial ha de quedar fora de la web i no s'ha d'intuir.

## Estructura narrativa actual

L'experiència té 8 capítols:

1. El voluntariat al Share Festival.
2. Lia Kali i la primera guspira.
3. La barrera de l'anell/compromís.
4. Les converses que us van connectar.
5. La decisió honesta de cancel·lar el casament.
6. Les primeres cites entre Barcelona i Granollers.
7. Triar-vos a Bigues i Riells, Sabadell i casa.
8. El tancament d'aniversari i el Share Festival 2026 com a celebració posterior.

## Pendent d'afegir

### Àudio

Ara mateix `experienceAssets.musicSrc` és buit a `js/chapters.js`, així que el botó de música s'amaga. Quan tinguis l'àudio, col·loca l'arxiu a `assets/audio/` i omple la ruta, per exemple:

```js
const experienceAssets = {
  musicSrc: "assets/audio/instrumental.mp3"
};
```

Recomanació: una pista instrumental suau, sense una lletra protagonista, perquè no competeixi amb els textos ni amb el tancament d'aniversari.

### Fotos

Cada capítol té una propietat `image` buida a `js/chapters.js`. Si afegeixes fotos a `assets/images/`, pots assignar-les així:

```js
image: "assets/images/01-forum.jpg"
```

Suggeriments de fotos:

- `01-forum.jpg`: Parc del Fòrum, Share Festival o voluntariat.
- `02-lia-kali.jpg`: concert, entrada, polsera o record de Lia Kali.
- `03-barrera.jpg`: imatge simbòlica de l'anell o d'una distància prudent.
- `04-converses.jpg`: record simbòlic de missatges o Barcelona de nit.
- `05-veritat.jpg`: una imatge íntima però serena, no dramàtica.
- `06-granollers.jpg`: parc, carrer o lloc de primeres cites.
- `07-casa.jpg`: Bigues i Riells, Sabadell o un objecte quotidià vostre.
- `08-final.jpg`: una imatge del Parc del Fòrum, del Share Festival o d'un record que funcioni com a celebració d'aniversari.

## Textos i codis a revisar

Codis actuals:

1. `LIAKALI`
2. `0906`
3. `RESPECTE`
4. `SEGUIM`
5. `VERITAT`
6. `GRANOLLERS`
7. `TRIAR-NOS`

Revisa especialment:

- Si el concert de Lia Kali va ser el 09/06. Si no, canvia el codi del capítol 2.
- Si el capítol 5, sobre cancel·lar el casament, ha de ser més suau, més privat o menys explícit.
- Si `RESPECTE`, `VERITAT` o `GRANOLLERS` són codis massa fàcils o poc íntims.
- Si vols afegir accions físiques entre capítols: nota amagada, polsera, foto impresa, QR, ubicació o petit objecte.
- Si el tancament d'aniversari ha de ser més emocional, més discret respecte al Share Festival o més centrat en els dos anys de relació oficial.

