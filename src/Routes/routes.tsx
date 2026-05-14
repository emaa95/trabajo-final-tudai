import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { Home } from "../pages/Home";
import { Trabajos } from "../pages/Trabajos";
import { TrabajoForm } from "@/components/trabajos/NuevoTrabajo";
import { Empleados } from "@/pages/Empleados";
import { Seguros } from "@/pages/Seguros";
import { Vehiculos } from "@/pages/Vehiculos";
import { Clientes } from "@/pages/Clientes";

const router = createBrowserRouter([
    {
        path: "/" ,
        element: <Layout/>,
        children: [
            {
                index: true, 
                element: <Home/>
            },
            {
                path: "/trabajos",
                element:<Trabajos/>
        
            },
            {
                path:"/trabajos/nuevo",
                element: <TrabajoForm/>
            },
            {
                path:"/empleados",
                element:<Empleados/>
            },
            {
                path:"/seguros",
                element:<Seguros/>
            },
            {
                path:"/vehiculos",
                element:<Vehiculos/>
            },
            {
                path:"/clientes",
                element:<Clientes/>
            }
        ]
    },
   
])

export default router;