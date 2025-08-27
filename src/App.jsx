import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  // מצב עבור קטגוריות, ארוחות, הצגת פופאפ וארוחה נבחרת
  const [categories, setCategories] = useState([])
  const [meals, setMeals] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState(null)

  // מביא פרטי ארוחה כשהמשתמש לוחץ על כרטיס ארוחה
  const getMeal = async (mealId) => {
    try {
      let response = await axios(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
      await setSelectedMeal(response.data)
      setShowPopup(true)
    } catch (error) {
      console.log('שגיאה בטעינת ארוחה:', error) // TODO: להוסיף טיפול שגיאות טוב יותר
    }
  }

  useEffect(() => {
    (async () => {
      try {
        let response = await axios("https://www.themealdb.com/api/json/v1/1/list.php?c=list")
        setCategories(response.data.meals)
      } catch (error) {
        console.log('נכשל בטעינת קטגוריות:', error)
      }
    })()
  }, [])

  // מביא ארוחות לקטגוריה נבחרת
  const getMealsByCategory = async (category) => {
    try {
      let response = await axios(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
      setMeals(response.data.meals)
    } catch (error) {
      console.log('שגיאה בטעינת ארוחות:', error)
    }
  }

  return (
    <div className="container">
      {/* תפריט בחירת קטגוריה */}
      <div className="filters">
        <label htmlFor="category">Categories:</label>
        <select 
          id="category" 
          defaultValue="" 
          onChange={(e) => getMealsByCategory(e.currentTarget.value)}
        >
          <option value="" disabled>Select a category...</option>
          {categories && categories.map((category, index) => (
            <option key={index} value={category.strCategory}>
              {category.strCategory}
            </option>
          ))}
        </select>
      </div>
      
      {/* רשת הארוחות */}
      <div className="gallery">
        {meals && meals.map((meal, index) => (
          <MealCard key={index} meal={meal} getMeal={getMeal} />
        ))}
      </div>
      
      {/* פופאפ פרטי ארוחה */}
      {showPopup && <MealPopup meal={selectedMeal} setShowpop={setShowPopup} />}
    </div>
  )
}

// רכיב כרטיס ארוחה בודד
function MealCard({ meal, getMeal }) {
  return (
    <div 
      className="card" 
      id={meal.idMeal}
      style={{
        backgroundImage: `url(${meal.strMealThumb})`,
        backgroundSize: "100% 100%"
      }}
      onClick={(e) => getMeal(e.currentTarget.id)}
    >
      <h2>
        {/* קיצור שמות ארוחות ארוכים */}
        {meal.strMeal.length > 30 
          ? meal.strMeal.substring(0, 24) + "..." 
          : meal.strMeal
        }
      </h2>
    </div>
  )
}

// רכיב טבלת מרכיבים
function IngredientsTable({ ings }) {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Ingredient</th>
            <th>Measure</th>
          </tr>
        </thead>
        <tbody>
          {ings && ings.map((ing, index) => (
            <tr key={index}>
              <td>{ing.id}</td>
              <td>{ing.ing}</td>
              <td>{ing.measure}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// רכיב פופאפ פרטי ארוחה
function MealPopup({ meal, setShowpop }) {
  const [ingredients, setIngredients] = useState([])

  // מנתח מרכיבים מנתוני הארוחה
  useEffect(() => {
    let ingredientsList = []
    // ה-API מחזיר מרכיבים כ-strIngredient1, strIngredient2 וכו'
    for (let i = 1; i <= 15; i++) {
      const ingredient = meal.meals[0][`strIngredient${i}`]
      if (ingredient != null && ingredient.length) {
        ingredientsList.push({
          id: i,
          ing: meal.meals[0][`strIngredient${i}`],
          measure: meal.meals[0][`strMeasure${i}`]
        })
      }
    }
    setIngredients(ingredientsList)
  }, [meal])

  return (
    <div className="popup" onClick={() => setShowpop(false)}>
      <h1>{meal.meals[0].strMeal}</h1>
      <div 
        className="popContainer"
        style={{
          backgroundImage: `url(${meal.meals[0].strMealThumb})`,
          backgroundSize: "100% 100%"
        }}
      >
        <div className="ing">
          <IngredientsTable ings={ingredients} />
        </div>
        <div className="inst">
          <p>{meal.meals[0].strInstructions}</p>
        </div>
      </div>
    </div>
  )
}

export default App


