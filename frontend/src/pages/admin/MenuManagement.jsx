import { useEffect, useState } from "react";

const categories = ["durian", "kopi", "gula"];

export default function MenuAdmin() {
  const [menus, setMenus] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    id: null,
    name: "",
    price: "",
    category: "",
    image: null, // file baru
    oldImage: null, // path gambar lama
  });

  // ================= FETCH MENU =================
  const fetchMenus = async () => {
    try {
      const res = await fetch(
        "https://twond-cafemydurian.onrender.com/api/menu"
      );
      const json = await res.json();
      setMenus(json.data || json);
    } catch (err) {
      console.error("Gagal fetch menu:", err);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  // ================= FORM HANDLER =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const resetForm = () => {
    setForm({
      id: null,
      name: "",
      price: "",
      category: "",
      image: null,
      oldImage: null,
    });
    setShowForm(false);
    setLoading(false);
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.category) {
      alert("Lengkapi semua field!");
      return;
    }

    // image wajib hanya saat tambah
    if (!form.id && !form.image) {
      alert("Gambar wajib diisi!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("category", form.category);
    if (form.image) {
      formData.append("image", form.image);
    }

    const isEdit = Boolean(form.id);
    const url = isEdit
      ? `https://twond-cafemydurian.onrender.com/api/menu/${form.id}`
      : "https://twond-cafemydurian.onrender.com/api/menu";

    try {
      await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        body: formData,
        credentials: "include",
      });

      resetForm();
      fetchMenus();
    } catch (err) {
      console.error("Gagal simpan menu:", err);
      setLoading(false);
    }
  };

  // ================= ACTION =================
  const handleEdit = (menu) => {
    setForm({
      id: menu.id,
      name: menu.name,
      price: menu.price,
      category: menu.category,
      image: null,
      oldImage: menu.image,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus menu ini?")) return;

    try {
      await fetch(`https://twond-cafemydurian.onrender.com/api/menu/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      fetchMenus();
    } catch (err) {
      console.error("Gagal hapus menu:", err);
    }
  };

  // ================= RENDER =================
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Management Menu</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-orange-500 text-white px-4 py-2 rounded"
        >
          + Tambah Menu
        </button>
      </div>

      {/* ================= FORM ================= */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow mb-6"
        >
          <h2 className="font-bold mb-4">
            {form.id ? "Edit Menu" : "Tambah Menu"}
          </h2>

          {/* PREVIEW GAMBAR */}
          {form.image ? (
            <img
              src={URL.createObjectURL(form.image)}
              alt="Preview Baru"
              className="w-24 h-24 object-cover rounded mb-3"
            />
          ) : form.oldImage ? (
            <img
              src={`https://twond-cafemydurian.onrender.com${form.oldImage}`}
              alt="Preview Lama"
              className="w-24 h-24 object-cover rounded mb-3"
            />
          ) : null}

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nama Menu"
            className="w-full border p-2 rounded mb-3"
          />

          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            type="number"
            placeholder="Harga"
            className="w-full border p-2 rounded mb-3"
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-3"
          >
            <option value="">-- Pilih Kategori --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.toUpperCase()}
              </option>
            ))}
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="mb-4"
          />

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-500 text-white px-4 py-2 rounded disabled:opacity-60"
            >
              {loading ? "Menyimpan..." : form.id ? "Update" : "Simpan"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-200 px-4 py-2 rounded"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {/* ================= TABLE ================= */}
      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Gambar</th>
            <th className="p-3 text-left">Nama</th>
            <th className="p-3 text-left">Kategori</th>
            <th className="p-3 text-left">Harga</th>
            <th className="p-3">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {menus.map((menu) => (
            <tr key={menu.id} className="border-t">
              <td className="p-3">
                <img
                  src={`https://twond-cafemydurian.onrender.com${menu.image}`}
                  alt={menu.name}
                  className="w-16 h-16 object-cover rounded"
                />
              </td>
              <td className="p-3">{menu.name}</td>
              <td className="p-3 capitalize">{menu.category}</td>
              <td className="p-3">Rp {menu.price}</td>
              <td className="p-3 flex gap-3 justify-center">
                <button
                  onClick={() => handleEdit(menu)}
                  className="text-blue-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(menu.id)}
                  className="text-red-500"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
