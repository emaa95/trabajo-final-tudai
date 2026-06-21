import { SeccionGeneral } from "../nuevoTrabajo/SeccionGeneral";
import { SeccionSeguro } from "../nuevoTrabajo/SeccionSeguro";

export function PasoOrden({
  tipo,
  estado,
  prioridad,
  fecha_ingreso,
  asignadoA,
  aseguradoras,

  compania,
  numeroPoliza,
  numeroDenuncia,
  numeroSiniestro,
  montoAprobado,
  empleados,
  errors,

  setTipo,
  setEstado,
  setPrioridad,
  setFechaIngreso,

  setCompania,
  setNumeroPoliza,
  setNumeroDenuncia,
  setNumeroSiniestro,
  setMontoAprobado,
  setAsignadoA,

  clearError,
}: any) {
  return (
    <>
      <SeccionGeneral
        tipo={tipo}
        estado={estado}
        prioridad={prioridad}
        fechaIngreso={fecha_ingreso}
        asignadoA={asignadoA}
        empleados={empleados}
        onTipoChange={(value) => {
          if (!value) return;
          setTipo(value);
        }}
        onEstadoChange={(value) => {
          if (!value) return;
          setEstado(value);
        }}
        onPrioridadChange={(value) => {
          if (!value) return;
          setPrioridad(value);
        }}
        onFechaIngresoChange={setFechaIngreso}
        onAsignadoAChange={setAsignadoA}
      />

      {tipo === "Seguro" && (
        <SeccionSeguro
          aseguradoras={aseguradoras}
          compania={compania}
          numero_poliza={numeroPoliza}
          numero_denuncia={numeroDenuncia}
          numero_siniestro={numeroSiniestro}
          monto_aprobado={montoAprobado}
          errors={errors}
          onCompaniaChange={(value) => {
            if (!value) return;

            setCompania(value);
            clearError("compania");
          }}
          onNumeroPolizaChange={setNumeroPoliza}
          onNumeroDenunciaChange={setNumeroDenuncia}
          onNumeroSiniestroChange={(value) => {
            setNumeroSiniestro(value);
            clearError("numero_siniestro");
          }}
          onMontoAprobadoChange={setMontoAprobado}
        />
      )}
    </>
  );
}