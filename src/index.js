// Import module
const app = require('./app');

const port = process.env.PORT;

// App started
app.listen(port, () => {
    console.log(`Server running on Port: ${port}`);
});
