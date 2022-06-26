const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
const dbPath = path.join(__dirname, "movies.db");

app.use(express.json());

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, async () => {
      console.log("server started");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

app.get("/movies/", async (request, response) => {
  const getMoviesQuery = `
    SELECT
      *
    FROM
      movies
    ORDER BY
      name;
    `;
  const moviesArray = await db.all(getMoviesQuery);
  response.send(moviesArray);
});

app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { name, image, summary } = movieDetails;
  const addMovieQuery = `
    INSERT INTO movies(name, image, summary)
    VALUES ('${name}', '${image}', '${summary}';)
    `;
  const movie = await db.run(addMovieQuery);
  response.send("Movie added");
});

app.put("/movies/name/", async (request, response) => {
  const { image, summary } = request.body;
  const { name } = request.params;
  const updateMovieQuery = `
    UPDATE movies SET image=${image}, summary='${summary}'
    WHERE name='${name}';
    `;
  await db.run(updateMovieQuery);
  response.send("Movie Details Updated");
});

app.delete("/movies/:name/"),
  async (request, response) => {
    const { name } = request.params;
    const deleteMovieQuery = `
    DELETE FROM movies WHERE name='${name}';
    `;
    await db.run(deleteMovieQuery);
    response.send("Movie Deleted");
  };
