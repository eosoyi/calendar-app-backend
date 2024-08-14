const { Router } = require("express");
const router = Router();
const { check } = require("express-validator");

const {
  crearUsuario,
  loginUsuarios,
  revalidarToken,
} = require("../controllers/auth");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");

/**
 * RUTAS DE USUARIOS / AUTH
 * host + /api/auth + endpoint
 * example : localhost:4000/api/auth/ping
 */

router.get("/ping", (req, res) => {
  res.json({
    ok: true,
    message: "ping...",
  });
});

router.post(
  "/new",
  [
    check("name", "El nombre es requerido").not().isEmpty(),
    check("email", "El correo es requerido").isEmail(),
    check("password", "El password debe ser de 6 caracteres").isLength({
      min: 6,
    }),
    validarCampos,
  ],
  crearUsuario
);

router.post(
  "/",
  [
    check("email", "El correo es requerido").isEmail(),
    check("password", "El password es requerido").not().isEmpty(),
    validarCampos,
  ],
  loginUsuarios
);

router.get("/renew", validarJWT, revalidarToken);

module.exports = router;
