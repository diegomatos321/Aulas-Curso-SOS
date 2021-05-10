import React from "react"
import "../main.css"

import lista from "../listaDeTarefas.json"
import Tarefa from "./Tarefa.js"

function Main(){
  const listaDeTarefas = lista.map(tarefa => tarefa);

  return(
    <main>
      {
        listaDeTarefas.map(tarefa => {
          // return <Tarefa tarefa={tarefa}/>
          return <Tarefa key={tarefa.id} {...tarefa}/>
        })
      }
    </main>
  )
}

export default Main;