export default function CategoryNav({ categories, activeCategory, setActiveCategory }) {
  return (
    <section className="categories-section">
      <div className="container">
        <div className="categories">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-chip ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
