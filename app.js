"use strict"

const constans = {
    block : [10, 10],
    blockSideSize : 50, //pixels
    
}


class AspiradoraStates{
    constructor(){
        this.actualState = null
        this.States={
            cleaning: {
                message: "Limpiando...",
            },
            changingRoom:{
                message:"moviendose de habitacion..."
            },
            powerOn:{
                message:"Iniciando aspiradora..."
            },
            
            powerOff:{
                message:"Apagando aspiradora..."
            },
            lowBattery:{
                message:"La bateria es baja..."
            },
        }
    }

    setState(newState){
        this.actualState = newState
    }
    getState(){
        return this.actualState
    }
}
class Aspiradora{
    constructor(Id, Marca, spriteImg , nodeHtml, bateriaInicial = 100){
        //Bateria inicial en el 100% por defecto
        this.bateria = bateriaInicial;
        
        this.x = 0
        this.y = 0
        this.Id = Id
        this.Marca = Marca
        this.state = new AspiradoraStates()

        //set sprite
        nodeHtml.style.background = `url('${spriteImg}')`
        nodeHtml.style.backgroundSize = `cover`

        nodeHtml.style.height = constans.blockSideSize * 1.5 + "px" 
        nodeHtml.style.width = constans.blockSideSize * 1.5  + "px" 
    }

    //Iniciar los procesos de la aspiradora
    start(){

    }

    //detener los procesos de la aspiradora
    stop(){

    }

    //Limpiar la basura que este en una habitacion
    clean(){

    }
    goToChargeBase(){

    }
    turnOn(){
        
    }
    turnOff(){
        
    }
    changeState(){

    }
}

class HabitacionState{
    constructor(){
        this.actualState = null
        this.allStates = {
            clean:"Habitacion limpia",
            dirty:"Habitacion sucia",
            occupied:"Habitacion ocupada"            
        }
    }

    getState(){
        return this.actualState
    }
    setState(newState){
        // una habitacion despues de estar ocupada debe quedar sucia
        if(this.actualState == this.allStates.occupied){

            this.actualState = this.allStates.dirty
        }else{
            this.actualState = newState
        }

    }
}

class Habitacion{
    constructor( Id, blocksWidth, blocksHeight , htmlNode , spriteImg ){
        this.Id = Id
        this.width = blocksWidth
        this.height = blocksHeight


        //set htmlNode width and height based on the constants
        htmlNode.style.width = blocksWidth * constans.blockSideSize + "px"
        htmlNode.style.height = blocksHeight * constans.blockSideSize + "px"
        
        //set sprite
        htmlNode.style.backgroundImage = `url('${spriteImg}')`
        htmlNode.style.backgroundSize = `cover`

        this.sprite = spriteImg
        this.htmlNode = htmlNode
        this.state = new HabitacionState()
    }
}



//cuando se limpia una habitacion y hay alguna ocupada pasa a estar sucia y desocupada


const roomImgUrl = "https://img.freepik.com/free-vector/top-view-living-room-house_107791-6102.jpg"
const $hab1 = document.getElementById("Bodega1")
const Bodega1 = new Habitacion(1 , 5, 5, $hab1, roomImgUrl )


const $hab2 = document.getElementById("Bodega2")
const Bodega2 = new Habitacion(1 , 5, 5, $hab2, roomImgUrl)


const $hab3 = document.getElementById("Bodega3")
const Bodega3 = new Habitacion(1 , 5, 5, $hab3, roomImgUrl )


const $hab4 = document.getElementById("Bodega4")
const Bodega4 = new Habitacion(1 , 5, 5, $hab4, roomImgUrl)



const aspiradoraImg = "https://static.vecteezy.com/system/resources/previews/014/411/498/original/top-view-robot-vacuum-cleaner-icon-outline-style-vector.jpg" 
const $asp = document.getElementById("aspiradora")
const aspiradora = new Aspiradora("aspiturbo", "Cheap Samsung",aspiradoraImg, $asp , 100 )
