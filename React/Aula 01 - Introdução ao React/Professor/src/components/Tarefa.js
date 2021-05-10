import React from "react"

export default function Tarefa({id, slug, texto}){
  return (
    <div>
      <input className="tarefa" type="checkbox" id={slug}/>
      <label htmlFor={slug}>{texto}</label>
    </div>
  )
}