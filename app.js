// inicial
let bodegas = [] 
let aspiradora = null
let stop_simulation = false
let speed = 200 //default

// cuando se haga clic en iniciar simulacion
// espera 1 segundo para iniciarla
document.getElementById("StartButton").addEventListener("click",()=>setTimeout(()=>main() , 1000))

//cambiar speed (1000 - 9*x)ms
document.getElementById("speedInput").addEventListener("change",e=> speed = 1000 - 9*parseInt(e.target.value) )

function getRandomState(){
    arr  = Object.values( new HabitacionState().allStates )
    let indiceAleatorio = Math.floor(Math.random() * arr.length);
    return arr[indiceAleatorio];
}

function Init(){
    const roomImgUrl = "./media/room.avif"
    const $hab1 = document.getElementById("Bodega1")
    const Bodega1 = new Habitacion(1 , 5, 5, $hab1, roomImgUrl )
    bodegas.push(Bodega1)
    
    const $hab2 = document.getElementById("Bodega2")
    const Bodega2 = new Habitacion(1 , 5, 5, $hab2, roomImgUrl)
    bodegas.push(Bodega2)
    
    const $hab3 = document.getElementById("Bodega3")
    const Bodega3 = new Habitacion(1 , 5, 5, $hab3, roomImgUrl )
    bodegas.push(Bodega3)
    
    const $hab4 = document.getElementById("Bodega4")
    const Bodega4 = new Habitacion(1 , 5, 5, $hab4, roomImgUrl)
    bodegas.push(Bodega4)
    
    const aspiradoraImg = "https://static.vecteezy.com/system/resources/previews/014/411/498/original/top-view-robot-vacuum-cleaner-icon-outline-style-vector.jpg" 
    const $asp = document.getElementById("aspiradora")
    
    aspiradora = new Aspiradora("aspiturbo", "Cheap Samsung",aspiradoraImg, $asp , 100 )
    aspiradora.start()

    Bodega1.state.setState( getRandomState() )
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
        $stateSpans[i].textContent = bodegas[i].state.actualState 
        bodegas[i].showTrashifExists("./media/trash1.webp")
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


function updateStatusInRooms(){
    // Hacer que las habitaciones cambien de estado cada que la aspiradora limpie un cuarto
}

async function  mainloop(){
    while(!stop_simulation){

        console.log("loop");
        updateAspiradoraStatusLabels()
        updateBodegasStatusLabels()
        
        await sleep(speed)
    }
}

function cleanHabitacion(HabitacionInstance){
    HabitacionInstance.state.setState(HabitacionInstance.state.allStates.clean)
}


function main(){
    Init()
    mainloop()


}
