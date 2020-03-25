import app from "./index";
import config from "./config";

app.listen(config.port, () =>
  console.log(`Comfygure API listening on port ${config.port}.`)
);
