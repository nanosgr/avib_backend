var pool = require('./bd');

async function getProducts() {
    try {
        var query = "select * from productos";
        var rows = await pool.query(query);
        return rows;
    }catch(error) {
        console.log(error);
        throw error;
    }
};

async function getProductById(id) {
    try {
        var query = "select * from productos where id = ?";
        var rows = await pool.query(query, id);
        return rows[0];
    }catch(error) {
        console.log(error);
        throw error;
    }
};

async function addProduct(obj) {
    try {
        var query = "insert into productos set ?";
        var rows = await pool.query(query, [obj]);
        return rows;
    }catch(error) {
        console.log(error);
        throw error;
    }
};

async function updateProduct(obj, id) {
    try {
        var query = "update productos set ? where id=?";
        var rows = await pool.query(query, [obj, id]);
        return rows;
    }catch(error) {
        console.log(error);
        throw error;
    }
};

async function deleteProduct(id) {
    try {
        var query = "delete from productos where id=?";
        var rows = await pool.query(query, [+id]);
        return rows;
    }catch(error) {
        console.log(error);
        throw error;
    }
};

module.exports = {getProducts, addProduct, getProductById, updateProduct, deleteProduct};