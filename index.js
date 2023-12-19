let canvas = document.body.getElementsByTagName("canvas")[0];

canvas.width = (window.innerWidth * 80) / 100;
canvas.height = (window.innerHeight * 65) / 100;

let ctx = canvas.getContext("2d");

let X0;
let Y0;

let X;
let Y;

let click = 0;

let mypick;

let historic = [];
let score;

let firstColor = ((color = "white") => {
  ctx.strokeStyle = color;
})();

function actualizePos(event) {
  //arreter l'event d'ecoute quand on stop le dessin
  if (click % 2 == 0) {
    canvas.removeEventListener("mousemove", actualizePos);
  }

  //actualisation
  X = event.offsetX;
  Y = event.offsetY;

  ctx.moveTo(X0, Y0);
  ctx.lineTo(X, Y);
  ctx.stroke();
  ctx.closePath();

  X0 = event.offsetX;
  Y0 = event.offsetY;
}

function draw(event) {
  setPenWidth();
  click++;
  X0 = event.offsetX;
  Y0 = event.offsetY;
  //add historic drawing each time we click to start drawing :
  if (click % 2 == 0) {
    historic.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  }
  if (historic.length > 4) {
    historic.shift();
  }

  ctx.beginPath();
  ctx.strokeStyle = mypick;
  ctx.moveTo(X0, Y0);
  canvas.addEventListener("mousemove", actualizePos);
}

canvas.addEventListener("click", draw);

/////////////////////////
//DIV color
let color;

for (let i = 0; i < document.getElementsByTagName("div").length; i++) {
  let hexa = "0123456789ABCDEF";
  let hexaArr = hexa.split("");

  function randomHex() {
    return hexaArr[Math.round(Math.random() * 15)];
  }
  // let newcolor
  switch (i == 0) {
    case true:
      color = "#";
      for (let i = 1; i <= 6; i++) {
        color += randomHex();
      }
      break;

    case false:
      // colorToUpdate = document.getElementsByTagName('div')[i-1].style.background
      let indexColor = color.split("");
      indexColor.shift();
      console.info("nos couleurs :", indexColor);
      indexColor = indexColor.map((ele) => {
        return hexaArr.indexOf(ele);
      }); // ON A NOTRE INDEX DE REF AUQEUL ON SOUHAITE INCR2MENTER LA PROCHAINE COULEUR
      console.info("notre index de color :", indexColor);

      for (let j = 0; j < indexColor.length; j++) {
        switch (indexColor[j] + 2 > hexaArr.length) {
          case false:
            indexColor[j] += 1;
            console.log(
              "index premier cas switch (inferieur) :",
              indexColor[j],
              indexColor
            );
            break;

          case true:
            indexColor[j] -= 14;
            console.log(
              "deuxieme cas swtich (supérieur) :",
              indexColor[j],
              indexColor
            );
            break;
        }
      }
      color = "#";
      for (index of indexColor) {
        color += hexa[index];
      }
      break;
  }
  Object.assign(document.getElementsByTagName("div")[i].style, {
    background: color,
  });
}

/////

function pickColor(event) {
  mypick = event.target.style.background;
  console.log(mypick);
}

for (let i = 0; i < document.body.getElementsByTagName("div").length; i++) {
  document.body
    .getElementsByTagName("div")
    [i].addEventListener("click", pickColor);
}

///// Undo function :
function undo() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  historic.length > 1
    ? ctx.putImageData(historic[historic.length - 2], 0, 0)
    : (historic = []);
  if (historic.length > 1) {
    historic.pop();
  } else if ((historic.length = 1)) {
    historic = [];
  }
  console.log(historic);
}

// set width pen :

function setPenWidth() {
  let penWidth = document.body.getElementsByTagName("input")[0].value;
  ctx.lineWidth = penWidth;
}
/// Opti chargement (eviter décalage rapide au chargement) : (on peut également utiliser l'attribut onlaod='fct(){}'  dans notre tag html)

// let link = document.querySelectorAll('link[rel="stylesheet preconnect preload"]')[0];
// link.addEventListener('load', function() {// quand la police est chargé : =>
//   document.addEventListener('DOMContentLoaded', function() {  // et que le DOM est chargé
//     // Le DOM est prêt, afficher le contenu de la page
//  let mybody = document.getElementsByTagName('body')[0];
//     mybody.style.display = 'flex'
//   });
// });

window.addEventListener("load", () => {
  let mybody = document.getElementsByTagName("body")[0];
  mybody.style.visibility = "inherit";
});
