const express = require('express');
const redis = require('redis');
const { promisify } = require('util');

const app = express();

const router = express.Router();

const port = 1245;

const client = redis.createClient();

const listProducts = [
    { id: 1, name: 'Suitcase 250', price: 50, stock: 4 },
    { id: 2, name: 'Suitcase 450', price: 100, stock: 10 },
    { id: 3, name: 'Suitcase 650', price: 350, stock: 2 },
    { id: 4, name: 'Suitcase 1050', price: 550, stock: 5 }
];

function getItemById(id) {
    return listProducts.find((item) => item.id === id);
}

function reserveStockById(itemId, stock) {
    client.set(`item.${itemId}`, stock, (err, reply) => {
        redis.print(`Reply: ${reply}`);
    });
}

async function getCurrentReservedStockById(itemId) {
    const getAsync = promisify(client.get).bind(client);
    const reservedStock = await getAsync(`item.${itemId}`);
    return reservedStock;
}

app.get('/list_products', (req, res) => {
    res.json(listProducts.map((item) => ({
        itemId: item.id,
        itemName: item.name,
        price: item.price,
        initialAvailableQuantity: item.stock
    })));
});

app.get('/list_products/:itemId', async (req, res) => {
    const itemId = Number(req.params.itemId);
    const item = getItemById(itemId);
    if (!item) {
        res.status(404).json({ status: 'Product not found' });
    } else {
        const reservedStock = await getCurrentReservedStockById(itemId);
        res.json({
            itemId: item.id,
            itemName: item.name,
            price: item.price,
            initialAvailableQuantity: item.stock - reservedStock
        });
    }
});

app.get('/reserve_product/:itemId', async (req, res) => {
    const itemId = Number(req.params.itemId);
    const item = getItemById(itemId);
    if (!item) {
        res.status(404).json({ status: 'Product not found' });
    } else {
        const reservedStock = await getCurrentReservedStockById(itemId);
        if (reservedStock >= item.stock) {
            res.status(403).json({ status: 'Not enough stock available', itemId });
        } else {
            reserveStockById(itemId, Number(reservedStock) + 1);
            res.json({ status: 'Reservation confirmed', itemId });
        }
    }
});

app.listen(port);