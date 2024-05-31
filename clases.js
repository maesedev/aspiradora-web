"use strict"

const constans = {
    block : [10, 10],
    blockSideSize : 50, //pixels
}


class AspiradoraStates{
    constructor(){
        this.actualState = null
        this.States={
            standby:"esperando instrucciones...",
            cleaning: "Limpiando...",
            goingToChargeBase: "Dirigiendose a la base de carga...",
            changingRoom:"moviendose de habitacion...",
            powerOn:"Iniciando aspiradora...",
            powerOff:"Aspiradora apagada",
            lowBattery:"La bateria es baja...",
            charging: "Aspiradora cargandose"
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

        // coordenadas de la base de carga
        this.chargeBase = [null, null]
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
        
        console.log("Moviendose de habitacion");
        //Si la habitacion esta ocupada, devuelve false
        if( Habitacion.state.actualState ==  new HabitacionState().allStates.occupied){
            console.log("Oops abitacion ocupada");
            return false 
        }

        if(this.bateria < 5){
            this.goToChargeBase()
            return false
        }

        this.reduceBatery(5)

        this.currentRoom = Habitacion

        this.state.setState(this.state.States.changingRoom)

        const RoomX = this.currentRoom.htmlNode.getBoundingClientRect().x
        const HalfRoomWidth = this.currentRoom.htmlNode.clientWidth / 2
        const HalfAspiradoraWidth = this.nodeHtml.clientWidth / 2
        // posicionar la aspiradora exactamente en el centro (en el eje x) de la habitacion

        let x = (RoomX + HalfRoomWidth) - HalfAspiradoraWidth - this.chargeBase[0]

        this.x = x
        this.y = -180 
        this.nodeHtml.classList.remove("inChargeBase")

        this.nodeHtml.style.translate = `${x}px ${this.y}px`

        return true

    }   


    goToChargeBase(){
        console.log("dirigiendose a la base de carga");
        this.currentRoom = null
        this.state.setState(new AspiradoraStates().States.goingToChargeBase)
        
        this.addBatery(100)

        this.x = 0
        this.y = 0
        this.nodeHtml.style.translate = "0 0"
        
    }   

    //detener los procesos de la aspiradora
    stop(){
        this.currentRoom = null
        this.goToChargeBase()
        setTimeout( ()=>{
            this.state.setState(new AspiradoraStates().States.powerOff)
        },3000)
    }
    
    //Limpiar la basura que este en una habitacion
    cleanRoom(){
        console.log("Cleaning");

        if(this.bateria < 20){
            this.goToChargeBase()
            return
        }

        this.reduceBatery(20)
        this.state.setState(new AspiradoraStates().States.cleaning)
        this.currentRoom.state.setState(this.currentRoom.state.allStates.clean)
    }

    reduceBatery(cant){
        let final = this.bateria - cant 

        let intervalo = setInterval(() => {
            this.bateria -= 1

            if(this.bateria <= 0){
                this.bateria = 0
                clearInterval(intervalo)
            }
            
            if(this.bateria == final){
                clearInterval(intervalo)
            }

        }, 200/cant);
    }

    addBatery(cant){

        let final = this.bateria + cant
        
        this.state.setState(new AspiradoraStates().States.charging)
        let intervalo = setInterval(() => {
            this.bateria += 1


            if(this.bateria == final || this.bateria > 99){
                clearInterval(intervalo)
            }
            if(this.bateria>100){
                this.bateria=100

            }
        }, 1000 / (cant / 3) );
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
        this.imgHtmlNode = htmlNode.querySelector(".trash-img")

        //set sprite
        htmlNode.style.backgroundImage = `url('${spriteImg}')`
        htmlNode.style.backgroundSize = `cover`

        this.sprite = spriteImg
        this.htmlNode = htmlNode
        this.state = new HabitacionState()
    }
    showTrashifExists(trashUrl){
        if (this.state.getState() == this.state.allStates.dirty){
            this.imgHtmlNode.src = trashUrl
        }
    }

    lock(lockUrl){
        this.imgHtmlNode.src = lockUrl
        this.htmlNode.style.filter = "brightness(.4)"
    }
    unlock(){
        this.imgHtmlNode.src = ""
        this.htmlNode.style.filter = ""
    }
}

//cuando se limpia una habitacion y hay alguna ocupada pasa a estar sucia y desocupada
