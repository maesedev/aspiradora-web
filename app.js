"use strict"
// inicial
let habitaciones = [] 
let aspiradora = null
let stop_simulation = false
let loopSpeed = 1000 //default

// cuando se haga clic en iniciar simulacion
// espera 1 segundo para iniciarla
document.getElementById("StartButton").addEventListener("click",()=>setTimeout(()=>main() , 1000))

//cambiar loopSpeed (1000 - 9*x)ms
document.getElementById("speedInput").addEventListener("change",e=> loopSpeed = 3000 - 9*parseInt(e.target.value) )

function getRandomState(){
    let allStates  = new HabitacionState().allStates
    const randm = Math.random()

    if(randm > .6) return allStates.dirty
    if(randm < .6 && randm > .2) return allStates.occupied
    else return allStates.clean
}


function detectDirtyRooms(){
    return habitaciones.filter(hab => hab.state.actualState == hab.state.allStates.dirty)
}

function vacateBussyRooms(){
    for(habitacion of habitaciones){
        if(habitacion.state.actualState ==  new HabitacionState().allStates.occupied ){
            habitacion.state.setState(new HabitacionState().allStates.dirty)
        }
    }
}

function Init(){
    habitaciones = []
    const roomImgUrl = "./media/room.avif"
    const $hab1 = document.getElementById("Bodega1")
    const Bodega1 = new Habitacion(1 , 5, 5, $hab1, roomImgUrl )
    habitaciones.push(Bodega1)
    
    const $hab2 = document.getElementById("Bodega2")
    const Bodega2 = new Habitacion(1 , 5, 5, $hab2, roomImgUrl)
    habitaciones.push(Bodega2)
    
    const $hab3 = document.getElementById("Bodega3")
    const Bodega3 = new Habitacion(1 , 5, 5, $hab3, roomImgUrl )
    habitaciones.push(Bodega3)
    
    const $hab4 = document.getElementById("Bodega4")
    const Bodega4 = new Habitacion(1 , 5, 5, $hab4, roomImgUrl)
    habitaciones.push(Bodega4)
    
    const aspiradoraImg = "https://static.vecteezy.com/system/resources/previews/014/411/498/original/top-view-robot-vacuum-cleaner-icon-outline-style-vector.jpg" 
    const $asp = document.getElementById("aspiradora")
    
    aspiradora = new Aspiradora("aspiturbo", "Cheap Samsung",aspiradoraImg, $asp , 50 )
    aspiradora.start()
    const aspiradoraLoc = aspiradora.nodeHtml.getBoundingClientRect()
    aspiradora.chargeBase = [aspiradoraLoc.x , aspiradoraLoc.y]


    Bodega1.state.setState( getRandomState() )
    console.log( Bodega1.state.getState() );
    Bodega2.state.setState( getRandomState() )
    Bodega3.state.setState( getRandomState() )
    Bodega4.state.setState( getRandomState() )


}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function updateBodegasStatusLabels(){
    let $stateSpans= [
        document.getElementById("Bodega1-state"),
        document.getElementById("Bodega2-state"),
        document.getElementById("Bodega3-state"),
        document.getElementById("Bodega4-state"),
    ]

    // muestra basura si tiene basura
    for (let i = 0; i < $stateSpans.length; i++) {

        if(habitaciones[i].state.actualState == new HabitacionState().allStates.occupied){
            habitaciones[i].lock("./media/lock.webp")
        }else{
            habitaciones[i].unlock()

        }

        $stateSpans[i].textContent = habitaciones[i].state.actualState
        habitaciones[i].showTrashifExists("./media/trash1.webp")


        
    }
}
  
function updateAspiradoraStatusLabels(){
    let $stateSpans= {
        $marca  : document.getElementById("marcaAspiradoraSpan"),
        $batery : document.getElementById("bateryAspiradoraSpan"),
        $state  : document.getElementById("stateAspiradoraSpan"),
        $x      : document.getElementById("xAspiradoraSpan"),
        $y      : document.getElementById("yAspiradoraSpan"),
    }   

    $stateSpans.$marca.textContent = aspiradora.Marca
    $stateSpans.$batery.textContent = aspiradora.bateria
    $stateSpans.$state.textContent = aspiradora.state.actualState
    $stateSpans.$x.textContent = aspiradora.x
    $stateSpans.$y.textContent = aspiradora.y

    
}


function getOccupiedRooms(){
    return habitaciones.filter(hab => hab.state.actualState == hab.state.allStates.occupied)
}

function updateStatusInRooms(){
    // Hacer que las habitaciones cambien de estado cada que la aspiradora limpie un cuarto
    getOccupiedRooms().forEach(room => {
        if(Math.random() < .4) room.state.setState( new HabitacionState().allStates.dirty )
        if(Math.random() < .4) room.state.setState( new HabitacionState().allStates.occupied)
    });

    // ocupar habitaciones aleatoriamente si no esta la aspiradora adentro
    habitaciones.forEach(room => {
        if(aspiradora.currentRoom != room){
            if(Math.random() < .4) room.state.setState( new HabitacionState().allStates.occupied)
        }
    });
}


function CountDirtyRooms(){
    return habitaciones.filter(habitacion => habitacion.state.actualState == new HabitacionState().allStates.dirty ).length
}

async function mainloop(){
    
    let updateAspiradoraStatusLabelsInterval = setInterval( ()=>{
        updateAspiradoraStatusLabels()
        updateBodegasStatusLabels()
    } ,180)

    while(!stop_simulation){
        //console.log("loop");

        
        if(aspiradora.state.actualState == new AspiradoraStates().States.charging && aspiradora.bateria < 100   ){
            await sleep(50)
            updateAspiradoraStatusLabels()
            continue
        }
        
        await sleep(loopSpeed)

        aspiradora.nodeHtml.style.transition = `all  ease-out ${loopSpeed}ms`


        // CASO BASE:
        // Si ya estan todas limpias nos muestra el mensaje de que ya todas estas limpias
        if(CountDirtyRooms() == 0 ){
            aspiradora.goToChargeBase()
            aspiradora.state.setState(new AspiradoraStates().States.powerOff)
            updateStatusInRooms()
        }

        for( let habitacion of detectDirtyRooms() ){

            if(aspiradora.bateria < 20 ){
                aspiradora.goToChargeBase()
                break
            }
            
            const goToRoomResponse = aspiradora.goToRoom(habitacion)

            await sleep(loopSpeed)
            
            if(goToRoomResponse){
                aspiradora.state.setState(new AspiradoraStates().States.searchingTrash)
                await sleep(loopSpeed)
                aspiradora.state.setState(new AspiradoraStates().States.trashFond)
                await sleep(loopSpeed)
                updateStatusInRooms()
                aspiradora.cleanRoom()
                await sleep(loopSpeed)
            }


            updateStatusInRooms()

        }

    }
    clearInterval(updateAspiradoraStatusLabelsInterval)

}

function cleanHabitacion(HabitacionInstance){
    HabitacionInstance.state.setState(HabitacionInstance.state.allStates.clean)
}


function main(){

    
    sleep(2000)

    Init()
    mainloop()

}
