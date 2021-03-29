const { PORT = 5000 } = process.env;

const path = require("path");
const app = require(path.resolve(`${process.env.SOLUTION_PATH || ""}`, "src/app"));

app.listen(PORT, () => console.log(`Server running on Port ${PORT}...`));
