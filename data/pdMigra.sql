CREATE TABLE customer (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL UNIQUE,
    customer_address VARCHAR(255),
    phone VARCHAR(255)
);


CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    product_sku VARCHAR(255) UNIQUE,
    product_name VARCHAR(255),
    unit_price DECIMAL,
    id_pcategory INTEGER REFERENCES product_categories(id_pcategory)
);


CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    supplier_name VARCHAR(255),
    supplier_email VARCHAR(255) UNIQUE
);



CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    id_orders VARCHAR(50) REFERENCES orders(id_orders),
    id_customer INTEGER REFERENCES customer(id),
    id_supplier INTEGER REFERENCES suppliers(id),
    id_product INTEGER REFERENCES product(id),
    quantity INTEGER,
    total_line_value DECIMAL
);



CREATE TABLE product_categories (
	id_pcategory SERIAL PRIMARY KEY,
	category_name VARCHAR(100) NOT NULL UNIQUE,
);


CREATE TABLE orders (
    id_orders SERIAL PRIMARY KEY,
	transactions_id VARCHAR(50) UNIQUE
    orders_date DATE NOT NULL
);


ALTER TABLE customer
ADD FOREIGN KEY(id_customer) REFERENCES transactions(id_customer)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE transactions
ADD FOREIGN KEY(id_transactions) REFERENCES product(id_product)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE suppliers
ADD FOREIGN KEY(id_supplier) REFERENCES transactions(id_supplier)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE product_categories
ADD FOREIGN KEY(id_pcategory) REFERENCES product(id_pcategory)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE orders
ADD FOREIGN KEY(id_orders) REFERENCES transactions(id_orders)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE product_categories
ADD CONSTRAINT unique_category_name UNIQUE (category_name);