import { create } from "zustand";

import {
  createTareaService,
  updateTareaService,
  deleteTareaService,
} from "@/services/tareaService";

import type {
  Tarea,
  CreateTareaPayload,
} from "@/types";


interface TareaStore {

  loading: boolean;

  error: string | null;


  addTarea: (
    payload: CreateTareaPayload
  ) => Promise<Tarea>;


  updateTarea: (
    id: string,
    payload: Partial<Tarea>
  ) => Promise<Tarea>;


  removeTarea: (
    id: string
  ) => Promise<void>;


  clearError: () => void;

}



export const tareaStore = create<TareaStore>((set) => ({

  loading: false,

  error: null,


  // =========================
  // CREATE
  // =========================

  async addTarea(payload) {

    set({
      loading: true,
      error: null,
    });


    try {

      const tarea =
        await createTareaService(
          payload
        );


      set({
        loading: false,
      });


      return tarea;


    } catch(error) {


      const message =
        error instanceof Error
          ? error.message
          : "Error al crear tarea";


      set({
        loading: false,
        error: message,
      });


      throw error;

    }

  },



  // =========================
  // UPDATE
  // =========================

  async updateTarea(
    id,
    payload
  ) {

    set({
      loading: true,
      error: null,
    });


    try {

      const tarea =
        await updateTareaService(
          id,
          payload
        );


      set({
        loading: false,
      });


      return tarea;


    } catch(error) {


      const message =
        error instanceof Error
          ? error.message
          : "Error al actualizar tarea";


      set({
        loading: false,
        error: message,
      });


      throw error;

    }

  },



  // =========================
  // DELETE
  // =========================

  async removeTarea(id) {

    set({
      loading: true,
      error: null,
    });


    try {

      await deleteTareaService(
        id
      );


      set({
        loading: false,
      });


    } catch(error) {


      const message =
        error instanceof Error
          ? error.message
          : "Error al eliminar tarea";


      set({
        loading: false,
        error: message,
      });


      throw error;

    }

  },



  // =========================
  // UTIL
  // =========================

  clearError() {

    set({
      error: null,
    });

  },


}));