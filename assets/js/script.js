import T from '../images/tonio.png'
import M from '../images/mad.png'
import G from '../images/coeur.gif'
import D from '../images/dofus.png'
import TS from '../images/tonio_snake.png'
import B from '../images/bonbon.png'
import MD from '../images/mad_snake.png'
import PC from '../images/photoClasse.png'
import I from '../images/invit.jpg'

window.onload = function () {
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
      thisArg = thisArg || window
      for (var i = 0; i < this.length; i++) {
        callback.call(thisArg, this[i], i, this)
      }
    }
  }

  const elemsMenu = document.querySelectorAll('.menu')
  const maxWidth = 850
  const maxHeight = 480

  function isMobileDevice () {
    if (navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i)
    ) {
      return true
    } else {
      return false
    }
  }

  if (isMobileDevice()) {
    var photoClasse_Event = document.getElementById('Bloc_photoClasse')
    photoClasse_Event.id = photoClasse_Event.id + 'Selec'
    const titre = document.getElementById('titre_banniere')
    const banniere = document.getElementById('banniere')
    banniere.id = 'banniere_Selec'
    const Bloc_photoCoeur = document.createElement('div')
    Bloc_photoCoeur.id = 'Bloc_photoCoeur'
    const photoCoeur = document.createElement('img')
    photoCoeur.src = 'images/coeur.gif'
    Bloc_photoCoeur.appendChild(photoCoeur)
    banniere.appendChild(Bloc_photoCoeur)
  } else {
    elemsMenu.forEach(function (elem) {
      elem.addEventListener('mouseenter', function (event) {
        elem.id = elem.id + 'Selec'
        if (window.innerWidth < maxWidth || window.innerHeight < maxHeight) return
        const blocGrimpeur = document.createElement('div')
        blocGrimpeur.id = 'imgTemp'

        const grimpeur = document.createElement('img')
        const tmp = Math.floor(Math.random() * 2)
        grimpeur.src = (tmp === 0) ? 'images/tonio.png' : 'images/mad.png'

        blocGrimpeur.appendChild(grimpeur)
        elem.appendChild(blocGrimpeur)
      }, false)

      elem.addEventListener('mouseleave', function (event) {
        elem.id = elem.id.slice(0, -5)
        if (window.innerWidth < maxWidth || window.innerHeight < maxHeight) return
        const a = document.getElementById('imgTemp')
        elem.removeChild(a)
      }, false)
    })

    var photoClasse_Event = document.getElementById('Bloc_photoClasse')

    photoClasse_Event.addEventListener('mouseenter', function (event) {
      photoClasse_Event.id = photoClasse_Event.id + 'Selec'
      const banniere = document.getElementById('banniere')
      banniere.id = 'banniere_Selec'

      const Bloc_photoCoeur = document.createElement('div')
      Bloc_photoCoeur.id = 'Bloc_photoCoeur'

      const photoCoeur = document.createElement('img')
      photoCoeur.src = 'images/coeur.gif'

      Bloc_photoCoeur.appendChild(photoCoeur)

      banniere.appendChild(Bloc_photoCoeur)
    }, false)

    photoClasse_Event.addEventListener('mouseleave', function (event) {
      const banniere = document.getElementById('banniere_Selec')

      banniere.id = 'banniere'

      photoClasse_Event.id = photoClasse_Event.id.slice(0, -5)
      const a = document.getElementById('Bloc_photoCoeur')

      banniere.removeChild(a)
    }, false)

    let canvas
    let ctx
    const r = 5
    const delay = 100
    const lDiscret = 100 / r // doit être un diviseur de cWidth et cHeight et pair
    let cmpt = 0
    let direction
    const cmptM = 50000
    const cWidth = 1900 / r
    const cHeight = 1600 / r
    let score = 0
    const rPomme = 50 / r
    let s, p
    let entree = new this.Array(0)
    const dofus = new Image()
    dofus.src = 'images/dofus.png'
    dofus.id = 'dofus'
    const tonioSnake = new Image()
    tonioSnake.src = 'images/tonio_snake.png'

    const bonbon = new Image()
    bonbon.src = 'images/bonbon.png'
    const madSnake = new Image()
    madSnake.src = 'images/mad_snake.png'

    let choix

    document.onkeydown = function (e) {
      const key = e.which || e.keyCode// ?e.which:event.keyCode;
      entree.push(key)
      if (trouverDsTab(entree, [65, 78, 84, 79, 73, 78, 69]) !== -1) {
        entree = new Array(0)
        choix = 1
        init()
      }
      if (trouverDsTab(entree, [77, 65, 68, 69, 76, 73, 78, 69]) !== -1) {
        entree = new Array(0)
        choix = 2
        init()
      }
      if (key == 40) direction = (direction[1] === -1 || (s.yCoordTab[s.yCoordTab.length - 1] < s.yCoordTab[s.yCoordTab.length - 2] && s.xCoordTab[s.xCoordTab.length - 1] === s.xCoordTab[s.xCoordTab.length - 2])) ? direction : [0, 1]
      if (key == 37) direction = (direction[0] === 1 || (s.xCoordTab[s.xCoordTab.length - 1] > s.xCoordTab[s.xCoordTab.length - 2] && s.yCoordTab[s.yCoordTab.length - 1] === s.yCoordTab[s.yCoordTab.length - 2])) ? direction : [-1, 0]
      if (key == 39) direction = (direction[0] === -1 || (s.xCoordTab[s.xCoordTab.length - 1] < s.xCoordTab[s.xCoordTab.length - 2] && s.yCoordTab[s.yCoordTab.length - 1] === s.yCoordTab[s.yCoordTab.length - 2])) ? direction : [1, 0]
      if (key == 38) direction = (direction[1] === 1 || (s.yCoordTab[s.yCoordTab.length - 1] > s.yCoordTab[s.yCoordTab.length - 2] && s.xCoordTab[s.xCoordTab.length - 1] === s.xCoordTab[s.xCoordTab.length - 2])) ? direction : [0, -1]
    }

    function trouverDsTab (tab, sTab) {
      for (let i = 0; i <= tab.length - sTab.length; i++) {
        for (let j = 0; j <= sTab.length - 1; j++) {
          if (tab[i + j] !== sTab[j]) break
          if (j === sTab.length - 1) return i
        }
      }
      return -1
    }

    function init () // créé le canvas vide
    {
      canvas = document.createElement('canvas')
      canvas.width = cWidth
      canvas.height = cHeight
      document.body.appendChild(canvas)

      ctx = canvas.getContext('2d') // On dessine en 2d dans notre canvas (c'est le "contexte" de dessin)

      direction = [1, 0]
      s = new Snake((lDiscret / 2) + 2 * lDiscret, (lDiscret / 2) + 2 * lDiscret, direction, 5)
      p = new Pomme(rPomme)
      p.dessinPomme()
      s.dessinSnake()
      window.setTimeout(function () { refreshCanvas(s, p) }, delay)
    }

    function refreshCanvas (snake, pomme) {
      snake.effaceSnake()
      snake.avancer(direction)
      if (mur(snake)) {
        alert('perdu, votre score est de ' + score)
        score = 0
        entree = new Array(0)
        document.body.removeChild(canvas)
        return
      }
      if (mangeQueue(snake)) {
        alert('perdu, votre score est de ' + score)
        score = 0
        entree = new Array(0)
        document.body.removeChild(canvas)
        return
      }
      if (mangePomme(snake, pomme)) {
        snake.xPomme.push(pomme.xCoord)
        snake.yPomme.push(pomme.yCoord)
        do {
          pomme = new Pomme(rPomme)
        } while (isInSnake(snake, pomme))
        score += 100
      }
      snake.grandir()
      pomme.dessinPomme()
      snake.dessinSnake()
      cmpt++
      if (cmpt < cmptM) setTimeout(function () { refreshCanvas(snake, pomme) }, delay)
    }

    function isInSnake (snake, pomme) {
      for (let i = 0; i < snake.xCoordTab.length; i++) {
        if (pomme.xCoord === snake.xCoordTab[i] && pomme.yCoord === snake.yCoordTab[i]) return true
      }
      return false
    }

    function mur (snake) {
      if ((snake.xCoordTab[snake.xCoordTab.length - 1] >= canvas.width) || (snake.xCoordTab[snake.xCoordTab.length - 1] <= 0) || (snake.yCoordTab[snake.yCoordTab.length - 1] >= canvas.height) || (snake.yCoordTab[snake.yCoordTab.length - 1] <= 0)) {
        return true
      } else return false
    }

    function mangeQueue (snake) {
      for (let i = 0; i < snake.xCoordTab.length - 1; i++) {
        if (snake.xCoordTab[snake.xCoordTab.length - 1] === snake.xCoordTab[i] && snake.yCoordTab[snake.yCoordTab.length - 1] === snake.yCoordTab[i]) return true
      }
      return false
    }
    function mangePomme (snake, pomme) {
      if (snake.xCoordTab[snake.xCoordTab.length - 1] === pomme.xCoord && snake.yCoordTab[snake.yCoordTab.length - 1] === pomme.yCoord) return true
      else return false
    }

    function Snake (x0, y0, direction0, l0) {
      this.xCoordTab = new Array(l0)
      this.yCoordTab = new Array(l0)
      this.EpaisSnake = lDiscret
      this.xPomme = new Array(0)
      this.yPomme = new Array(0)

      for (let i = 0; i < l0; i++) {
        this.xCoordTab[i] = x0 + i * lDiscret * direction0[0]
        this.yCoordTab[i] = y0 + i * lDiscret * direction0[1]
      }

      this.avancer = function (directionSnake) {
        for (let i = 0; i < this.xCoordTab.length - 1; i++) {
          this.xCoordTab[i] = this.xCoordTab[i + 1]
          this.yCoordTab[i] = this.yCoordTab[i + 1]
        }
        this.xCoordTab[this.xCoordTab.length - 1] += directionSnake[0] * lDiscret
        this.yCoordTab[this.yCoordTab.length - 1] += directionSnake[1] * lDiscret
      }

      this.grandir = function () {
        const tmpx = this.xCoordTab[0]
        const tmpy = this.yCoordTab[0]
        if (this.xPomme[0] === tmpx && this.yPomme[0] === tmpy) {
          this.xCoordTab.unshift(tmpx)
          this.yCoordTab.unshift(tmpy)
          this.xPomme.shift()
          this.yPomme.shift()
          return true
        }
        return false
      }

      this.dessinSnake = function () {
        ctx.fillStyle = '#ff0000'
        for (let i = 0; i < this.xCoordTab.length - 1; i++) {
          ctx.fillRect(this.xCoordTab[i] - (lDiscret / 2), this.yCoordTab[i] - (lDiscret / 2), lDiscret, lDiscret)
        }
        if (choix === 1) {
          ctx.drawImage(tonioSnake, this.xCoordTab[this.xCoordTab.length - 1] - (tonioSnake.width / 2), this.yCoordTab[this.yCoordTab.length - 1] - (tonioSnake.width / 2))
        }
        if (choix === 2) {
          ctx.drawImage(madSnake, this.xCoordTab[this.xCoordTab.length - 1] - (madSnake.width / 2), this.yCoordTab[this.yCoordTab.length - 1] - (madSnake.width / 2))
        }
      }

      this.effaceSnake = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
    function Pomme (rPomme) {
      this.rPomme = rPomme
      this.xCoord = (lDiscret / 2) + getRandomInt(0, (canvas.width / lDiscret)) * lDiscret
      this.yCoord = (lDiscret / 2) + getRandomInt(0, (canvas.height / lDiscret)) * lDiscret
      this.dessinPomme = function () {
        if (choix === 1) {
          ctx.drawImage(dofus, this.xCoord - (dofus.width / 2), this.yCoord - (dofus.width / 2))
        }
        if (choix === 2) {
          ctx.drawImage(bonbon, this.xCoord - (bonbon.width / 2), this.yCoord - (bonbon.width / 2))
        }
        /* ctx.fillStyle =  "#ff0000";
                ctx.beginPath();
                ctx.arc(this.xCoord,this.yCoord,this.rPomme,0,2*Math.PI);
                ctx.fill(); */
      }
    }

    function getRandomInt (min, max) {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min)) + min
    }
  }

  // init();
}
