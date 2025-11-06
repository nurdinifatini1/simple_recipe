import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [search, setSearch] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");

  // Fetch categories when the app loads
  useEffect(() => {
    fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []));
  }, []);

  // Search by name
  const fetchRecipes = async () => {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`
    );
    const data = await res.json();
    setRecipes(data.meals || []);
    setActiveCategory("");
  };

  // Filter by category
  const fetchByCategory = async (cat) => {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`
    );
    const data = await res.json();
    setRecipes(data.meals || []);
    setActiveCategory(cat);
    setSearch("");
  };

  // Get full recipe details by ID
  const fetchRecipeDetails = async (id) => {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    const data = await res.json();
    setSelected(data.meals ? data.meals[0] : null);
  };

  return (
    <div className="App">
      <h1>🍳 Recipe Finder</h1>

      {/* Search box */}
      <div className="search-box">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search recipes..."
        />
        <button onClick={fetchRecipes}>Search</button>
      </div>

      {/* Category buttons */}
      <div className="categories">
        {categories.slice(0, 8).map((cat) => (
          <button
            key={cat.idCategory}
            className={activeCategory === cat.strCategory ? "active" : ""}
            onClick={() => fetchByCategory(cat.strCategory)}
          >
            {cat.strCategory}
          </button>
        ))}
      </div>

      {/* Recipe cards */}
      <div className="recipes">
        {recipes.map((r) => (
          <div
            key={r.idMeal}
            className="card"
            onClick={() => fetchRecipeDetails(r.idMeal)}
          >
            <img src={r.strMealThumb} alt={r.strMeal} />
            <h3>{r.strMeal}</h3>
            <p>{r.strCategory || activeCategory}</p>
          </div>
        ))}
      </div>

      {/* Popup details */}
      {selected && (
        <div className="popup" onClick={() => setSelected(null)}>
          <div className="popup-inner" onClick={(e) => e.stopPropagation()}>
            <h2>{selected.strMeal}</h2>
            <img src={selected.strMealThumb} alt={selected.strMeal} />
            <p>
              <strong>Category:</strong> {selected.strCategory}
            </p>
            <p>
              <strong>Area:</strong> {selected.strArea}
            </p>
            <p>
              <strong>Instructions:</strong>
            </p>
            <p className="instructions">{selected.strInstructions}</p>
            <button onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
