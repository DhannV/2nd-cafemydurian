import passport from "passport";

const authController = {
  googleLogin: passport.authenticate("google", {
    scope: ["email", "profile"],
  }),

  googleCallback: passport.authenticate("google", {
    failureRedirect: "/login",
    session: true,
  }),

  googleSuccess: (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Login gagal" });
    }

    // Opsional: simpan data admin custom
    req.session.admin = {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
    };

    res.redirect("http://localhost:5173/admin/dashboard");
  },

  googleLogout: (req, res) => {
    req.logout(err => {
      if (err) {
        return res.status(500).json({ message: "Logout gagal" });
      }

      req.session.destroy(err => {
        if (err) {
          return res.status(500).json({ message: "Session destroy gagal" });
        }

        res.clearCookie("cafemydurian-session");
        res.json({ message: "Logout berhasil" });
      });
    });
  },
};

export default authController;
