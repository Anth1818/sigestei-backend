import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { AuthError } from "../services/auth.service";

export const login = async (req: Request, res: Response): Promise<Response> => {
  // El tipo del body también podría ser validado con librerías como Zod o class-validator
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email y contraseña requeridos" });
  }

  try {
    // Extraer IP y User-Agent para auditoría
    const ipAddress = req.ip || req.socket.remoteAddress || undefined;
    const userAgent = req.get("User-Agent") || undefined;

    const { token, user } = await authService.loginUser(
      email,
      password,
      ipAddress,
      userAgent,
    );

    const isSecureContext =
      req.secure || req.get("X-Forwarded-Proto") === "https";

    const cookieOptions = {
      httpOnly: true,
      secure: isSecureContext, // true solo si hay HTTPS
      maxAge: 8 * 60 * 60 * 1000,
      sameSite: isSecureContext ? ("none" as const) : ("lax" as const),
      path: "/",
    };

    res.cookie("auth-token", token, cookieOptions);

    return res.status(200).json({
      message: "Login exitoso",
      user,
      token, // Enviar también el token en la respuesta como fallback
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    // Para cualquier otro error inesperado
    console.error(error); // Es buena idea loguear el error real
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const logout = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    // Suponiendo que tienes el userId en req.user (middleware de autenticación)
    const userId = req.user?.id;
    if (userId) {
      await authService.logoutUser(userId);
    }

    const isProduction = process.env.NODE_ENV === "production";

    res.clearCookie("auth-token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
    });

    return res.status(200).json({ message: "Logout exitoso" });
  } catch (error) {
    return res.status(500).json({ message: "Error al cerrar sesión" });
  }
};
