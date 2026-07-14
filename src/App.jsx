import { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('crud_items_c3');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [inputValue, setInputValue] = useState('');
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem('crud_items_c3', JSON.stringify(items));
  }, [items]);

  const handleSave = () => {
    const cleanText = inputValue.trim();

    if (!cleanText || cleanText === '') {
      alert('⚠️ Error: No puedes ingresar un elemento vacío.');
      return;
    }

    if (editId !== null) {
      setItems(items.map(item => item.id === editId ? { ...item, text: cleanText } : item));
      setEditId(null);
    } else {
      const newItem = {
        id: Date.now() + Math.random(),
        text: cleanText,
        completed: false
      };
      setItems([...items, newItem]);
    }
    setInputValue('');
  };

  const handleStartEdit = (e, item) => {
    e.stopPropagation();
    setInputValue(item.text);
    setEditId(item.id);
  };

  const handleCancelOrClear = () => {
    setInputValue('');
    setEditId(null);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    const confirmDelete = window.confirm('¿De verdad quieres eliminar este elemento?');
    if (confirmDelete) {
      setItems(items.filter(item => item.id !== id));
      if (editId === id) {
        setEditId(null);
        setInputValue('');
      }
    }
  };

  const toggleComplete = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleClearCompleted = () => {
    const confirmClear = window.confirm('¿De verdad quieres eliminar únicamente los elementos seleccionados (completados)?');
    if (confirmClear) {
      setItems(items.filter(item => !item.completed));
    }
  };

  const handleClearAll = () => {
    const confirmClear = window.confirm('⚠️ ¿Estás seguro de que quieres borrar TODOS los elementos? Esta acción no se puede deshacer.');
    if (confirmClear) {
      setItems([]);
      setInputValue('');
      setEditId(null);
    }
  };

  const filteredItems = items.filter(item => 
    item.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = items.length;
  const completedItems = items.filter(i => i.completed).length;

  return (
    <div className="card-container">
      <h1 className="title">Mi CRUD</h1>

      {totalItems > 0 && (
        <div className="search-group">
          <input 
            type="text"
            className="search-field"
            placeholder="🔍 Buscar elemento en la lista..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}
      
      <div className="form-group">
        <input 
          type="text" 
          className="input-field" 
          placeholder={editId !== null ? "Editando..." : "Escribe un nuevo elemento..."} 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
        />
        <button className="btn-submit" onClick={handleSave}>
          {editId !== null ? 'Actualizar' : 'Agregar'}
        </button>
        {(editId !== null || inputValue.length > 0) && (
          <button className="btn-action btn-cancel" onClick={handleCancelOrClear}>
            Cancelar
          </button>
        )}
      </div>

      <div className="counter-container">
        <span>Total: <strong>{totalItems}</strong></span>
        <span>Completados: <strong style={{color: '#10b981'}}>{completedItems}</strong></span>
      </div>

      <ul className="item-list">
        {filteredItems.length === 0 ? (
          <p className="empty-message">
            {totalItems === 0 
              ? "No hay elementos creados. ¡Agrega uno!" 
              : "No se encontraron resultados para tu búsqueda."}
          </p>
        ) : (
          filteredItems.map((item) => (
            <li key={item.id} className={`list-item ${item.completed ? 'completed' : ''}`}>
              <div className="item-content" onClick={() => toggleComplete(item.id)}>
                <input 
                  type="checkbox" 
                  className="checkbox" 
                  checked={item.completed} 
                  readOnly 
                />
                <span className={`item-text ${item.completed ? 'line-through' : ''}`}>
                  {item.text}
                </span>
              </div>

              <div className="action-buttons">
                <button className="btn-action btn-edit" onClick={(e) => handleStartEdit(e, item)}>
                  Editar
                </button>
                <button className="btn-action btn-delete" onClick={(e) => handleDelete(item.id, e)}>
                  Eliminar
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      {totalItems > 0 && (
        <div className="footer-buttons">
          {completedItems > 0 && (
            <button className="btn-clear-completed" onClick={handleClearCompleted}>
              Borrar seleccionados
            </button>
          )}
          <button className="btn-clear-all" onClick={handleClearAll}>
            Borrar todos
          </button>
        </div>
      )}
    </div>
  );
}