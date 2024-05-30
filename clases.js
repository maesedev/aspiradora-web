"use strict"

const constans = {
    block : [10, 10],
    blockSideSize : 50, //pixels
    
}


class AspiradoraStates{
    constructor(){
        this.actualState = null
        this.States={
            standby:{
                message: "esperando instrucciones..."
            },
            cleaning: {
                message: "Limpiando...",
            },
            goingToChargeBase: {
                message: "Dirigiendose a la base de carga...",
            },
            changingRoom:{
                message:"moviendose de habitacion..."
            },
            powerOn:{
                message:"Iniciando aspiradora..."
            },
            
            powerOff:{
                message:"Aspiradora apagada"
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
        this.currentRoom = null

        this.nodeHtml = nodeHtml
        //set sprite
        nodeHtml.style.background = `url('${spriteImg}')`
        nodeHtml.style.backgroundSize = `cover`

        nodeHtml.style.height = constans.blockSideSize * 1.5 + "px" 
        nodeHtml.style.width = constans.blockSideSize * 1.5  + "px" 
    }

    //Iniciar los procesos de la aspiradora
    start(){
        this.state.setState("Iniciando Aspiradora...")
    }

    goToRoom(Habitacion){

        if( Habitacion.state.actualState ==  new HabitacionState().allStates.occupied){
            
            return false 
        }

        this.bateria -= 5

        this.currentRoom = Habitacion
        this.state.setState(this.state.States.changingRoom.message)

        let x = Habitacion.htmlNode.getBoundingClientRect().x + 40
        let y = 120


        this.nodeHtml.classList.remove("inChargeBase")

        this.nodeHtml.style.left = x + "px"
        this.nodeHtml.style.top = y + "px"

        return true

    }   

    goToChargeBase(){
        this.state.setState(new AspiradoraStates().States.goingToChargeBase)
        this.nodeHtml.classList.add("inChargeBase")
        this.nodeHtml.style.left = ""
        this.nodeHtml.style.top = ""

        let intervalo = setInterval(() => {
            this.bateria += 1
            if(this.bateria >= 5){
                clearInterval(intervalo)
            }
        }, 200);
    }   

    //detener los procesos de la aspiradora
    stop(){
        this.goToChargeBase()
        setTimeout( ()=>{
            this.state.setState(new AspiradoraStates().States.powerOff)
        },3000)
    }
    
    //Limpiar la basura que este en una habitacion
    clean(){
        this.bateria -= 20
        this.state.setState(new AspiradoraStates().States.cleaning.message)
        this.currentRoom.state.setState(this.currentRoom.state.allStates.clean)
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
    constructor( ){
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


        // set htmlNode width and height based on the constants
        htmlNode.style.width = blocksWidth * constans.blockSideSize + "px"
        htmlNode.style.height = blocksHeight * constans.blockSideSize + "px"
        
        // set trash image htmlnode
        this.trashHtmlNode = htmlNode.querySelector(".trash-img")

        //set sprite
        htmlNode.style.backgroundImage = `url('${spriteImg}')`
        htmlNode.style.backgroundSize = `cover`

        this.sprite = spriteImg
        this.htmlNode = htmlNode
        this.state = new HabitacionState()
    }
    showTrashifExists(trashUrl){
        if (this.state.actualState == this.state.allStates.dirty){
            this.trashHtmlNode.src = trashUrl
        }else{
            this.trashHtmlNode.src = ""

        }
    }
}

//cuando se limpia una habitacion y hay alguna ocupada pasa a estar sucia y desocupada
