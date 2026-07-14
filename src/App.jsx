import React, { useState, useEffect } from 'react';
import './App.css'; // Vinculación directa con tu archivo de estilos CSS

function App() {
  // Estado para la lista de elementos (Carga desde LocalStorage si ya existe información guardada)
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('crud_items');
    return saved ? JSON.parse(saved) : [];
  });

  // Estados para controlar el texto escrito y el ID del elemento en edición
  const [inputValue, setInputValue] = useState('');
  const [editId, setEditId] = useState(null);

  // Guardar automáticamente en LocalStorage cada vez que se agregue, edite o elimine un elemento
  useEffect(() => {
    localStorage.setItem('crud_items', JSON.stringify(items));
  }, [items]);

  // FUNCIÓN: Guardar elemento (Crear o Editar con Validaciones Estrictas)
  const handleSave = () => {
    const cleanText = inputValue.trim();

    // 1. Validación: Campos vacíos o con puros espacios en blanco
    if (!cleanText || cleanText === '') {
      alert('⚠️ Error: No puedes ingresar un elemento vacío o compuesto solo de espacios.');
      return;
    }

    // 2. Validación: Campos mal ingresados (ej. texto extremadamente corto de menos de 3 letras)
    if (cleanText.length < 3) {
      alert('⚠️ Error: El texto ingresado es demasiado corto (mínimo debe tener 3 caracteres).');
      return;
    }

    // 3. Validación: No permitir que la entrada sea puramente numérica
    const onlyNumbersRegex = /^\d+$/;
    if (onlyNumbersRegex.test(cleanText)) {
      alert('⚠️ Error: El elemento no puede estar compuesto únicamente por números. Agrega texto descriptivo.');
      return;
    }

    // 4. Validación: Bloquear caracteres especiales sospechosos o peligrosos para evitar errores de renderizado o seguridad
    const specialCharsRegex = /[<>"/\\;{}]/;
    if (specialCharsRegex.test(cleanText)) {
      alert('⚠️ Error: No se permiten caracteres especiales como < > " / \\ ; { }');
      return;
    }

    // Guardado de datos tras superar los filtros de validación
    if (editId !== null) {
      // Modo Edición: Actualizar elemento existente
      setItems(items.map(item => item.id === editId ? { ...item, text: cleanText } : item));
      setEditId(null);
    } else {
      // Modo Creación: Añadir nuevo elemento a la lista
      const newItem = {
        id: Date.now(),
        text: cleanText,
        completed: false
      };
      setItems([...items, newItem]);
    }

    setInputValue(''); // Limpiar el input tras la operación
  };

  // FUNCIÓN: Activar el modo de edición llenando el input con el texto seleccionado
  const handleStartEdit = (item) => {
    setInputValue(item.text);
    setEditId(item.id);
  };

  // FUNCIÓN: Cancelar la edición y limpiar el input
  const handleCancelEdit = () => {
    setInputValue('');
    setEditId(null);
  };

  // FUNCIÓN: Eliminar elemento con una alerta de confirmación del navegador antes de borrar
  const handleDelete = (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este elemento de la lista?');
    if (confirmDelete) {
      setItems(items.filter(item => item.id !== id));
      // Si eliminamos el elemento que estábamos editando, cancelamos la edición automáticamente
      if (editId === id) {
        setEditId(null);
        setInputValue('');
      }
    }
  };

  return (
    <div className="card-container">
      
      {/* Título de la aplicación */}
      <h1 className="title">Mi CRUD</h1>
      
      {/* Formulario de Entrada */}
      <div className="form-group">
        <input 
          type="text" 
          className="input-field" 
          placeholder={editId !== null ? "Modificando elemento..." : "Escribe un elemento..."} 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()} // Permite guardar al pulsar Enter
        />
        <button className="btn-submit" onClick={handleSave}>
          {editId !== null ? 'Actualizar' : 'Agregar'}
        </button>
        {editId !== null && (
          <button className="btn-action btn-cancel" onClick={handleCancelEdit}>
            Cancelar
          </button>
        )}
      </div>

      {/* CONTADOR DE ELEMENTOS: Dinámico y actualizado en tiempo real */}
      <div className="counter-container">
        <p className="counter-text">Total de elementos: <strong>{items.length}</strong></p>
      </div>

      {/* Lista de Elementos */}
      <ul className="item-list">
        {items.length === 0 ? (
          <p className="empty-message">No hay elementos en la lista. ¡Comienza agregando uno!</p>
        ) : (
          items.map((item) => (
            <li className="list-item" key={item.id}>
              <span className="item-text">{item.text}</span>
              
              <div className="action-buttons">
                {/* Botón de Editar — Color Verde Obligatorio */}
                <button 
                  className="btn-action btn-edit" 
                  onClick={() => handleStartEdit(item)}
                >
                  Editar
                </button>
                
                {/* Botón de Eliminar — Color Rojo Obligatorio */}
                <button 
                  className="btn-action btn-delete" 
                  onClick={() => handleDelete(item.id)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

    </div>
  );
}

export default App;