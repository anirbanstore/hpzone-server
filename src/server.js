require('./database/mongodb');
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`hpzone-server started on ${PORT}`));