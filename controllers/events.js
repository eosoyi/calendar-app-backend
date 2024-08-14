const express = require("express");
const Evento = require("../models/Events");

const getEventos = async (req, res = express.response) => {
  const eventos = await Evento.find().populate("user", "name");
  res.status(201).json({
    ok: true,
    eventos,
  });
};

const crearEvento = async (req, res = express.response) => {
  const evento = new Evento(req.body);
  try {
    evento.user = req.uid;
    const response = await evento.save();

    return res.status(201).json({
      ok: true,
      evento: response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      message: "Hable con el administrador",
    });
  }
};

const actualizarEvento = async (req, res = express.response) => {
  try {
    const eventoId = req.params.id;
    const uid = req.uid;
    const evento = await Evento.findById(eventoId);

    // validamos si el evento existe
    if (!evento) {
      return res.status(404).json({
        ok: false,
        message: "Evento no existe con ese id",
      });
    }

    // validamos si la persona que ecreo el evento es la misma que lo desea actualizar
    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        message: "No tiene permisos para realizar esta accion",
      });
    }
    const nuevoEvento = {
      ...req.body,
      user: uid,
    };

    const eventoActualizado = await Evento.findByIdAndUpdate(
      eventoId,
      nuevoEvento,
      {
        new: true,
      }
    );

    res.status(200).json({
      ok: true,
      evento: eventoActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      message: "Hable con el administrador",
    });
  }
};

const eliminarEvento = async (req, res = express.response) => {
  const eventoId = req.params.id;
  const uid = req.uid;
  try {
    const evento = await Evento.findById(eventoId);

    // validamos si el evento existe
    if (!evento) {
      return res.status(404).json({
        ok: false,
        message: "Evento no existe con ese id",
      });
    }

    // validamos si la persona que ecreo el evento es la misma que lo desea actualizar
    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        message: "No tiene permisos para realizar esta accion",
      });
    }

    await Evento.findByIdAndDelete(eventoId);

    return res.status(200).json({
      ok: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      message: "Hable con el administrador",
    });
  }
};

module.exports = {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
};
