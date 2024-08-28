const express = require("express");
const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res = express.response) => {
  const { name, email, password } = req.body;

  try {
    // realizamos una busqueda a la db para buscar un usuario existente con el correo ingresado
    let usuario = await Usuario.findOne({ email });

    // si existe algun registro lanzamos un error
    if (usuario) {
      res.status(400).json({
        ok: false,
        message: "Ya existe un usuario con este correo.",
      });
    }

    usuario = new Usuario(req.body);
    // encriptamos la password
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    await usuario.save();

    // generamos nuestro token
    const token = await generarJWT(usuario.id, usuario.name);

    res.status(201).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      message: "Por favor hable con el administrador.",
    });
  }
};

const loginUsuarios = async (req, res = express.response) => {
  const { email, password } = req.body;

  try {
    // realizamos una busqueda a la db para buscar un usuario existente con el correo ingresado
    const usuario = await Usuario.findOne({ email });

    // si no existe algun registro lanzamos un error
    if (!usuario) {
      res.status(400).json({
        ok: false,
        message: "Usuario o password incorrectos.",
      });
    }

    // confirmar los password
    const validarPassword = bcrypt.compareSync(password, usuario.password);

    if (!validarPassword) {
      return res.status(400).json({
        ok: false,
        message: "Usuario o password incorrectos.",
      });
    }

    // generamos nuestro JWT
    const token = await generarJWT(usuario.id, usuario.name);

    res.json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(201).json({
      ok: true,
      message: "login",
    });
  }
};

const revalidarToken = async (req, res = express.response) => {
  const { uid, name } = req;

  // generamos un nuevo token
  const token = await generarJWT(uid, name);

  res.json({
    ok: true,
    uid, name,
    token,
  });
};

module.exports = {
  crearUsuario,
  loginUsuarios,
  revalidarToken,
};
