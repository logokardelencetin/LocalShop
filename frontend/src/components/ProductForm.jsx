import { useEffect, useState } from "react";

const EMPTY_FORM = {
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
};

const ProductForm = ({
    initialValues = EMPTY_FORM,
    onSubmit,
    loading = false,
    submitText = "Kaydet",
}) => {
    const [form, setForm] = useState(EMPTY_FORM);

    useEffect(() => {
        setForm({
            name: initialValues.name ?? "",
            description: initialValues.description ?? "",
            price: initialValues.price ?? "",
            stock: initialValues.stock ?? "",
            category: initialValues.category ?? "",
        });
    }, [initialValues]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        onSubmit({
            name: form.name.trim(),
            description: form.description.trim(),
            price: Number(form.price),
            stock: Number(form.stock),
            category: form.category.trim().toLowerCase(),
        });
    };

    return (
        <form
            className="form product-form"
            onSubmit={handleSubmit}
        >
            <label>
                Ürün Adı
                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    minLength={2}
                />
            </label>

            <label>
                Açıklama
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows={5}
                />
            </label>

            <div className="form-row">
                <label>
                    Fiyat
                    <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        required
                    />
                </label>

                <label>
                    Stok
                    <input
                        type="number"
                        name="stock"
                        value={form.stock}
                        onChange={handleChange}
                        min="0"
                        step="1"
                        required
                    />
                </label>
            </div>

            <label>
                Kategori
                <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="Örn. food"
                    required
                />
            </label>

            <button
                type="submit"
                className="button"
                disabled={loading}
            >
                {loading ? "Kaydediliyor..." : submitText}
            </button>
        </form>
    );
};

export default ProductForm;