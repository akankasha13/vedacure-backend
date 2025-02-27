const pool = require("./pool");

async function createUser(
  username,
  fullName,
  email,
  password,
  gender,
  age,
  weight,
  height,
  calories_burnt_today
) {
  try {
    await pool.query(
      "INSERT INTO users (username, full_name, email, password, gender, age, weight, height, calories_burnt_today) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);",
      [
        username,
        fullName,
        email,
        password,
        gender,
        age,
        weight,
        height,
        calories_burnt_today,
      ]
    );
    return true;
  } catch (error) {
    // throw error;
    return false;
  }
}

async function getUserByEmail(email) {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1;", [
      email,
    ]);
    return rows[0];
  } catch (error) {
    // throw new Error(`User does not exist with email ${email}`);
    return false;
  }
}

async function getUserByUsername(username) {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE username = $1;",
      [username]
    );
    return rows[0];
  } catch (error) {
    // throw new Error(`User does not exist with username ${username}`);
    return false;
  }
}

async function getUserById(id) {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE user_id = $1;",
      [id]
    );
    return rows[0];
  } catch (error) {
    // throw new Error(`User does not exist with id ${id}`);
    return false;
  }
}

async function updateUser(id, fullName, email, age, weight, height) {
  try {
    await pool.query(
      "UPDATE users SET full_name = $1, email = $2, age = $3, weight = $4, height = $5 WHERE user_id = $6;",
      [fullName, email, age, weight, height, id]
    );
    return true;
  } catch (error) {
    return false;
  }
}

async function updateUserCalories(id, calories_burnt_today) {
  try {
    await pool.query(
      "UPDATE users SET calories_burnt_today = $1 WHERE user_id = $2;",
      [calories_burnt_today, id]
    );
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = {
  createUser,
  getUserByEmail,
  getUserByUsername,
  getUserById,
  updateUser,
  updateUserCalories,
};
