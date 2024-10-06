// const app = require('./src/app');

// const PORT = process.env.PORT || 3056;

// const server = app.listen(PORT, () => {
//     console.log(`wsv eCommerce started With ${PORT}`);
// });

// process.on('SIGINT', () => {
//     server.close(() => console.log(`Exit Server Express`));
// });

const app = require('./src/app');
const PORT = process.env.DEV_APP_PORT || 3056;
const server = app.listen(PORT, () => {
    console.log(`Server eCommerce started with ${PORT}`);
});
process.on('SIGINT', () => server.close(() => console.log(`Exit Server Express`)));
