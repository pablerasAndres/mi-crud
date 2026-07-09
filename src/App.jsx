import React from 'react';
import './App.css'; // <-- 1. IMPORTANTE: Esto vincula el CSS

function App() {
  // ... Aquí mantén tus estados actuales (useState) y funciones (agregar, eliminar, editar) ...

  return (
    // 2. Contenedor de la Tarjeta Central
    <div className="card-container">
      
      {/* Título */}
      <h1 className="title">Mi CRUD</h1>
      
      {/* Formulario */}
      <div className="form-group">
        <input 
          type="text" 
          className="input-field" 
          placeholder="Escribe un elemento..." 
          // value={...} 
          // onChange={...}
        />
        <button className="btn-submit">Agregar</button>
      </div>

      {/* Lista de elementos */}
      <ul className="item-list">
        
        {/* RECUERDA: Si usas un .map(), renderiza esto por cada elemento */}
        <li className="list-item">
          <span className="item-text">Elemento de ejemplo</span>
          
          {/* Contenedor de botones a la derecha */}
          <div className="action-buttons">
            {/* Botón Verde para Editar */}
            <button className="btn-action btn-edit">Editar</button>
            
            {/* Botón Rojo para Eliminar */}
            <button className="btn-action btn-delete">Eliminar</button>
          </div>
        </li>

      </ul>

    </div>
  );
}

export default App;