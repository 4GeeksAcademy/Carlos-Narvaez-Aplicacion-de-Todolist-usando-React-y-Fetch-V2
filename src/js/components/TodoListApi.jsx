import React, { useState, useEffect } from "react";

export const TodoListApi = () => {

    //estado (inicialmente esta vacio)
    const [lista, setLista] = useState([])
    const [tarea, setTarea] = useState("")


    //GUARDO LA URL EN UN ESPACIO DE MEMORIA
    const API_URL = "https://playground.4geeks.com/todo"

    const crearUsuario = () => {
        fetch(API_URL + "/users/CarlosN", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json()) //conviuerte la respuesta a un formato JSON
            .then(data => console.log(data))  //toma los datos para mostrar en la consola
            .catch(error => {
                console.error("Hubo un problema al crear el usuario", error); //imprimir el error en la consola para depurar
            })

    }

    const obtenerLista = () => {
        fetch(API_URL + "/users/CarlosN")
            .then((response) => {
                if (response.status === 404) {
                    crearUsuario()
                }
                return response.json()
            })
            .then(data => { setLista(data.todos) })  //toma los datos para mostrar en the array
            .catch(error => {
                console.error("Hubo un problema al obtener la lista de tareas", error); //imprimir el error en la consola para depurar
            })
    }

    //funcion que manda la tarea (POST)
    const crearTarea = async (text) => {
        try {
            const response = await fetch(API_URL + "/todos/CarlosN", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    label: text,
                    is_done: false
                })
            })

            if (!response.ok) {
                throw new Error(`Error ${response.status}: No se pudo crear la tarea`)
            }

            await response.json()
            obtenerLista() //Sincroniza con el backend tras agregar

        } catch (error) {
            console.error("Hubo un problema al crear la tarea", error);
        }
    }

    //funcion para eliminar una tarea (DELETE)
    const eliminarTarea = async (id) => {
        try {
            const response = await fetch(API_URL + "/todos/" + id, {
                method: "DELETE"
            })

            if (response.ok) {
                obtenerLista() //Sincroniza con el backend tras eliminar
            }
        } catch (error) {
            console.error("Error al eliminar la tarea", error);
        }
    }

    //funcion para limpiar todas las tareas
    const limpiarTareas = async () => {
        try {
            const response = await fetch(API_URL + "/users/CarlosN", {
                method: "DELETE"
            })

            if (response.ok) {
                setLista([]) //actualiza la lista vacía en el front-end
                crearUsuario() //asegura que el usuario exista de nuevo
            }
        } catch (error) {
            console.error("Error al limpiar la lista", error);
        }
    }

    //funcion para crear la tarea
    const inputtext = (e) => {
        if (e.key === "Enter" && tarea.trim() !== "") {
            crearTarea(tarea)
            setTarea("")
        }
    }

    useEffect(() => {
        obtenerLista()
    }, [])


    return (
        <div className="container mt-5" style={{ maxWidth: "500px" }}>
            <div className="card shadow-sm">
                <div className="card-body p-4">
                    <h1 className="text-center mb-4 display-6">Todo List Carlos</h1>

                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="¿Qué necesitas hacer hoy?"
                            onChange={(e) => setTarea(e.target.value)}
                            value={tarea}
                            onKeyDown={inputtext}
                        />
                    </div>

                    {/* condicional que muestra un texto o la lista */}
                    {lista.length === 0 ? (
                        <div className="alert alert-light text-center border mt-3" role="alert">
                            No hay tareas, añadir tareas
                        </div>
                    ) : (
                        <>
                            <ul className="list-group list-group-flush border rounded mt-3">
                                {lista.map((item) => (
                                    <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center py-3">
                                        <span>{item.label}</span>
                                        <button
                                            className="btn btn-outline-danger btn-sm border-0"
                                            onClick={() => eliminarTarea(item.id)}
                                        >
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <div className="d-flex justify-content-between align-items-center mt-3 p-2">
                                <small className="text-muted">{lista.length} tareas restantes</small>
                                <button
                                    className="btn btn-sm btn-link text-danger text-decoration-none"
                                    onClick={limpiarTareas}
                                >
                                    Limpiar todas
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
