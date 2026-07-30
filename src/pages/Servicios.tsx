import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import {
  CalendarClock,
  Package,
  Wrench,
  Car,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { useServices } from "@/hooks/useServices";

import { DataFilters } from "@/components/common/DataFilters";
import { useDataFilters } from "@/hooks/useDataFilters";

import { PageHeader } from "@/components/common/PageHeader";
import { StatsGrid } from "@/components/common/StatsGrid";
import { StatCard } from "@/components/common/StatCard";
import { DataTable } from "@/components/common/DataTable";

import { createServiceColumns } from "@/components/servicios/ServiceColumns";


const SORT_OPTIONS = [
  {
    value: "reciente",
    label: "Más reciente",
  },
  {
    value: "kilometraje",
    label: "Kilometraje",
  },
  {
    value: "proximo",
    label: "Próximo service",
  },
];


const FILTER_GROUPS = [
  {
    id: "estado",
    options: [
      {
        value: "todos",
        label: "Todos",
      },
      {
        value: "con-repuestos",
        label: "Con repuestos",
      },
      {
        value: "sin-repuestos",
        label: "Sin repuestos",
      },
    ],
  },
];


export function Servicios() {

  const navigate = useNavigate();


  const {
    services,
    loading,
    error,
    fetchServices,
  } = useServices();



  const {
    search,
    sortBy,
    activeFilters,
    filterProps,
  } = useDataFilters({

    defaultSort:"reciente",

    defaultFilters:{
      estado:"todos",
    },

  });



  useEffect(()=>{

    fetchServices();

  },[]);



  const columns = useMemo(
    ()=>


    createServiceColumns({

      onVerDetalle:(service)=>{

        navigate(
          `/trabajos/${service.trabajo_id}`
        );

      },

    }),


    [
      navigate
    ]

  );



  const servicesEsteMes = useMemo(()=>{

    const now = new Date();


    return services.filter(
      (service)=>{

        const fecha =
          new Date(
            service.created_at
          );


        return (
          fecha.getMonth() === now.getMonth()
          &&
          fecha.getFullYear() === now.getFullYear()
        );

      }

    ).length;


  },[services]);




  const totalRepuestos = useMemo(()=>{


    return services.reduce(
      (acc, service)=>{

        return (
          acc +
          (
            service.repuestos?.length ?? 0
          )
        );

      },
      0
    );


  },[services]);




  const proximosServices = useMemo(()=>{


    return services.filter(
      (service)=>
        service.proximo_service_km ||
        service.proxima_fecha_service
    ).length;


  },[services]);




  const filteredServices = useMemo(()=>{


    const q =
      search.toLowerCase();



    let result =
      services.filter(
        (service)=>{


          const vehiculo =
            service.trabajo?.vehiculo;


          const texto =
          `
          ${vehiculo?.marca ?? ""}
          ${vehiculo?.modelo ?? ""}
          ${vehiculo?.patente ?? ""}
          `;


          return texto
            .toLowerCase()
            .includes(q);

        }
      );




    const estado =
      activeFilters.estado ?? "todos";



    if(
      estado === "con-repuestos"
    ){

      result =
        result.filter(
          (service)=>
            service.repuestos &&
            service.repuestos.length > 0
        );

    }



    if(
      estado === "sin-repuestos"
    ){

      result =
        result.filter(
          (service)=>
            !service.repuestos ||
            service.repuestos.length === 0
        );

    }




    if(
      sortBy === "reciente"
    ){

      result =
        [...result].sort(
          (a,b)=>
            new Date(b.created_at).getTime()
            -
            new Date(a.created_at).getTime()
        );

    }



    if(
      sortBy === "kilometraje"
    ){

      result =
        [...result].sort(
          (a,b)=>
            (b.kilometraje_actual ?? 0)
            -
            (a.kilometraje_actual ?? 0)
        );

    }



    if(
      sortBy === "proximo"
    ){

      result =
        [...result].sort(
          (a,b)=>
            (a.proximo_service_km ?? Infinity)
            -
            (b.proximo_service_km ?? Infinity)
        );

    }



    return result;


  },[
    services,
    search,
    sortBy,
    activeFilters,
  ]);





  if(error){

    return (

      <div className="flex justify-center py-12">

        <p className="text-red-500">
          {error}
        </p>

      </div>

    );

  }




  if(
    loading &&
    services.length === 0
  ){

    return (

      <div className="flex justify-center py-12">

        <p className="text-muted-foreground">
          Cargando servicios...
        </p>

      </div>

    );

  }





  return (

    <div className="space-y-5">


      <PageHeader

        title="Servicios"

        description="Gestión de mantenimientos y servicios realizados"

      />



      <StatsGrid>


        <StatCard

          icon={
            <Wrench className="size-5"/>
          }

          iconClass="bg-blue-100 text-blue-700"

          label="Servicios"

          value={services.length}

          footer={`+${servicesEsteMes} este mes`}

        />



        <StatCard

          icon={
            <CalendarClock className="size-5"/>
          }

          iconClass="bg-green-100 text-green-700"

          label="Próximos"

          value={proximosServices}

          footer="Services programados"

        />



        <StatCard

          icon={
            <Package className="size-5"/>
          }

          iconClass="bg-violet-100 text-violet-700"

          label="Repuestos"

          value={totalRepuestos}

          footer="Utilizados"

          trend="neutral"

        />


      </StatsGrid>





      <DataFilters

        {...filterProps}

        searchPlaceholder="Buscar por vehículo o patente…"

        sortOptions={SORT_OPTIONS}

        filterGroups={FILTER_GROUPS}

      />





      {
        filteredServices.length === 0 && (

          <Card>

            <CardContent className="flex flex-col items-center justify-center py-16">


              <Car className="mb-4 size-14 text-slate-300"/>


              <h3 className="text-lg font-semibold">

                No se encontraron servicios

              </h3>


              <p className="mt-2 text-sm text-muted-foreground">

                No hay servicios registrados con esos filtros.

              </p>


            </CardContent>

          </Card>

        )
      }





      <DataTable

        data={filteredServices}

        columns={columns}

        getRowKey={
          (service)=>
            service.id
        }

        loading={loading}

        headerColorClass="text-blue-600"

        emptyTitle="No se encontraron servicios"

        emptyDescription="No hay servicios registrados."

        emptyIcon={
          <Wrench className="size-14 text-slate-300"/>
        }

      />


    </div>

  );

}