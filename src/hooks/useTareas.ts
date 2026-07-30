import { tareaStore } from "@/store/tareaStore";


export function useTareas() {

  return {

    loading:
      tareaStore(
        (state) =>
          state.loading
      ),


    error:
      tareaStore(
        (state) =>
          state.error
      ),


    addTarea:
      tareaStore(
        (state) =>
          state.addTarea
      ),


    updateTarea:
      tareaStore(
        (state) =>
          state.updateTarea
      ),


    removeTarea:
      tareaStore(
        (state) =>
          state.removeTarea
      ),


    clearError:
      tareaStore(
        (state) =>
          state.clearError
      ),

  };

}