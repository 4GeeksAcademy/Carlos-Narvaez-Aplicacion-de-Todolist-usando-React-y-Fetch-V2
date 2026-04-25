import React, { useState, useEffect } from "react";

export const TodoListApi = () => {
    const [lista, setLista] = useState([]);
    const [tarea, setTarea] = useState("");

    const API_URL = "https://playground.4geeks.com/todo";
    const USER = "carlosn"; 

    const cargarTareas = async () => {
        try {
            const resp = await fetch(`${API_URL}/users/${USER}`);
            if (resp.status === 404) {
                await crearUsuario();
                return;
            }
            const data = await resp.json();
            setLista(data.todos || []);
        } catch (error) {
            console.error("Error al cargar:", error);
        }
    };

    const crearUsuario = async () => {
        try {
            const resp = await fetch(`${API_URL}/users/${USER}`, { method: "POST" });
            if (resp.ok) cargarTareas();
        } catch (error) {
            console.error("Error al crear usuario:", error);
        }
    };

    const añadirTarea = async (e) => {
        if (e.key === "Enter" && tarea.trim() !== "") {
            try {
                const resp = await fetch(`${API_URL}/todos/${USER}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ label: tarea, is_done: false })
                });
                if (resp.ok) {
                    setTarea(""); 
                    cargarTareas(); 
                }
            } catch (error) {
                console.error("Error al añadir:", error);
            }
        }
    };

    const borrarTarea = async (id) => {
        try {
            const resp = await fetch(`${API_URL}/todos/${id}`, { method: "DELETE" });
            if (resp.ok) cargarTareas();
        } catch (error) {
            console.error("Error al borrar:", error);
        }
    };

    // 5. NUEVA FUNCIÓN: BORRAR TODO EL USUARIO (Y sus tareas)
    const limpiarTodo = async () => {
        try {
            const resp = await fetch(`${API_URL}/users/${USER}`, { method: "DELETE" });
            if (resp.ok) {
                setLista([]); // Limpia el estado local
                await crearUsuario(); // Recrea el usuario para que la API esté lista de nuevo
            }
        } catch (error) {
            console.error("Error al limpiar:", error);
        }
    };

    useEffect(() => { cargarTareas(); }, []);

    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
            <h3 className="text-center">Todo API Carlos</h3>
            <input
                type="text"
                className="form-control mb-3"
                placeholder="Presiona Enter para añadir"
                value={tarea}
                onChange={(e) => setTarea(e.target.value)}
                onKeyDown={añadirTarea}
            />
            <ul className="list-group">
                {lista.length > 0 ? (
                    lista.map((t) => (
                        <li key={t.id} className="list-group-item d-flex justify-content-between align-items-center">
                            {t.label}
                            <button className="btn btn-sm btn-outline-danger" onClick={() => borrarTarea(t.id)}>
                                <i className="fas fa-trash"></i> &times;
                            </button>
                        </li>
                    ))
                ) : (
                    <li className="list-group-item text-muted text-center">No hay tareas, añade una.</li>
                )}
            </ul>
            
            {/* Botón de limpiar todo */}
            {lista.length > 0 && (
                <button className="btn btn-danger btn-sm w-100 mt-3" onClick={limpiarTodo}>
                    Limpiar todas las tareas
                </button>
            )}
        </div>
    );
};

